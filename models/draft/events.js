
const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const Events = sequelize.define("Events", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  event_photo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  livestream: {
    type: DataTypes.BOOLEAN
  },
  isDeleted: {
    type: DataTypes.BOOLEAN
  }
 });
 

 module.exports = Events