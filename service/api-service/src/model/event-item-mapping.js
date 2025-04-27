const Sequelize = require("sequelize");
const db = require("../connector/db-connector");
const { type } = require("os");

const EventItemMapping = db.sequelize.define(
  "eventItemMapping",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    usedQuantity:{
      type:Sequelize.INTEGER
    },
  },
  
  {
    freezeTableName: true,
  }
);

module.exports = EventItemMapping;
