const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Addon', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  });
};
