
const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const Sermons = sequelize.define("Sermons", {
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
  minister: {
    type: DataTypes.STRING,
    allowNull: false
  },
  minister_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  service_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isDeleted: {
      type: DataTypes.BOOLEAN
  }
 });

 module.exports = Sermons