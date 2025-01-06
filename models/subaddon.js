const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('SubAddon', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    addon_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
};
