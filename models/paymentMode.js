const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PaymentMode', {
    mode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
