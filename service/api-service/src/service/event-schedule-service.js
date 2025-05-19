const Community = require("../model/community");
const DecorationItem = require("../model/decoration-items");
const EventImageMapping = require("../model/event-image-mapping");
const EventItemMapping = require("../model/event-item-mapping");
const EventSchedule = require("../model/event-schedule");
const uploadService = require("./upload-file-service");
const db = require("../connector/db-connector");
const TransactionHisory = require("../model/transaction-history");
const moment = require("moment-timezone");
const { Op } = require("sequelize");
const logger = require("../../logger");
const Notification = require("../model/notification");

exports.addEventSchedule = async (req) => {
  let payload = req.body;
  let createdEvent;
  let tnxHistory;
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6 digit random number
  try {
    let eventModel = {
      status: "active",
      scheduledStartDate: payload.scheduledStartDate,
      scheduledEndDate: payload.scheduledEndDate,
      communityId: payload.communityId,
      title: payload.title,
      description: payload.description,
      totalBill: payload.totalBill,
      totalPaid: payload.totalPaid
    };
    let tnxModel = {
      amount: payload.deposit,
      tnxDate: moment().tz("America/New_York").format("MM-DD-YYYY"),
      remark: "Advance Payment",
      communityId: payload.communityId,
    };
    tnxHistory = await TransactionHisory.create(tnxModel);
    createdEvent = await EventSchedule.create(eventModel);
    if (payload.uploadedImages && payload.uploadedImages.length > 0) {
      for (let index = 0; index < payload.uploadedImages.length; index++) {
        const imageName = payload.uploadedImages[index];
        const imagePath = "/uploads/" + imageName;
        let createdImageMapping = await EventImageMapping.create({
          imageName: imageName,
          imagePath: imagePath,
          eventScheduleId: createdEvent.id,
        });
      }
    }
    if (payload.usedItems && payload.usedItems.length > 0) {
      for (let index = 0; index < payload.usedItems.length; index++) {
        const usedItem = payload.usedItems[index];
        const existingItem = await DecorationItem.findOne({
          where: { id: usedItem.id },
        });
        const updatedItem = {
          quantity: existingItem.quantity - usedItem.requiredQuantity,
        };
        let updatedProduct = await DecorationItem.update(updatedItem, {
          where: { id: usedItem.id },
        });
        let createdItemMapping = await EventItemMapping.create({
          requiredQuantity: usedItem.requiredQuantity || 0,
          usedQuantity: usedItem.usedQuantity || 0,
          decorationItemId: usedItem.id,
          eventScheduleId: createdEvent.id,
        });
      }
    }
    await checkLowQuantityItemsAndSendNotification();
    let newEvent = await EventSchedule.findOne({
      where: { id: createdEvent.id },
      include: [EventImageMapping, EventItemMapping],
    });
    // Pad createdEvent.id to 4 digits with leading zeros
    const paddedId = String(createdEvent.id).padStart(4, '0');
    return newEvent;
  } catch (error) {
    let deletedTnxHistory = await TransactionHisory.destroy({
      where: { id: tnxHistory.id },
    });
    if (createdEvent) {
      let deletedItemMapping = await EventItemMapping.destroy({
        where: { eventScheduleId: createdEvent.Id },
      });
      let deletedImageMapping = await EventImageMapping.destroy({
        where: { eventScheduleId: createdEvent.Id },
      });
      let deletedEvent = await EventSchedule.destroy({
        where: { id: createdEvent.Id },
      });
    }
    throw new Error("Not Created: " + error.message);
  }
};
exports.updateEventSchedule = async (req, res, next) => {
  let tnxHistory;
  let newEvent;
  try {
    await db.sequelize.transaction(async (t) => {
      let payload = req.body;
      let eventModel = {
        scheduledStartDate: payload.scheduledStartDate,
        scheduledEndDate: payload.scheduledEndDate,
        communityName: payload.communityName,
        title: payload.title,
        description: payload.description,
        totalPaid: payload.totalPaid,
      };
      if (payload.deposit && payload.deposit > 0) {
        let tnxModel = {
          amount: payload.deposit,
          tnxDate: moment().tz("America/New_York").format("MM-DD-YYYY"),
          remark: "Deposit",
          communityId: payload.communityId,
        };
        tnxHistory = await TransactionHisory.create(tnxModel, {
          transaction: t,
        });
      }
      let response = await EventSchedule.update(eventModel, {
        where: { id: payload.id },
        transaction: t,
      });
      if (payload.newUploadedImages && payload.newUploadedImages.length > 0) {
        for (let index = 0; index < payload.newUploadedImages.length; index++) {
          const imageName = payload.newUploadedImages[index];
          const imagePath = "/uploads/" + imageName;
          let createdImageMapping = await EventImageMapping.create(
            {
              imageName: imageName,
              imagePath: imagePath,
              eventScheduleId: payload.id,
            },
            { transaction: t }
          );
        }
      }
      if (payload.newUsedItems && payload.newUsedItems.length > 0) {
        for (let index = 0; index < payload.newUsedItems.length; index++) {
          const usedItem = payload.newUsedItems[index];
          const existingItem = await DecorationItem.findOne({
            where: { id: usedItem.id },
          });
          const updatedItem = {
            quantity: existingItem.quantity - usedItem.requiredQuantity,
          };
          let updatedProduct = await DecorationItem.update(updatedItem, {
            where: { id: usedItem.id },
            transaction: t,
          });
          let createdItemMapping = await EventItemMapping.create(
            {
              requiredQuantity: usedItem.requiredQuantity || 0,
              usedQuantity: usedItem.usedQuantity || 0,
              decorationItemId: usedItem.id,
              eventScheduleId: payload.id,
            },
            { transaction: t }
          );
        }
      }
      newEvent = await EventSchedule.findOne({
        where: { id: payload.id },
        include: [EventImageMapping, EventItemMapping],
      });
    });
    await checkLowQuantityItemsAndSendNotification();
    return newEvent;
  } catch (error) {
    throw new Error("Not Updated: " + error.message);
  }
};
exports.getAllEventSchedule = async (req) => {
  try {
    let params = req.query;
    let query = {};
    if (params.status || params.status != "") {
      query.status = params.status.toLowerCase();
    }
    if (
      params.scheduledDate &&
      params.scheduledDate !== "" &&
      query.status == "active"
    ) {
      query[Op.and] = [
        {
          scheduledStartDate: {
            [Op.lte]: params.scheduledDate,
          },
        },
        {
          scheduledEndDate: {
            [Op.gte]: params.scheduledDate,
          },
        },
      ];
    }
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
    let eventList = [];
    if (response && response.length > 0) {
      for (let index = 0; index < response.length; index++) {
        const event = response[index].dataValues;
        let imageList = [];
        let itemList = [];
        if (event.eventImageMappings && event.eventImageMappings.length > 0) {
          for (
            let index = 0;
            index < event.eventImageMappings.length;
            index++
          ) {
            const imageMap = event.eventImageMappings[index].dataValues;
            imageList.push(imageMap.imageName);
          }
        }
        if (event.eventItemMappings && event.eventItemMappings.length > 0) {
          for (let index = 0; index < event.eventItemMappings.length; index++) {
            const itemMap = event.eventItemMappings[index].dataValues;
            itemList.push({
              itemName: itemMap.decorationItem.itemName,
              usedQuantity: itemMap.usedQuantity,
              unitType: itemMap.decorationItem.unitType,
            });
          }
        }

        eventList.push({
          id: event.id,
          title: event.title,
          scheduledStartDate: event.scheduledStartDate,
          scheduledEndDate: event.scheduledEndDate,
          communityName: event.community.communityName,
          communityAddress: event.community.communityAddress,
          phone: event.community.phone,
          email: event.community.email,
          usedItems: itemList,
          uploadedImages: imageList,
          totalBill: event.totalBill,
          totalPaid: event.totalPaid,
          status: event.status,
        });
      }
    }
    return eventList;
  } catch (error) {
    throw new Error("Not Found: " + error.message);
  }
};
exports.getEventScheduleById = async (params) => {
  try {
    let response = await EventSchedule.findOne({
      where: { id: params.id },
      include: [
        { model: Community },
        { model: EventImageMapping },
        { model: EventItemMapping, include: DecorationItem },
      ],
    });
    if (!response) {
      throw new Error("Event Schedule not found");
    }
    let imageList = [];
    let itemList = [];
    if (response.eventImageMappings && response.eventImageMappings.length > 0) {
      for (let index = 0; index < response.eventImageMappings.length; index++) {
        const imageMap = response.eventImageMappings[index].dataValues;
        imageList.push(imageMap.imageName);
      }
    }
    if (response.eventItemMappings && response.eventItemMappings.length > 0) {
      for (let index = 0; index < response.eventItemMappings.length; index++) {
        const itemMap = response.eventItemMappings[index].dataValues;
        itemList.push({
          id: itemMap.decorationItem.id,
          itemName: itemMap.decorationItem.itemName,
          requiredQuantity: itemMap.requiredQuantity,
          usedQuantity: itemMap.usedQuantity,
          unitType: itemMap.decorationItem.unitType,
        });
      }
    }
    return {
      id: response.id,
      title: response.title,
      description: response.description,
      scheduledStartDate: response.scheduledStartDate,
      scheduledEndDate: response.scheduledEndDate,
      communityId: response.community.id,
      communityName: response.community.communityName,
      communityAddress: response.community.communityAddress,
      phone: response.community.phone,
      email: response.community.email,
      usedItems: itemList,
      uploadedImages: imageList,
      totalBill: response.totalBill,
      totalPaid: response.totalPaid,
      status: response.status,
    };
  } catch (error) {
    throw new Error("Not Found: " + error.message);
  }
};

