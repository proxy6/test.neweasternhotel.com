'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('Customers', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      id_type: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      id_number: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      id_Issue_date: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      id_issue_country: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      address: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      email: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      phone: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      occupation: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      nationality: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      last_country_entry_date: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      car_no: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      bus_type: { 
        type: Sequelize.STRING, 
        allowNull: true, 
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

     await queryInterface.dropTable('Customers');
     
  }
};
