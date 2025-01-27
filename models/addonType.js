const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AddonType', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
