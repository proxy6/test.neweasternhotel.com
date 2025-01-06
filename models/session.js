const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("Sessions", {
  sid: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
  },
  expires: {
    type: DataTypes.DATE
  },
  data:  {
    type: DataTypes.TEXT,
    allowNull: true
  },
}, {
  timestamps: true,
});

}