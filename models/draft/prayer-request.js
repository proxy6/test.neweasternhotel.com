
const { DataTypes, Model } = require('sequelize');
const sequelize = require("../config/database");
const PrayerRequests = sequelize.define("PrayerRequests", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  prayer_request: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  }
});

 module.exports = PrayerRequests