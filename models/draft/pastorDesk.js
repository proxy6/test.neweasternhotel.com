
const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const PastorsDesk = sequelize.define("PastorsDesk", {
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
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },

  isDeleted: {
        type: DataTypes.BOOLEAN
    }
 });

 module.exports = PastorsDesk