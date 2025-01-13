const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
return sequelize.define("Complaints", {

  title: { 
    type: DataTypes.STRING, 
    allowNull: false, 
  },
  room_id: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  room_number: { 
    type: DataTypes.STRING, 
    allowNull: true, 
  },
  message: { 
    type: DataTypes.TEXT, 
    allowNull: false, 
  },
 
  status: { 
    type: DataTypes.STRING(20), 
    defaultValue: 'pending'  //processing, resolved
  },
}, {
  timestamps: true,
});

}
