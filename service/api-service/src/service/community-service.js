const Community = require("../model/community");
const CommonService = require("../service/common-service");
const moment = require("moment-timezone");
const logger = require("../../logger");
const EventSchedule = require("../model/event-schedule");
const TransactionHisory = require("../model/transaction-history");
exports.addCommunity = async (req, res) => {
  try {
    let payload = req.body;
    let communityEntity = {
      communityName: payload.communityName,
      communityAddress: payload.communityAddress,
      latitude: payload.latitude,
      longitude: payload.longitude,
      camOfcommunity: payload.camOfcommunity,
      gateCode: payload.gateCode,
      phone: payload.phone,
      email: payload.email,
      lockBoxCode: payload.lockBoxCode,
      hasPower:payload.hasPower
    };
    let newCommunity = await Community.create(communityEntity);
    
    return newCommunity;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred:", error);
  }
};
exports.updateCommunity = async (req, res) => {
  try {
    let payload = req.body;
    // Update Community entity
    let communityEntity = {
      communityName: payload.communityName,
      communityAddress: payload.communityAddress,
      latitude: payload.latitude,
      longitude: payload.longitude,
      camOfcommunity: payload.camOfcommunity,
      gateCode: payload.gateCode,
      phone: payload.phone,
      email: payload.email,
      lockBoxCode: payload.lockBoxCode,
      hasPower:payload.hasPower
    };

    let updatedCommunity = await Community.update(communityEntity, {
      where: { id: payload.id },
    });

    if (!updatedCommunity[0]) {
      throw new Error("Community not found.");
    }

    let community = await Community.findOne({
      where: { id: payload.id },
      include: EventSchedule,
    });

    if (!community) {
      throw new Error("Community not found after update.");
    }

    // Construct response data
    const communityData = {
      communityId: community.id,
      communityName: community.communityName,
      communityAddress: community.communityAddress,
      latitude: community.latitude,
      longitude: community.longitude,
      gateCode: community.gateCode,
      camOfcommunity: community.camOfcommunity,
      phone: community.phone,
      email: community.email,
      lockBoxCode: community.lockBoxCode,
    };
    return communityData;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.getAllCommunitiesWithDistanceFromBase = async (req, res) => {
  let sortedCommunities = [];
  try {
    let communities = await Community.findAll({include:EventSchedule});
    if (!communities || communities.length === 0) {
      return [];
    }
    sortedCommunities = await CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    const result = sortedCommunities.map(community => {
      const communityData = {
        id: community.id,
        communityName: community.communityName,
        communityAddress: community.communityAddress,
        latitude:community.latitude,
        longitude:community.longitude,
        gateCode: community.gateCode,
        camOfcommunity: community.camOfcommunity,
        phone: community.phone,
        email: community.email,
        lockBoxCode: community.lockBoxCode,
        distance: community.distance.toFixed(3),
        hasPower:community.hasPower
      };
      return communityData;
    });
    return result;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getAllJobOrderByDate = async (params) => {
  let jobquery = {};
  let taskquery = {};
  
  if(params.date && params.date != ""){
    jobquery.date = params.date;
  }else{
    jobquery.date = moment.tz("America/New_York").format('YYYY-MM-DD');
  }

  if(params.status && params.status != ""){
    taskquery.status = params.status;
  }
  let sortedCommunities = [];
  try {
    // let config = await AppConfig.findAll();
    // let chargePerBagRoll = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BAG_ROLL).value;
    // let chargePerBinReplacement = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_BIN_REPLACEMENT).value;
    // let chargePerNewStationInstallment = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_NEW_STATION_INSTALLMENT).value;
    // let chargePerHandSanitizer = config.find(c => c.configName === CONFIG_NAMES.PRICE_PER_HAND_SANITIZER).value;
    // let communities = await Community.findAll({
    //   include: [
    //     { model: EventSchedule },
    //     {
    //       model: Task,
    //       required: true,
    //       where:taskquery,
    //       include: [
    //         {
    //           model: JobOrder,
    //           where: jobquery,
    //           required: true,
    //         },
    //       ],
    //     },
    //   ],
    // });
    // if (!communities || communities.length === 0) {
    //   return [];
    // }
    // sortedCommunities = await CommonService.orderCommunitiesByProximity(JSON.parse(JSON.stringify(communities)));
    // const result = sortedCommunities.map(community => {
    //   let scheduledDaysOfWeek;
    //   scheduledDaysOfWeek = community.communityServiceSchedule.scheduledDaysOfWeek;
    //   const communityData = {
    //     jobOrderId: community.tasks[0].jobOrderId, // Get jobOrderId from the first task or set to null
    //     taskId:community.tasks[0].id,
    //     taskStatus: community.tasks[0].status,
    //     communityId: community.id,
    //     communityName: community.communityName,
    //     communityAddress: community.communityAddress,
    //     gateCode: community.gateCode,
    //     camOfcommunity: community.camOfcommunity,
    //     phone: community.phone,
    //     email: community.email,
    //     lockBoxCode: community.lockBoxCode,
    //     specialRequest: community.specialRequest,
    //     noOfPetStation: community.communityServiceSchedule.noOfPetStation,
    //     noOfGarbageBin: community.communityServiceSchedule.noOfGarbageBin,
    //     noOfBagRollReplaced: 0,
    //     noOfBinReplacement: 0,
    //     noOfHandSanitizerReplacement: 0,
    //     noOfStationInstalled: 0,
    //     chargePerPetStation: community.communityServiceSchedule.chargePerPetStation,
    //     chargePerGarbageBin: community.communityServiceSchedule.chargePerGarbageBin,
    //     chargePerBagRoll: chargePerBagRoll || 0,
    //     chargePerBinReplacement: chargePerBinReplacement || 0,
    //     chargePerNewStationInstallment: chargePerNewStationInstallment || 0,
    //     chargePerHandSanitizer: chargePerHandSanitizer || 0,
    //     isBagRollReplaced: false, // Add your first extra property
    //     isBinReplaced: false, // Add your first extra property
    //     isHandSanitizerReplaced: false, // Add your first extra property
    //     isNewStationInstalled: false, // Add your first extra property
    //     totalBagReplacementPrice: 0,
    //     totalBinReplacementPrice: 0,
    //     totalStationInstallationPrice: 0,
    //     totalHandSanitizerPrice: 0,
    //     scheduledDaysOfWeek:  scheduledDaysOfWeek ,
    //     scheduledDate: community.tasks[0].scheduledDate,
    //     distance: community.distance.toFixed(3),
    //   };
    //   return communityData;
    // });
    return "result";
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
  }
};

exports.getCommunityById = async (req, res) => {
  let params = req.query;
  const userTimeZone = req.headers['timezone'] || 'UTC'; // Get timezone from header
  try {
    let community = await Community.findOne({where:{id:params.id},include:EventSchedule});
    const communityData = {
      communityId: community.id,
      communityName: community.communityName,
      communityAddress: community.communityAddress,
      latitude:community.latitude,
      longitude:community.longitude,
      gateCode: community.gateCode,
      camOfcommunity: community.camOfcommunity,
      phone: community.phone,
      email: community.email,
      lockBoxCode: community.lockBoxCode,
      hasPower:community.hasPower
    };
    return communityData;
  } catch (error) {
    throw new Error("Error Occurred: " + error.message);
  }
};
exports.getAllCommunity = async (req, res) => {
  let modifiedommunities = [];
  try {
    let communities = await Community.findAll();
    modifiedommunities = JSON.parse(JSON.stringify(communities));
    const result = modifiedommunities.map(community => {
      const communityData = {
        id: community.id,
        communityName: community.communityName
      };
      return communityData;
    });
    return result;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
};

exports.getAllTransactionHistoryByCommunityId = async (req) => {
  try {
    let params = req.query;
    let accountHistory = await TransactionHisory.findAll({where:{communityId:params.id}});
    return accountHistory;
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`, { stack: error.stack });
    throw new Error("Error Occurred: " + error.message);
  }
}

