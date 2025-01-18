static async addBooking(data){
  const { booking_reference, formData, rooms, user } = data;
  console.log(formData)
  console.log(rooms)
  console.log("CHECKING")
  const transaction = await sequelize.transaction(); // Start transaction

  try {
    // 1. Create Customer
    const customer = await Customer.create(
      {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        nationality: formData.nationality,
        id_type: formData.id_type,
        id_number: formData.id_number,
        id_issue_country: formData.id_issue_country,
        id_exp_date: formData.id_exp_date,
        occupation: formData.occupation,
        bus_type: formData.bus_type,
        last_country_entry_date: formData.last_country_entry_date,
      },
      { transaction }
    );

    // 2. Create Booking
    // Check if any room has a status of 'checkedin'
      const hasCheckedInRoom = rooms.some(room => room.status === 'checkedin'); // Returns true or false
      console.log(hasCheckedInRoom)
      // Dynamically set the booking status based on room status
      const bookingStatus = hasCheckedInRoom ? 'checkedin' : 'pending'; // 'checkedin' if any room has the status

    const booking = await Booking.create(
      {
        customer_id: customer.id,
        booking_reference: booking_reference,
        booked_by: `${user.first_name} ${user.last_name}`,
        check_in_date: rooms[0].check_in_date,
        check_in_time: rooms[0].check_in_time,
        status: hasCheckedInRoom ? 'checkedin' : 'pending', // Update status dynamically
        total_price: 0, // Calculate dynamically below
      },
      { transaction }
    );

    let totalPrice = 0;

    // Check for duplicate room IDs
    const roomIds = rooms.map(room => room.room_id); // Extract all room IDs

    const duplicateRooms = roomIds.filter((id, index) => roomIds.indexOf(id) !== index);
    console.log(duplicateRooms)
    if (duplicateRooms.length > 0) {
      console.log('this is a duplicate')
      const overlappingRooms = [];
      // Group rooms by room_id
      const groupedRooms = rooms.reduce((acc, room) => {
        acc[room.room_id] = acc[room.room_id] || [];
        acc[room.room_id].push({
          checkIn: new Date(room.check_in_date).setHours(0, 0, 0, 0),
          checkOut: new Date(room.check_out_date).setHours(0, 0, 0, 0),
        });
        return acc;
      }, {});

      // Check for overlapping dates in each group
      Object.keys(groupedRooms).forEach(roomId => {
        const dates = groupedRooms[roomId];
        for (let i = 0; i < dates.length; i++) {
          for (let j = i + 1; j < dates.length; j++) {
            const range1 = dates[i];
            const range2 = dates[j];
            if (
              range1.checkIn < range2.checkOut &&
              range2.checkIn < range1.checkOut
            ) {
              overlappingRooms.push(roomId);
              break;
            }
          }
        }
      });
      if (overlappingRooms.length > 0) {
        console.log(overlappingRooms)
        console.log('here')
        if (transaction) await transaction.rollback(); // Rollback transaction if already started
        // ${[...new Set(duplicateRooms)].join(', ')}
        return (`Room is not available for the selected dates`);
      }
    }
    // 3. Create Booking Rooms
    for (const room of rooms) {
      let roomData = await Rooms.findOne({
        where:{
          id: room.room_id
        },
        transaction
      })

      //check if the room is already booked
      let bookingRoomData = await BookingRooms.findOne({
        where: {
          [Op.and]: [
            { status: { [Op.ne]: 'checkedout' } }, // Ensure status is not 'checkedout'
            {
              [Op.or]: [
                {
                  check_in_date: {
                    [Op.lt]: room.check_in_date, // Existing booking starts before the new check-in date
                  },
                  check_out_date: {
                    [Op.gt]: room.check_in_date, // Existing booking ends after  the new check-in date
                  }
                },
                {
                  check_in_date: {
                    [Op.lt]: room.check_out_date, // Existing booking starts before or on the new check-out date
                  },
                  check_out_date: {
                    [Op.gt]: room.check_out_date, // Existing booking ends after or on the new check-out date
                  }
                }
              ]
            }
          ]
        },
        transaction
      });
      
      console.log('room data')
      console.log(bookingRoomData)
      console.log(roomData)
      if(bookingRoomData){
        
        if (transaction) await transaction.rollback();
        return (`Room ${roomData.name} is already booked for the selected dates`);
      }

      //check for discount and subtract from room price
      const pricePerDay = room.discount != null && room.discount < roomData.price ? roomData.price - room.discount : roomData.price ;
       // Calculate the difference in days
      // let booked_days_no = new Date(room.check_out_date).setHours(0,0,0,0) - new Date(room.check_in_date).setHours(0,0,0,0) / 86400000
      // console.log("booked_days_no")
      // console.log(booked_days_no)
      // if (booked_days_no >= 0) {
      //   room.booked_days_no = booked_days_no - 1
      //   console.log(room.booked_days_no)
      // }

      if (room.check_in_date && room.check_out_date) {
        const checkInDate = new Date(room.check_in_date).setHours(0, 0, 0, 0); // Normalize time to midnight
        const checkOutDate = new Date(room.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
      
        // Calculate the difference in days
        const booked_days_no = (checkOutDate - checkInDate) / 86400000;
        console.log("booked_days_no")
        console.log(booked_days_no)
        if (booked_days_no >= 0) {
          room.booked_days_no = booked_days_no
            console.log(room.booked_days_no)
        }
      }
      const roomPrice = pricePerDay * parseInt(room.booked_days_no); // Calculate room price
      await BookingRooms.create(
        {
          booking_id: booking.id,
          room_id: room.room_id,
          check_in_date: room.check_in_date,
          check_in_time: room.check_in_time,
          check_out_date: room.check_out_date,
          booked_days_no: room.booked_days_no,
          no_persons: room.no_persons,
          price: roomPrice,
          discount: room.discount == '' ? 0  : room.discount,
          status: room.status,
        },
        { transaction }
      );

    
      totalPrice += roomPrice; // Accumulate total price
    }

    await Rooms.update(
      { status: false },
      { where: { id: roomIds }, transaction }
    );

    // 4. Update Booking with total price
    booking.total_price = totalPrice;
    await booking.save({ transaction });

    // Commit transaction
    await transaction.commit();

    return booking; // Return booking details
  } catch (error) {
    console.log(error)
    if (transaction) await transaction.rollback();
    throw error; // Propagate error
  }

}



static async updateBooking(data) {
    const { formData, rooms, bookedRooms, id, user } = data;
    const transaction = await sequelize.transaction(); // Start transaction
  
    console.log(rooms, formData, bookedRooms)
  
    try {
      // 1. Update Customer details
      if (formData) {
        await Customer.update(
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            nationality: formData.nationality,
            id_type: formData.id_type,
            id_number: formData.id_number,
            id_issue_country: formData.id_issue_country,
            id_exp_date: formData.id_exp_date,
            occupation: formData.occupation,
            bus_type: formData.bus_type,
            last_country_entry_date: formData.last_country_entry_date,
          },
          { where: { id: formData.customer_id }, transaction }
        );
      }
  
      // 2. Update Booking details
      const booking = await Booking.findByPk(id, { transaction });
      if (!booking) throw new Error("Booking not found");
  
      // Check if any room or bookingRoom has a status of 'checkedin'
      const hasCheckedInRoom = rooms.some(room => room.status === 'checkedin') || 
      bookedRooms.some(bookedRoom => bookedRoom. bookingRoom_status === 'checkedin'); // Check both rooms and bookingRooms
  
      // Dynamically set the booking status based on room or bookingRoom status
      const bookingStatus = hasCheckedInRoom ? 'checkedin' : formData.booking_status; // 'checkedin' if any has the status
  
      await booking.update(
        {
          check_in_time: formData.booking_check_in_time,
          booked_by: `${user.first_name} ${user.last_name}`,
          status: bookingStatus, // Update status if provided
        },
        { transaction }
      );
  
      if (rooms && rooms.length > 0) {
        // 3. Check for duplicate room IDs
        const roomIds = rooms.map(room => room.room_id); // Extract all room IDs
  
        const duplicateRooms = roomIds.filter((id, index) => roomIds.indexOf(id) !== index);
  
        if (duplicateRooms.length > 0) {
          console.log('this is a duplicate')
          const overlappingRooms = [];
          // Group rooms by room_id
          const groupedRooms = rooms.reduce((acc, room) => {
            acc[room.room_id] = acc[room.room_id] || [];
            acc[room.room_id].push({
              checkIn: new Date(room.check_in_date).setHours(0, 0, 0, 0),
              checkOut: new Date(room.check_out_date).setHours(0, 0, 0, 0),
            });
            return acc;
          }, {});
    
          // Check for overlapping dates in each group
          Object.keys(groupedRooms).forEach(roomId => {
            const dates = groupedRooms[roomId];
            for (let i = 0; i < dates.length; i++) {
              for (let j = i + 1; j < dates.length; j++) {
                const range1 = dates[i];
                const range2 = dates[j];
                if (
                  range1.checkIn < range2.checkOut &&
                  range2.checkIn < range1.checkOut
                ) {
                  overlappingRooms.push(roomId);
                  break;
                }
              }
            }
          });
          if (overlappingRooms.length > 0) {
            console.log(overlappingRooms)
            console.log('here')
          if (transaction) await transaction.rollback(); // Rollback transaction if already started
          return (`Room is not available for the selected dates`);
          }
        }
  
        // update room status for newly added rooms
        await Rooms.update(
          { status: false },
          { where: { id: roomIds }, transaction }
        );
      }
  
      // 4. Update Existing Booking Rooms
      if (bookedRooms && bookedRooms.length > 0) {
        for (const bookedRoom of bookedRooms) {
          const checkInDate = new Date(bookedRoom.bookingRoom_check_in_date).setHours(0, 0, 0, 0); // Normalize time to midnight
          const checkOutDate = new Date(bookedRoom.bookingRoom_check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
          console.log(checkInDate)
          console.log(checkOutDate)
          // Calculate the difference in days
          const booked_days_no = (checkOutDate - checkInDate) / 86400000;
          console.log(booked_days_no)
         await BookingRooms.update(
              {
        
                check_in_time:bookedRoom.bookingRoom_check_in_time,
                check_out_date:bookedRoom.bookingRoom_check_out_date, 
                check_out_time:bookedRoom.bookingRoom_check_out_time == "" ? null : bookedRoom.bookingRoom_check_out_time,
                booked_days_no: booked_days_no,
                no_persons: bookedRoom.bookingRoom_no_persons,
                
                status: bookedRoom.bookingRoom_status
              },
              { where: { id: bookedRoom.bookingRoom_id }, transaction }
            );
          
        }
  
        // Filter bookedRooms with 'checkedout' status and extract their IDs
        const checkedOutBookingRoomIds = bookedRooms
        .filter(bookedRoom => bookedRoom.bookingRoom_status === 'checkedout') // Filter 'checkedout' status
        .map(bookedRoom => bookedRoom.bookingRoom_room_id); // Extract Room IDs
  
     
        //update room status for checked out rooms
        await Rooms.update(
          { status: true },
          { where: { id: checkedOutBookingRoomIds }, transaction }
        );
      
      }
      
      
      // 5. Add new Booking Rooms
      let totalPrice = booking.total_price;
      if (rooms && rooms.length > 0) {
        for (const room of rooms) {
          let roomData = await Rooms.findOne({
            where:{
              id: room.room_id
            }
          })
  
      
        //check if the room is already booked
        let bookingRoomData = await BookingRooms.findOne({
          where: {
            [Op.and]: [
              { status: { [Op.ne]: 'checkedout' } }, // Ensure status is not 'checkedout'
              {
                [Op.or]: [
                  {
                    check_in_date: {
                      [Op.lt]: room.check_in_date, // Existing booking starts before or on the new check-in date
                    },
                    check_out_date: {
                      [Op.gt]: room.check_in_date, // Existing booking ends after or on the new check-in date
                    }
                  },
                  {
                    check_in_date: {
                      [Op.lt]: room.check_out_date, // Existing booking starts before or on the new check-out date
                    },
                    check_out_date: {
                      [Op.gt]: room.check_out_date, // Existing booking ends after or on the new check-out date
                    }
                  }
                ]
              }
            ]
          },
          transaction
        });
        
  
        if(bookingRoomData){
    
          if (transaction) await transaction.rollback();
          return (`Room ${roomData.name} is already booked for the selected dates`);
        }
        
          //check for discount and subtract from room price
          const pricePerDay = room.discount != null && room.discount < roomData.price ? roomData.price - room.discount : roomData.price ;
          let booked_days_no;
          console.log("New rooms")
          console.log(room)
         
          if (room.check_in_date && room.check_out_date) {
            const checkInDate = new Date(room.check_in_date).setHours(0, 0, 0, 0); // Normalize time to midnight
            const checkOutDate = new Date(room.check_out_date).setHours(0, 0, 0, 0); // Normalize time to midnight
          
            // Calculate the difference in days
            booked_days_no = (checkOutDate - checkInDate) / 86400000;
          }
          const roomPrice = pricePerDay * parseInt(booked_days_no); // Calculate room price
          console.log("GOT HERE")
            // Add new room
           const newRooms =  await BookingRooms.create(
              {
                booking_id: id, //this is the booking id
                room_id: room.room_id,
                check_in_date: room.check_in_date,
                check_in_time: room.check_in_time,
                booked_days_no: booked_days_no,
                no_persons: room.no_persons,
                price: roomPrice,
                status: room.status,
              },
              { transaction }
            );
          
            console.log("PRICE")
            console.log(totalPrice)
            console.log(roomPrice)
          totalPrice += roomPrice; // Update total price
          console.log(newRooms)
        }
      
      }
      
      console.log("GOT HERE 2")
    
      if (bookedRooms && bookedRooms.length > 0) {
        // Check if all bookedRooms have bookingRoom_status === 'checkedout'
        const allCheckedOut = bookedRooms.every(
          bookedRoom => bookedRoom.bookingRoom_status === 'checkedout'
        );
  
        // If all rooms are checked out, update the booking status
        if (allCheckedOut) {
          booking.status = 'checkedout'; // Booking New status
          booking.check_out_date = new Date().toISOString().split('T')[0]
        }
      }
  
      // 4. Update Booking with total price
      booking.total_price = totalPrice;
      await booking.save({ transaction });
  
      console.log(booking)
      console.log("BOOKING")
      // Commit transaction
      await transaction.commit();
  
      return booking; // Return updated booking details
    } catch (error) {
      console.log(error)
      await transaction.rollback(); // Rollback on error
      throw error; // Propagate error
    }
  }