exports.deleteEventSchedule = async (req, res, next) => {
  try {
    const sequelize = EventSchedule.sequelize;
    await db.sequelize.transaction(async (t) => {
      let eventImages = await EventImageMapping.findAll({
        where: { eventScheduleId: req.query.id },
        transaction: t,
      });
      await EventItemMapping.destroy({
        where: { eventScheduleId: req.query.id },
        transaction: t,
      });
      await EventImageMapping.destroy({
        where: { eventScheduleId: req.query.id },
        transaction: t,
      });
      await EventSchedule.destroy({
        where: { id: req.query.id },
        transaction: t,
      });
      if (eventImages && eventImages.length > 0) {
        for (let index = 0; index < eventImages.length; index++) {
          const element = eventImages[index];
          await uploadService.deleteImage(element.imageName);
        }
      }
    });
    return "SUCCESS";
  } catch (error) {
    throw new Error("Not Deleted: " + error.message);
  }
};

exports.completeEvent = async (req) => {
  let params = req.body;
  try {
    let event = await EventSchedule.findOne({
      where: { id: params.id },
    });

    let usedItems = await EventItemMapping.findAll({
      where: { eventScheduleId: params.id },
      include: DecorationItem,
    });

    if (usedItems && usedItems.length > 0) {
      for (let index = 0; index < usedItems.length; index++) {
        const usedItem = usedItems[index];
        const updatedQuantity =
          usedItem.decorationItem.quantity + usedItem.usedQuantity;

        await DecorationItem.update(
          { quantity: updatedQuantity },
          { where: { id: usedItem.decorationItem.id } }
        );
      }
    }
    event.status = "completed";
    event.save();
    return "completed";
  } catch (error) {
    throw new Error("Event Not complted. Error: " + error.message);
  }
};

