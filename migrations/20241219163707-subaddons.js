'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('SubAddons', { 
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
      desc: { 
        type: Sequelize.STRING, 
        allowNull: true, 
      },
      price: { 
        type: Sequelize.DECIMAL(10,2), 
        allowNull: true, 
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      addon_id:{
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'SubAddons',  // Exact table name
          key: 'id',
        },
        onUpdate: 'CASCADE'
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

     await queryInterface.dropTable('SubAddons');
     
  }
};
