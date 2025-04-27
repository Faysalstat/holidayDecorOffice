const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const EventImageMapping = db.sequelize.define(
  "eventImageMapping",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    imageName:Sequelize.STRING,
    imagePath:Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = EventImageMapping;
