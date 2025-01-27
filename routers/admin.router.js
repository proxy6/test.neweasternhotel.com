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
updateBookingById,
getAllComplaints,
getAddComplaintPage,
addComplaint,
getComplaintEditPage,
updateComplaintById,
deleteComplaint,
checkRoomAvailability,
getReceipt,
getAddonByType,
addBookingAddon,
getPaymentMode,
completeBookingPayment,
checkAvailabilityForEdit} = require('../controllers/admin.controller')
const { isAuthorized } = require('../middleware/authorization');

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
router.get('/', isAuthorized, getDashboard)
router.get('/roles', isAuthorized,  getRoleList)
router.post('/roles', isAuthorized, addRole)
router.get('/roles/add', isAuthorized, addRolesPage)
router.get('/roles/:id', isAuthorized, getRoleEditPage)
router.post('/roles/:id', isAuthorized, updateRoleById);
router.post('/roles/:id/delete', isAuthorized, deleteRole);


router.get('/employees', isAuthorized, getEmployeeList)
router.get('/employees/add', isAuthorized, getaddEmployeePage)
router.post('/employees', isAuthorized, upload, addEmployee)
router.put('/employees/:id/update-status', isAuthorized, updateEmployeeStatus)
router.get('/employees/:id', isAuthorized,  getEmployeeEditPage)
router.post('/employees/:id', isAuthorized, upload, updateEmployeeById);
router.post('/employees/:id/delete', isAuthorized, deleteEmployee)


router.get('/addons', isAuthorized, getAddonList)
router.post('/addons', isAuthorized, addAddons)
router.get('/addons/type', isAuthorized, getAddonByType)
router.get('/addons/:id', isAuthorized, getAddonEditPage)
router.post('/addons/:id', isAuthorized, updateAddonById);
router.post('/addons/:id/delete', isAuthorized, deleteAddon)


router.get('/rooms', isAuthorized, getAllRooms)
router.get('/rooms/add', isAuthorized, getAddRoomPage)
router.post('/rooms', isAuthorized, upload, addRoom)
router.post('/rooms/check-availability', isAuthorized, checkRoomAvailability)
router.post('/rooms/edit-check-availability', isAuthorized, checkAvailabilityForEdit)
router.put('/rooms/:id/update-status', isAuthorized, updateRoomStatus)
router.get('/rooms/:id', isAuthorized, getRoomEditPage)
router.post('/rooms/:id', isAuthorized, updateRoomById);
router.post('/rooms/:id/delete', isAuthorized, deleteRoom)


router.get('/bookings', isAuthorized, getAllBookings)
router.get('/bookings/add', isAuthorized, getAddBookingPage)
router.get('/bookings/paymentmodes', isAuthorized, getPaymentMode)
router.post('/bookings/completepayment', isAuthorized, completeBookingPayment )
router.post('/bookings/add', isAuthorized, addBooking)
router.get('/bookings/:id', isAuthorized, getSingleBooking)
router.get('/bookings/:id/edit', isAuthorized, getEditBooking)
router.post('/bookings/:id', isAuthorized, updateBookingById);
router.post('/bookings/:id/delete', isAuthorized, deleteBooking)
router.get('/bookings/:id/receipt', getReceipt)
router.post('/bookings/:id/addon', addBookingAddon)
router.get('/bookings/:id/guestreceipt', getReceipt)





router.get('/complaints', isAuthorized, getAllComplaints)
router.get('/complaints/add', isAuthorized, getAddComplaintPage)
router.post('/complaints', isAuthorized, addComplaint)
router.get('/complaints/:id', isAuthorized, getComplaintEditPage)
router.post('/complaints/:id', isAuthorized, updateComplaintById);
router.post('/complaints/:id/delete', isAuthorized, deleteComplaint)
// router.put('/rooms/:id/update-status', isAuthorized, updateRoomStatus)
// router.get('/rooms/:id', isAuthorized, getRoomEditPage)
// router.post('/rooms/:id', isAuthorized, updateRoomById);
// router.post('/rooms/:id/delete', isAuthorized, deleteRoom)
module.exports = router