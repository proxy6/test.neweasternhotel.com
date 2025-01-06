const express = require('express')
const router = express.Router()
const multer = require('multer')
const { getDashboard, getRoleList, addRolesPage, addRole, getRoleEditPage, updateRoleById, 
deleteRole, addEmployee, getStates, getEmployeeList, getaddEmployeePage, updateEmployeeStatus, deleteEmployee,
getEmployeeEditPage, getAddonList, addAddons, getAddonEditPage, updateEmployeeById, 
updateAddonById,
deleteAddon,
getAddRoomPage,
getAllRooms,
addRoom,
getRoomEditPage,
updateRoomById,
deleteRoom,
updateRoomStatus,
getAllBookings,
getAddBookingPage,
addBooking,
getQuote,
getSingleBooking,
deleteBooking,
getEditBooking,
updateBookingById} = require('../controllers/admin.controller')
const { getSingleRoleWithPermissions } = require('../services/admin.service')

// const { getDashboard, getSermonList, getEventList, getUserList,
//     getPrayerRequestList, getDonationList, 
//     addSermon,
//     addEvent,
//     addUser,
//     getSingleSermonPage,
//     getSermonEditPage,
//     editSermon,
//     deleteSermon,
//     getPastorDeskList,
//     addPastorsDesk,
//     getSinglePastorsDesk,
//     getSinglePastorsDeskEditPage,
//     editPastorsDesk,
//     deletePastorsDesk,
//     deleteEvent,
//     getSingleEvent,
//     getEventEditPage,
//     editEvent,
//     editUser,
//     getUsersEditPage,
//     deleteUser,
//     updatePrayerRequestStatus,
//     updateDonation,
//     setLivestream,
//     removeLivestream} =  require('../controllers/admin.controller');
// const { isAdmin } = require('../middleware/authorization');

// const upload = multer({ dest: 'uploads/' }).single('label_photo'); 

// // router.get('/migrate', performMigration)
// // router.get('/undo-migrate', undoMigration)
// router.get('/dashboard', isAdmin, getDashboard)
// router.get('/sermons-list', isAdmin, getSermonList)
// router.post('/sermons-list', isAdmin, addSermon)
// router.get('/sermons-list/:id', isAdmin, getSingleSermonPage)
// router.get('/sermons-list/:id/edit', isAdmin, getSermonEditPage)
// router.post('/sermons-list/:id/edit', isAdmin, editSermon)
// router.post('/sermons-list/:id/delete', isAdmin, deleteSermon)

// router.get('/pastorsdesk-list', isAdmin, getPastorDeskList)
// router.post('/pastorsdesk-list', isAdmin, addPastorsDesk)
// router.get('/pastorsdesk-list/:id', isAdmin, getSinglePastorsDesk)
// router.get('/pastorsdesk-list/:id/edit', isAdmin, getSinglePastorsDeskEditPage)
// router.post('/pastorsdesk-list/:id/edit', isAdmin, editPastorsDesk)
// router.post('/pastorsdesk-list/:id/delete', isAdmin, deletePastorsDesk)

// router.get('/events-list', isAdmin, getEventList)
// router.post('/events-list', isAdmin, upload, addEvent)
// router.get('/events-list/:id/', isAdmin, getSingleEvent)
// router.get('/events-list/:id/edit', isAdmin, getEventEditPage)
// router.post('/events-list/:id/edit', isAdmin, upload, editEvent)
// router.post('/events-list/:id/delete', isAdmin, deleteEvent)
// router.get('/events-list/:id/livestream', isAdmin, setLivestream)
// router.get('/remove-livestram', isAdmin, removeLivestream)

// router.get('/users-list', isAdmin, getUserList)
// router.post('/users-list', isAdmin, upload, addUser)
// router.get('/users-list/:id/edit', isAdmin, getUsersEditPage)
// router.post('/users-list/:id/edit', isAdmin, upload, editUser)
// router.post('/users-list/:id/delete', isAdmin, deleteUser)
// router.get('/prayer-list', isAdmin, getPrayerRequestList)
// router.post('/update-prayer-request', isAdmin, updatePrayerRequestStatus)
// router.get('/donation-list', isAdmin, getDonationList)
// router.post('/update-donation', isAdmin, updateDonation)


const upload = multer({ dest: 'uploads/' }).single('image'); 
router.post('/states', getStates)
router.get('/quote', getQuote)
router.get('/', getDashboard)
router.get('/roles', getRoleList)
router.post('/roles', addRole)
router.get('/roles/add', addRolesPage)
router.get('/roles/:id', getRoleEditPage)
router.post('/roles/:id', updateRoleById);
router.post('/roles/:id/delete', deleteRole);


router.get('/employees', getEmployeeList)
router.get('/employees/add', getaddEmployeePage)
router.post('/employees', upload, addEmployee)
router.put('/employees/:id/update-status', updateEmployeeStatus)
router.get('/employees/:id', getEmployeeEditPage)
router.post('/employees/:id', upload, updateEmployeeById);
router.post('/employees/:id/delete', deleteEmployee)


router.get('/addons', getAddonList)
router.post('/addons', upload, addAddons)
router.get('/addons/:id', getAddonEditPage)
router.post('/addons/:id', upload, updateAddonById);
router.post('/addons/:id/delete', deleteAddon)


router.get('/rooms', getAllRooms)
router.get('/rooms/add', getAddRoomPage)
router.post('/rooms', upload, addRoom)
router.put('/rooms/:id/update-status', updateRoomStatus)
router.get('/rooms/:id', getRoomEditPage)
router.post('/rooms/:id', updateRoomById);
router.post('/rooms/:id/delete', deleteRoom)


router.get('/bookings', getAllBookings)
router.get('/bookings/add', getAddBookingPage)
router.post('/bookings/add', addBooking)
router.get('/bookings/:id', getSingleBooking)
router.get('/bookings/:id/edit', getEditBooking)
// router.put('/rooms/:id/update-status', updateRoomStatus)
// router.get('/rooms/:id', getRoomEditPage)
router.post('/bookings/:id', updateBookingById);
router.post('/bookings/:id/delete', deleteBooking)


module.exports = router