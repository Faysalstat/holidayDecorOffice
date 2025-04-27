const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const EventSchedule = db.sequelize.define(
  "eventSchedule",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    status: Sequelize.STRING,
    scheduledStartDate: Sequelize.STRING,
    scheduledEndDate: Sequelize.STRING,
    title: Sequelize.STRING,
    description: Sequelize.STRING,
    totalBill:Sequelize.DOUBLE,
    totalPaid:Sequelize.DOUBLE
  },
  {
    freezeTableName: true,
  }
);

module.exports = EventSchedule;
