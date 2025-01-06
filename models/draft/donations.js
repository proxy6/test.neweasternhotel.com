
const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const Donations = sequelize.define("Donations", {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purpose: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN
  }
 });

 module.exports = Donations