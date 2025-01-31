const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("Booking", {

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
  check_out_time: { 
    type: DataTypes.TIME, 
    allowNull: true, 
  },
  price: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false, 
  },
  booked_days_no: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
  },
  no_persons: { 
    type: DataTypes.INTEGER, 
    allowNull: true, 
  },
  discount: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: true, 
  },
  amount_paid: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: true, 
  },
  booking_reference: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  booked_by: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  checkedout_by: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  last_updated_by: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  payment_mode: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  payment_status: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'pending' //checkin checkedout
  },
}, {
  timestamps: true,
});

}