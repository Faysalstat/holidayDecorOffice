const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const DecorationItem = db.sequelize.define(
  "decorationItem",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    itemName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    unitType:{
      type:Sequelize.STRING,
      defaultValue:"PIECE"
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    costPrice: {
      type: Sequelize.DOUBLE,
      allowNull: true,
    },
    quantityWasted: {
      type: Sequelize.INTEGER,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
  }
);

module.exports = DecorationItem;