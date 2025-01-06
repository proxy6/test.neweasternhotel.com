const session = require('express-session');
// const Session = require('../models/session');
const sequelize = require("./database");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
    db: sequelize,
    // expiration: 86400000, // Session expiration time in milliseconds (optional)
  });

  let configSession = (app) => {
    try{
    app.use(
        session({
            key: "express.sid",
            secret: "seceretsssrgssssssss",
            store: sessionStore,
            resave: true,
            saveUninitialized: false,
            cookie: {
                httpOnly: false,
                secure: false,
                maxAge: (24 * 60 * 60 * 1000) // 1 day only
            }
        })
    )
      }catch(e){
        console.log(e)
      }
  }
  sessionStore.sync();

module.exports = configSession