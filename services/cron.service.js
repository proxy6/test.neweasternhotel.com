
const { Rooms, Booking, RoomType, CronJobLogs } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Function to check the availability and clean status of room for house keeper
const updateRoomCleanStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const failedRooms = [];
      let successCount = 0;
      let failureCount = 0;
  
      // Fetch all rooms
      const rooms = await Rooms.findAll();
  
      for (const room of rooms) {
        try {
          // Find any active booking for this room
          const booking = await Booking.findOne({
            where: {
              room_id: room.id,
              status: 'checkin', // Only consider rooms currently occupied
              check_in_date: { [Op.lte]: today }, // Check-in date is today or before
              check_out_date: { [Op.gte]: today }, // Check-out date is today or later
            },
          });
  
          if (booking) {
            // Room is occupied
            await room.update({ clean_status: 'needs cleaning' });
          } else {
            // Room is not occupied
            if (room.clean_status !== 'needs cleaning') {
              await room.update({ clean_status: 'needs retouch' });
            }
          }
  
          successCount++; // Increment success count if no error occurs
        } catch (error) {
          console.error(`Failed to update room ${room.id}:`, error);
          failedRooms.push(room.id); // Log the failed room ID
          failureCount++; // Increment failure count
        }
      }
  
      // Log the cron job run
      await CronJobLogs.create({
        successCount,
        failureCount,
        room_ids: failedRooms.length > 0 ? JSON.stringify(failedRooms) : null, // Convert array to JSON
      });
      
  
      console.log(`Cron job completed. Success: ${successCount}, Failed: ${failureCount}`);
    } catch (error) {
      console.error('Error in cron job execution:', error);
    }
  };
  


// for testing purpose run every minute

// cron.schedule('*/40 * * * * *', () => { 
//     console.log('Running daily investment processing...');
//     updateRoomCleanStatus();
// });



class CronService{
    static async callCron(){
        await updateRoomCleanStatus();  
    }
}


module.exports = updateRoomCleanStatus;
module.exports = CronService
