// models/Employees.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Employee', {
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middle_name: {
    type: DataTypes.STRING,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dob: {
    type: DataTypes.DATEONLY,
  },
  profile_pic: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.ENUM("male", "female"),
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  country: {
    type: DataTypes.INTEGER,
  },
  state: {
    type: DataTypes.INTEGER,
  },
  city: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
  },
  account_name: {
    type: DataTypes.STRING,
  },
  account_no: {
    type: DataTypes.STRING,
  },
  bank_name: {
    type: DataTypes.STRING,
  },
  referee_name: {
    type: DataTypes.STRING,
  },
  referee_phone: {
    type: DataTypes.STRING,
  },
  referee_address: {
    type: DataTypes.STRING,
  },
  confirm_email: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  otp: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: true,
});
}

