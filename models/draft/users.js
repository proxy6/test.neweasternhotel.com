
const { DataTypes, Model } = require('sequelize');
const sequelize = require("../../config/database");
const Users = sequelize.define("Users", {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false // member, admin
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true // member, admin
  },
  confirm_email:{
    type: DataTypes.BOOLEAN,
  },
  isMinister: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
    isDeleted: {
        type: DataTypes.BOOLEAN
    }
 });


 module.exports = Users