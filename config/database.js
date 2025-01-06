const dbConfig = require('./config.json');

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
 dbConfig.development.database,
 dbConfig.development.username,
 dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    port: dbConfig.development.port,
    logging: false, // Disable logging
    storage: "./session.mysql"
  }
);

// sequelize.authenticate().then(() => {
//    sequelize.sync(); 
//    console.log('Connection has been established successfully.');
// }).catch((error) => {
//    console.error('Unable to connect to the database: ', error);
// });

module.exports = sequelize