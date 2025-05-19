const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const Notification = db.sequelize.define(
  "notification",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    content:Sequelize.STRING,
    title:Sequelize.STRING,
    isViewed:Sequelize.BOOLEAN
  },
  {
    freezeTableName: true,
  }
);

module.exports = Notification;