const express = require('express')
const router = express.Router()
// const admin = require('./admin.router')
// const auth = require('./auth.router')
// const user = require('./user.router')
const admin = require('./admin.router')
// const index = require('./index.router')
const auth = require('./auth.router')

// router.get('/', (req, res)=> {
//      res.render('login')
// })
// router.use('/', admin)
// router.use('/', auth)
// router.use('/', user)
router.use('/', admin)
router.use('/', auth)
// router.use('/auth', auth)

// router.get('/dash', (req, res) => {
//     res.render('index');
// });
router.get('*', (req, res) => {
    res.redirect('/');
});
module.exports = router