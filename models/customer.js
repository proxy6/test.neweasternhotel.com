const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("Customer", {
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  phone: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  address: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  id_type: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  id_number: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  id_exp_date: { 
    type: DataTypes.DATE, 
    allowNull: true, 
  },
  id_issue_country: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  occupation: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  nationality: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  last_country_entry_date: { 
    type: DataTypes.DATE, 
    allowNull: true, 
  },
  car_no: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  bus_type: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  }
}, {
  timestamps: true,
});

}
