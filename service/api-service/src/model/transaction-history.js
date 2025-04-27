const Sequelize = require("sequelize");
const db = require("../connector/db-connector");

const TransactionHisory = db.sequelize.define(
  "transactionHisory",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    amount: Sequelize.DOUBLE,
    tnxDate: Sequelize.STRING,
    remark:Sequelize.STRING
  },
  {
    freezeTableName: true,
  }
);

module.exports = TransactionHisory;
