const { DataTypes } = require('sequelize');
const employee = require('./employee');

module.exports = (sequelize) => {
return sequelize.define("BookingTransactions", {

  description: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  amount: { 
    type: DataTypes.DECIMAL(10,2), 
    allowNull: false, 
  },
  date: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  payment_mode: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
  employee_id: { 
    type: DataTypes.STRING, 
    allowNull: false
  },
}, {
  timestamps: true,
});

}