exports.getEventScheduledSummary = async (req) => {
  let params = req.query;
  let currentDay = moment().tz("America/New_York").format("YYYY-MM-DD");
  try {
    let query = {};
    if (params.status) {
      query.status = params.status.toLowerCase();
    } else {
      query.status = "active";
    }
    if (params.scheduledDate && params.scheduledDate !== "") {
      currentDay = params.scheduledDate;
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
    throw new Error("Summary Fetching Failed. Error: " + error.message);
  }
};
exports.updateItemMapping = async (req) => {
  let payload = req.body;
  try {
    if (payload.items && payload.items.length > 0) {
      for (let index = 0; index < payload.items.length; index++) {
        const element = payload.items[index];
        let itemMappingToUpdate = await EventItemMapping.findOne({
          where: {
            decorationItemId: element.itemId,
            eventScheduleId: payload.eventId,
          },
        });
        itemMappingToUpdate.usedQuantity =
          itemMappingToUpdate.usedQuantity + element.newQuantityUsed;
        itemMappingToUpdate.save();
      }
    }

    return "SUCCESS";
  } catch (error) {
    throw new Error("Update Failed. Error: " + error.message);
  }
};

const checkLowQuantityItemsAndSendNotification = async () => {
  try {
    let lowQuanityItems = await DecorationItem.findAll({ where: { quantity: { [Op.lt]: 10 } } });
    if (lowQuanityItems.length>0){
      for(let i =0;i<lowQuanityItems.length;i++){
        let item = lowQuanityItems[i];
        let notificationModel = {
          title: "Low Stock Alert",
          content: `"${item.itemName}" has only ${item.quantity} units remaining in inventory. Please restock soon.`,
          isViewed: false
        };
        let response = await Notification.create(notificationModel);
      }
    }
  } catch (error) {
    logger.error(`Error occurred on SMS: ${error.message}`, {
      stack: error.stack,
    });
  }
};
