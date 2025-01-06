const jwt = require('jsonwebtoken');
const express = require('express')
const session = require('express-session');
const app = express()

const SECRET_KEY = `${process.env.JWT_SECRET}`;


module.exports = {
isAuthorized: async (req, res, next) => {
 try {
   const access_token = req.session.token
   if (!access_token) return res.redirect('/signin'); // Redirect to signin page if not authenticated
   // Store the original calling endpoint
   req.session.originalEndpoint = req.originalUrl;
   const decoded = jwt.verify(access_token, SECRET_KEY)
   next()
 }catch (err) {
  
   res.render('signin', { error: 'Authorization Failed'});
 }
},
isAdmin: async (req, res, next) => {
  try {
    const access_token = req.session.token
    if (!access_token) return res.redirect('/signin'); // Redirect to signin page if not authenticated
    // Store the original calling endpoint
    req.session.originalEndpoint = req.originalUrl;
    const decoded = jwt.verify(access_token, SECRET_KEY)
    if(
      decoded.role != 'admin' && decoded.role != 'minister'
      
      ) return res.render('signin', {error: "Access Denied"});
    next()
  }catch (err) {
    res.render('/signin', { error: 'Authorization Failed'});
  }
 }
 
}