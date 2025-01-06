const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('RoomType', {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
