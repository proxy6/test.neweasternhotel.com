const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("BookingRooms", {
  // room_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },
  // booking_id: { 
  //   type: DataTypes.INTEGER,
  //   allowNull: false
  // },

  check_in_date: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  check_in_time: { 
    type: DataTypes.TIME, 
    allowNull: true, 
  },
  check_out_date: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  booked_days_no: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
  },
  no_persons: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
  },
  price: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false, 
  },
  status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'pending' 
  },
}, {
  timestamps: true,
});

}
