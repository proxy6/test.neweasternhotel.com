const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pages', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
