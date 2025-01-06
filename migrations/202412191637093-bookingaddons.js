'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('BookingAddons', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      booking_room_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      addon_id: { 
        type: Sequelize.INTEGER,
        allowNull: false
      },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      total_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
     
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

     await queryInterface.dropTable('BookingAddons');
     
  }
};
