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
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  
  added_by: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  payment_mode: { 
    type: DataTypes.STRING, 
    allowNull: true
  },


}, {
  timestamps: true,
});

}
