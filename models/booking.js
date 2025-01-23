const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("Booking", {

  // customer_id: { 
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
  total_price: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false, 
  },
  booking_reference: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  booked_by: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  payment_mode: { 
    type: DataTypes.STRING, 
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