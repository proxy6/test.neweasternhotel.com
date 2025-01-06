'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('Permissions', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      table: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      action: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

     await queryInterface.dropTable('Permissions');
     
  }
};
