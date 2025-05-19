const AppConfig = require("../model/app-config");
const { Op } = require("sequelize");
const EventSchedule = require("../model/event-schedule");
const Community = require("../model/community");
const EventImageMapping = require("../model/event-image-mapping");
const EventItemMapping = require("../model/event-item-mapping");
const DecorationItem = require("../model/decoration-items");
// Function to calculate Haversine distance
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (Math.PI / 180) * value;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// Find the closest community to a given location
const findClosestCommunity = (currentLocation, communities) => {
  let closest = null;
  let minDistance = Infinity;

  for (const community of communities) {
    const lat = parseFloat(community.latitude);
    const lon = parseFloat(community.longitude);
    const distance = haversineDistance(
      currentLocation.lat,
      currentLocation.lon,
      lat,
      lon
    );

    if (distance < minDistance) {
      closest = { ...community, distance }; // Include distance property
      minDistance = distance;
    }
  }

  return closest;
};

// Order communities by proximity
exports.orderCommunitiesByProximity = async (communities) => {
  if (!communities || communities.length === 0) return [];

  let LATITUDE = await AppConfig.findOne({ where: { configName: "LATITUDE" } });
  let LONGITUDE = await AppConfig.findOne({
    where: { configName: "LONGITUDE" },
  });

  let remainingCommunities = [...communities];
  let orderedCommunities = [];

  // Step 1: Find the closest community to the base location
  let closestToBase = findClosestCommunity(
    { lat: LATITUDE.value, lon: LONGITUDE.value },
    remainingCommunities
  );

  orderedCommunities.push(closestToBase);
  remainingCommunities = remainingCommunities.filter(
    (c) => c.id !== closestToBase.id
  );

  // Step 2: Iteratively find the closest to the last added community
  while (remainingCommunities.length > 0) {
    let lastCommunity = orderedCommunities[orderedCommunities.length - 1];

    let nextClosest = findClosestCommunity(
      {
        lat: parseFloat(lastCommunity.latitude),
        lon: parseFloat(lastCommunity.longitude),
      },
      remainingCommunities
    );

    if (!nextClosest) break; // Safety check to prevent infinite loop

    orderedCommunities.push(nextClosest);
    remainingCommunities = remainingCommunities.filter(
      (c) => c.id !== nextClosest.id
    );
  }

  return orderedCommunities;
};

exports.getSortedListByDistance = async (communities) => {
  // Add distance property and sort the list
  let LATITUDE = await AppConfig.findOne({ where: { configName: "LATITUDE" } });
  let LONGITUDE = await AppConfig.findOne({
    where: { configName: "LONGITUDE" },
  });
  const sortedCommunities = communities
    .map((community) => {
      const lat = parseFloat(community.latitude);
      const lon = parseFloat(community.longitude);

      // Calculate distance from the base location
      const distance = haversineDistance(
        LATITUDE.value,
        LONGITUDE.value,
        lat,
        lon
      );

      console.log(`Distance for ${community.communityName}:`, distance); // Debugging

      return {
        ...community, // Spread the existing community properties
        distance: Number(distance), // Ensure it's a number
      };
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance

  return sortedCommunities;
};

exports.getSortedScheduledListByDistance = async (schedules) => {
  let LATITUDE = await AppConfig.findOne({ where: { configName: "LATITUDE" } });
  let LONGITUDE = await AppConfig.findOne({
    where: { configName: "LONGITUDE" },
  });
  // Add distance property and sort the list
  const sortedSchedule = schedules
    .map((schedule) => {
      const lat = parseFloat(schedule.community.latitude);
      const lon = parseFloat(schedule.community.longitude);

      // Calculate distance from the base location
      const distance = haversineDistance(
        LATITUDE.value,
        LONGITUDE.value,
        lat,
        lon
      );

      console.log(
        `Distance for ${schedule.community.communityName}:`,
        distance
      ); // Debugging

      return {
        ...schedule, // Spread the existing community properties
        distance: Number(distance), // Ensure it's a number
      };
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance

  return sortedSchedule;
};
exports.getAllEventByStatusAndDate = async (status, scheduledDate) => {
  try {
    let query = {};
    if (status) {
      query.status = status.toLowerCase();
    } else {
      query.status = "active";
    }
    if (scheduledDate && scheduledDate !== "") {
      currentDay = scheduledDate;
    }
    query[Op.and] = [
      {
        scheduledStartDate: {
          [Op.lte]: currentDay,
        },
      },
      {
        scheduledEndDate: {
          [Op.gte]: currentDay,
        },
      },
    ];
    let response = await EventSchedule.findAll({
      where: query,
      include: [
        { model: Community },
        { model: EventImageMapping },
        { model: EventItemMapping, include: DecorationItem },
      ],
      order: [
        [
          EventSchedule.sequelize.fn(
            "STR_TO_DATE",
            EventSchedule.sequelize.col("scheduledStartDate"),
            "%m-%d-%Y"
          ),
          "ASC",
        ],
      ],
    });

    let communitySummary = [];
    let allUsedItems = [];

    if (response && response.length > 0) {
      for (let index = 0; index < response.length; index++) {
        const event = response[index].dataValues;
        let imageList = [];
        let itemList = [];

        if (event.eventImageMappings && event.eventImageMappings.length > 0) {
          for (
            let imgIndex = 0;
            imgIndex < event.eventImageMappings.length;
            imgIndex++
          ) {
            const imageMap = event.eventImageMappings[imgIndex].dataValues;
            imageList.push(imageMap.imageName);
          }
        }

        if (event.eventItemMappings && event.eventItemMappings.length > 0) {
          for (
            let itemIndex = 0;
            itemIndex < event.eventItemMappings.length;
            itemIndex++
          ) {
            const itemMap = event.eventItemMappings[itemIndex].dataValues;
            const usedItem = {
              itemName: itemMap.decorationItem.itemName,
              requiredQuantity: itemMap.requiredQuantity,
              usedQuantity: itemMap.usedQuantity,
              unitType: itemMap.decorationItem.unitType,
            };
            itemList.push(usedItem);
            allUsedItems.push(usedItem);
          }
        }

        communitySummary.push({
          communityName: event.community.communityName,
          title: event.title,
          phone:event.community.phone,
          communityAddress:event.community.communityAddress,
          description: event.description,
          uploadedImages: imageList,
          usedItems: itemList,
        });
      }
    }

    // Group allUsedItems by itemName and merge quantities
    let groupedUsedItems = allUsedItems.reduce((acc, item) => {
      let existingItem = acc.find((i) => i.itemName === item.itemName);
      if (existingItem) {
        existingItem.requiredQuantity += item.requiredQuantity;
        existingItem.usedQuantity += item.usedQuantity;
      } else {
        acc.push({ ...item });
      }
      return acc;
    }, []);

    return {
      eventSummary: communitySummary,
      requiredItemList: groupedUsedItems,
    };
  } catch (error) {
    throw new Error(
      "Error Occurred while fetching events by date in common service.Error: "+ error.message
    );
  }
};

