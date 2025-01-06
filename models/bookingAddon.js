const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("BookingAddon", {
  // booking_room_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  // addon_id: { 
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
 
  status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'pending' 
  },

}, {
  timestamps: true,
});

}
