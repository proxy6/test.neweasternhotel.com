'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('Bookings', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: { 
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
      total_price: { 
        type: Sequelize.STRING, 
        allowNull: false, 
      },
      booking_reference: { 
        type: Sequelize.STRING, 
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

     await queryInterface.dropTable('Bookings');
     
  }
};
