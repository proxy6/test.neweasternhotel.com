document.addEventListener('DOMContentLoaded', () => {
  const addRoomBtn = document.getElementById('add-room-btn');
  // const submitBtn = document.getElementById('submit-btn');
  const roomContainer = document.getElementById('room-container');
  const form = document.getElementById('bookingForm');
  const updateBtn = document.getElementById('update-btn');
  // const form = document.querySelector('form');
  let roomCount = 1;


   // Generate room options dynamically
const roomOptions = rooms.map(room => 
  `<option value="${room.id}">${room.number.charAt(0).toUpperCase() + room.number.slice(1)} - &#8358;${room.price}</option>`
).join('');

  // Function to add a new room section
  function addRoomSection() {
    roomCount++;
    const roomSection = document.createElement('div');
    roomSection.classList.add('room-section');
    roomSection.classList.add('room-dynamics');
    roomSection.dataset.index = roomCount;

    roomSection.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4>Room Details Info</h4>
        <a href="#" class="remove-room" onclick="removeRoomSection(this)">Remove</a>
      </div>
      <div class="row"> 
        <div class="col-sm-12">
          <div class="mb-3">
            <label class="form-label">Room Number/Name <span>*</span></label>
            <select name="room_id_${roomCount}" class="form-select" required> 
              <option value="">Select..</option>
              ${roomOptions}
            </select>
          </div>
        </div>
      </div>
      <div class="row"> 
        <div class="col-sm-6">
          <div class="mb-3">
            <label class="form-label">Check In Date <span>*</span></label>
            <input class="form-control" name="check_in_date_${roomCount}" type="date" required>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="mb-3">
            <label class="form-label">Check In Time <span>*</span></label>
            <input class="form-control" name="check_in_time_${roomCount}" type="time" required>
          </div>
        </div>
      </div>
      <div class="row"> 
        <div class="col-sm-6">
          <div class="mb-3">
            <label class="form-label">Number of Persons</label>
            <input class="form-control" name="no_persons_${roomCount}" type="text" required>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="mb-3">
            <label class="form-label">Number of Days Booked</label>
            <input class="form-control" name="booked_days_no_${roomCount}" type="text">
          </div>
        </div>
      </div>
         <div class= "row">
            <div class="col-sm-12">
            <div class="mb-3">
              <label class="form-label">Status<span>*</span></label>
              <select required name="status_${roomCount}" class="form-select" required> 
                <option value="">Select an Option</option> 
                <option value="pending">Pending</option> 
                <option value="checkedin">Checkin</option>
              </select>
                
            </div>
          </div>
        </div>
    `;

    roomContainer.appendChild(roomSection);
  }

  // Function to remove room section
  window.removeRoomSection = function (anchor) {
    const section = anchor.parentElement.parentElement;
    section.remove();
  };

  // Add room section on button click

  addRoomBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addRoomSection();
  });


  updateBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission if validation fails.
  
    let isValid = true; // Assume form is valid initially.
  
    // Validate Customer Info
    form.querySelectorAll('input[required], select[required]').forEach((input) => {
        if (input && input.value && input.value.trim()) { // Valid input
            input.classList.remove('is-invalid');
          } else { // Invalid or missing input
            if (input && input.classList) input.classList.add('is-invalid'); // Only add class if input exists.
          }
    });
  
    // Validate Dynamic Room Sections
    const roomSections = document.querySelectorAll('.room-dynamics');
    //check if dynamic add room section exist
    // Check if the class 'room-section' exists
    if (roomSections.length > 0) {
        roomSections.forEach((section) => {
            const roomIndex = section.dataset.index; // Use data-index attribute for reliability
          
            const roomId = section.querySelector(`[name='room_id_${roomIndex}']`);
            const checkInDate = section.querySelector(`[name='check_in_date_${roomIndex}']`);
            const checkInTime = section.querySelector(`[name='check_in_time_${roomIndex}']`);
            const noPersons = section.querySelector(`[name='no_persons_${roomIndex}']`);
            const status = section.querySelector(`[name='status_${roomIndex}']`);
            
            // Validate each required field in the room section
            [roomId, checkInDate, checkInTime, noPersons, status].forEach((input) => {
                if (!input || !input.value.trim()) { // Invalid input
                    isValid = false;
                    input.classList.add('is-invalid'); // Mark input as invalid
                } else { // Valid input
                    input.classList.remove('is-invalid');
                }
            });
        });
    }
    
  
    if (!isValid) {
      alert('Please fill in all required fields before submitting the form.');
      return; // Stop further execution if validation fails.
    }else{
    // Proceed with submission if valid
    const formData = new FormData(form);
  
    // Collect room data
    const rooms = [];
    const bookedRooms = []

    if (roomSections.length > 0) {
        roomSections.forEach((section) => {
            const roomIndex = section.dataset.index; // Use data-index attribute for reliability
          
            const roomData = {
                room_id: section.querySelector(`[name='room_id_${roomIndex}']`)?.value || '',
                check_in_date: section.querySelector(`[name='check_in_date_${roomIndex}']`)?.value || '',
                check_in_time: section.querySelector(`[name='check_in_time_${roomIndex}']`)?.value || '',
                no_persons: section.querySelector(`[name='no_persons_${roomIndex}']`)?.value || '',
                booked_days_no: section.querySelector(`[name='booked_days_no_${roomIndex}']`)?.value || '',
                status: section.querySelector(`[name='status_${roomIndex}']`)?.value || ''
            };
          
            rooms.push(roomData);
        });
    }
    

    const payload = {
    formData: Object.fromEntries(formData),
    bookedRooms,
    rooms: rooms
  };
  document.querySelectorAll('.book-room-section').forEach((section) => {
    const roomIndex = section.dataset.index; // Use data-index attribute for reliability
    
    // Retrieve bookingRoom_id first
    const bookingRoom_id = section.querySelector(`[name='bookingRoom_id']`)?.value || '';

    const bookedRoomsData = {
      bookingRoom_id: bookingRoom_id,
      bookingRoom_room_id: section.querySelector(`[name='bookingRoom_room_id_${bookingRoom_id}']`)?.value || '',
      bookingRoom_check_out_date: section.querySelector(`[name='bookingRoom_check_out_date_${bookingRoom_id}']`)?.value || '',
      bookingRoom_check_in_time: section.querySelector(`[name='bookingRoom_check_in_time_${bookingRoom_id}']`)?.value || '',
      bookingRoom_no_persons: section.querySelector(`[name='bookingRoom_no_persons_${bookingRoom_id}']`)?.value || '',
      bookingRoom_no_days_booked: section.querySelector(`[name='bookingRoom_no_days_booked_${bookingRoom_id}']`)?.value || '',
      bookingRoom_status: section.querySelector(`[name='bookingRoom_status_${bookingRoom_id}']`)?.value || ''
    };
  
    bookedRooms.push(bookedRoomsData);
});

  console.log(payload)

  fetch(`/bookings/${payload.formData.booking_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  }).then(response => {
    console.log(response)
    if (response.ok) {
    
      return response.json().then(data => {
        console.log(data)
          toastr.options = {
          closeButton: false,
          progressBar: true,
          timeOut: 6000,
          extendedTimeOut: 1000,
      };
      toastr.success('Booking successfully updated ');
        form.reset();
        const roomDynamics = document.getElementsByClassName('room-dynamics');
        roomDynamics.innerHTML = '';
      
        setTimeout(() => {
          window.location.href = `/bookings/${data.booking.id}`;
        }, 5000); // Redirects after 3 seconds
        
      })
    //   alert('Booking successfully created with reference: ' + bookingReference);
    //   toastr.options = {
    //     closeButton: false,
    //     progressBar: true,
    //     timeOut: 6000,
    //     extendedTimeOut: 1000,
    // };
    // toastr.success('Booking successfully created with reference: ' + bookingReference);
    //   form.reset();
    //   const roomDynamics = document.getElementsByClassName('room-dynamics');
    //   roomDynamics.innerHTML = '';
    
    } else {
    
      return response.json().then(err => {

        errorMessage = err.message || 'Something went wrong!';
        toastr.options = {
          closeButton: false,
          progressBar: true,
          // timeOut: 5000,
          extendedTimeOut: 1000,
      };
      toastr.error(errorMessage);
      });

    //   alert('Failed to create booking.');
    }
  });
 
}
});



});
