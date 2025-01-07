const jwt = require('jsonwebtoken');
const express = require('express')
const session = require('express-session');
const app = express()

const SECRET_KEY = `${process.env.JWT_SECRET}`;


module.exports = {
// isAuthorized: async (req, res, next) => {
//  try {
//    const access_token = req.session.token
//    if (!access_token) return res.redirect('/signin'); // Redirect to signin page if not authenticated
//    // Store the original calling endpoint
//    req.session.originalEndpoint = req.originalUrl;
//    const decoded = jwt.verify(access_token, SECRET_KEY)
//    console.log(decoded)
//    next()
//  }catch (err) {
  
//    res.render('auth/login', { error: 'Authorization Failed'});
//  }
// },

isAuthorized: async (req, res, next) => {
  try {
    // 1. Check if token exists
    const access_token = req.session.token;
    if (!access_token) return res.redirect('/signin'); // Redirect if not authenticated

    // 2. Decode token
    const decoded = jwt.verify(access_token, SECRET_KEY);

    // 3. Check if token 'lastUpdated' matches session data
    const sessionLastUpdated = req.session.lastUpdated || decoded.lastUpdated;

    if (decoded.lastUpdated > sessionLastUpdated) {
      req.session.destroy(); // Destroy session if data was updated
      return res.redirect('/signin'); // Redirect to login
    }

    // Store the latest timestamp in session
    req.session.lastUpdated = decoded.lastUpdated;

    // 4. Extract permissions from the token
    const permissions = decoded.permission;

    // 5. Parse the endpoint to determine resource and action
    const endpoint = req.originalUrl.split('?')[0]; // Ignore query params
    const method = req.method.toLowerCase(); // GET, POST, PUT, DELETE

    let action = '';
    switch (method) {
      case 'get': action = 'read'; break;
      case 'post': action = 'create'; break;
      case 'put': action = 'update'; break;
      case 'delete': action = 'delete'; break;
      default: action = '';
    }

    // Allow access to specific routes without permissions
    if (['/', '/edit-profile'].includes(endpoint)) {
      return next(); // Skip permission checks for these routes
    }

    // 6. Extract base resource and additional parts from the endpoint
    const parts = endpoint.split('/').filter(p => p); // Split and remove empty parts
    const baseResource = parts[0]; // e.g., 'bookings'
    const subResource = parts[1]; // e.g., 'add' or '3'

    // Determine action based on endpoint patterns
    if (parts.length === 2) {
      if (subResource === 'add' && method === 'get') action = 'create'; // GET /bookings/add
      else if (!isNaN(subResource) && method === 'get') action = 'read'; // GET /bookings/3
      else if (!isNaN(subResource) && method === 'post') action = 'update'; // POST /bookings/3
    } else if (parts.length === 3) {
      const operation = parts[2]; // e.g., 'edit', 'delete', or 'update-status'
      if (operation === 'edit' && method === 'get') action = 'update'; // GET /bookings/3/edit
      if (operation === 'delete' && method === 'post') action = 'delete'; // POST /bookings/3/delete
      if (operation === 'update-status' && method === 'put') action = 'update'; // PUT /bookings/3/update-status
    }

    // 7. Check if the user has permission for the action and table
    const hasPermission = permissions.some(p =>
      p.table === baseResource && p.action === action
    );

    if (!hasPermission) {
      // Redirect if unauthorized
      return res.redirect('/unauthorized');
    }

    // 8. Proceed if authorized
    next();

  } catch (err) {
    console.error(err);
    res.render('auth/login', { error: 'Authorization Failed' });
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