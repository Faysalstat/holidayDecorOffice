const db = require("../connector/db-connector");
const User = require("./user");
const Community = require("./community");
const Billing = require("./billing");
const AppConfig = require("./app-config");
const SchedulerLog = require("./scheduler-log");
const DecorationItem = require("./decoration-items");
const EventSchedule = require("./event-schedule");
const EventImageMapping = require("./event-image-mapping");
const EventItemMapping = require("./event-item-mapping");
const TransactionHisory = require("./transaction-history");

// Define Relationships
Community.hasMany(EventSchedule);
EventSchedule.belongsTo(Community);
EventSchedule.hasOne(Billing);
Billing.belongsTo(EventSchedule);
EventSchedule.hasMany(EventItemMapping);
DecorationItem.hasMany(EventItemMapping);
EventSchedule.hasMany(EventImageMapping);
EventImageMapping.belongsTo(EventSchedule);
EventItemMapping.belongsTo(DecorationItem);
TransactionHisory.belongsTo(Community);
Community.hasMany(TransactionHisory);
module.exports = {
  User,
  Community,
  Billing,
  AppConfig,
  SchedulerLog,
  EventSchedule,
  DecorationItem,
  TransactionHisory
};
