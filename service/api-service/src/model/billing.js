const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const Billing = db.sequelize.define(
  "billing",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    totalBill: Sequelize.DOUBLE,
    totalPaid: Sequelize.DOUBLE,
    taxAmount:Sequelize.DOUBLE,
    taskCompletionDate: Sequelize.DATEONLY,
    status: Sequelize.STRING,
  },
  {
    freezeTableName: true,
  }
);

module.exports = Billing;
