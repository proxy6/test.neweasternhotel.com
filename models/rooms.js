const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Room', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false
       },
       type: {
        type: DataTypes.STRING,
        allowNull: true
       },
       price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
       },
       status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
       }
    },
    { timestamps: true },
  )
};