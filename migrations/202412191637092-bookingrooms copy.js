'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('BookingRooms', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      booking_id: { 
        type: Sequelize.INTEGER,
        allowNull: false
      },
    
      check_in_date: { 
        type: Sequelize.DATE, 
        allowNull: true, 
      },
      check_in_time: { 
        type: Sequelize.TIME, 
        allowNull: true, 
      },
      check_out_date: { 
        type: Sequelize.DATE, 
        allowNull: true, 
      },
      booked_days_no: { 
        type: Sequelize.INTEGER, 
        allowNull: true, 
      },
      no_persons: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      price: { 
        type: Sequelize.DECIMAL(10,2), 
        allowNull: false, 
      },
      status: { 
        type: Sequelize.STRING(20), 
        defaultValue: 'pending' 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    
    });
    
  },

  async down (queryInterface, Sequelize) {

     await queryInterface.dropTable('BookingRooms');
     
  }
};
