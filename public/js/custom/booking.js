document.addEventListener('DOMContentLoaded', () => {
    //const roomTypeSelect = document.getElementById('roomType');
    // const roomNumberSelect = document.getElementById('roomNumber');
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    const addRoomBtn = document.getElementById('add-room-btn');
    const submitBtn = document.getElementById('submit-btn');
    const roomContainer = document.getElementById('room-container_0');
    const form = document.getElementById('bookingForm');
    // const updateBtn = document.getElementById('update-btn');
    // const form = document.querySelector('form');
    let roomCount = 0;
  
    // Function to generate unique booking reference
    function generateBookingReference() {
      return 'BR-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
  
     // Generate room options dynamically
  const roomOptions = rooms.map(room => 
    `<option value="${room.id}">${room.number.charAt(0).toUpperCase() + room.number.slice(1)} - &#8358;${room.price}</option>`
  ).join('');

  const roomTypeOptions = roomTypes.map(roomType => 
    `<option value="${roomType.type}">${roomType.type.charAt(0).toUpperCase() + roomType.type.slice(1)} </option>`
  ).join('');
    // Function to add a new room section
    function addRoomSection() {
      roomCount++; // Increment room count to assign unique identifiers
      const roomSection = document.createElement('div');
      roomSection.classList.add('product-info', 'room-section');
      roomSection.id = `room-container_${roomCount}`; // Unique container ID
      roomSection.dataset.index = roomCount;
      
      roomSection.innerHTML = `
             <div style="display: flex; justify-content: space-between; align-items: center;">
        <h4>Room Details Info</h4>
        <a href="#" class="remove-room" onclick="removeRoomSection(this)">Remove</a>
      </div>
        <div class="product-group">
        
          <div class="row">
            <!-- Room Type -->
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Room Type <span>*</span></label>
                <select required id="roomType_${roomCount}" class="form-select">
                  <option value="">Select..</option>
                     ${roomTypeOptions}
                </select>
              </div>
            </div>
    
            <!-- Room Number/Name -->
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Room Number/Name <span>*</span></label>
                <select name="room_id_${roomCount}" required id="roomNumber_${roomCount}" class="form-select" disabled>
                  <option value="">Select..</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="row">
            <!-- Check In Date -->
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Check In Date <span>*</span></label>
                <input class="form-control" name="check_in_date_${roomCount}" id="checkInDate_${roomCount}" type="date" required>
              </div>
            </div>
            
            <!-- Check Out Date -->
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Check Out Date <span>*</span></label>
                <input class="form-control" name="check_out_date_${roomCount}" id="checkOutDate_${roomCount}" type="date" required>
                <span class="error-message" role="alert" style="color: red;"><strong></strong></span>
              </div>
            </div>
          </div>
          
          <div class="row">
            <!-- Check In Time -->
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Check In Time <span>*</span></label>
                <input class="form-control" name="check_in_time_${roomCount}" type="time" required>
              </div>
            </div>
            
            <!-- Room Discount -->
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Room Discount <span>(* per night)</span></label>
                <input class="form-control" name="discount_${roomCount}" placeholder="Discount for Room" type="number" onkeydown="return event.key !== 'e' && event.key !== 'E'">
              </div>
            </div>
          </div>
          
          <div class="row">
            <!-- Number of Persons -->
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Number of Persons</label>
                <input class="form-control" name="no_persons_${roomCount}" placeholder="Enter Number of Persons" type="number" required onkeydown="return event.key !== 'e' && event.key !== 'E'">
              </div>
            </div>
            
            <div class="col-sm-6">
              <div class="mb-3">
                <label class="form-label">Status<span>*</span></label>
                <select required name="status_${roomCount}" class="form-select">
                  <option value="">Select an Option</option>
                  <option value="pending">Pending</option>
                  <option value="checkedin">Checkin</option>
                </select>
              </div>
            </div>
          </div>
          </div>
          
       
      `;
    
      // Append the new room section to the room container
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

    submitBtn.addEventListener('click', (e) => {
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
        document.querySelectorAll('.room-section').forEach((section) => {
            const roomIndex = section.dataset.index; // Use data-index attribute for reliability
          
            const roomId = section.querySelector(`[name='room_id_${roomIndex}']`);
            const checkInDate = section.querySelector(`[name='check_in_date_${roomIndex}']`);
            const checkInTime = section.querySelector(`[name='check_in_time_${roomIndex}']`);
            const checkOutDate = section.querySelector(`[name='check_out_date_${roomIndex}']`);
            const noPersons = section.querySelector(`[name='no_persons_${roomIndex}']`);
            const status = section.querySelector(`[name='status_${roomIndex}']`);
            
      
          // Validate each required field in the room section
          [roomId, checkInDate, checkInTime, checkOutDate, noPersons, status].forEach((input) => {
            if (!input || !input.value.trim()) { // Invalid input
                // isValid = false;
                console.log(input)
                //input.classList.add('is-invalid'); // No error, input is an element.
            } else { // Valid input
                input.classList.remove('is-invalid');
            }
        });
        
        });
      
        if (!isValid) {
          alert('Please fill in all required fields before submitting the form.');
          return; // Stop further execution if validation fails.
        }else{
        // Proceed with submission if valid
        const bookingReference = generateBookingReference();
        const formData = new FormData(form);
      
        // Collect room data
        const rooms = [];
        document.querySelectorAll('.room-section').forEach((section) => {
                const roomIndex = section.dataset.index; // Use data-index attribute for reliability    
                const roomData = {
                  room_id: section.querySelector(`[name='room_id_${roomIndex}']`)?.value || '',
                  check_in_date: section.querySelector(`[name='check_in_date_${roomIndex}']`)?.value || '',
                  check_in_time: section.querySelector(`[name='check_in_time_${roomIndex}']`)?.value || '',
                  check_out_date: section.querySelector(`[name='check_out_date_${roomIndex}']`)?.value || '',
                  discount: section.querySelector(`[name='discount_${roomIndex}']`)?.value || '',
                  no_persons: section.querySelector(`[name='no_persons_${roomIndex}']`)?.value || '',
                  //booked_days_no: section.querySelector(`[name='booked_days_no_${roomIndex}']`)?.value || '',
                  status: section.querySelector(`[name='status_${roomIndex}']`)?.value || ''
                };
         
                rooms.push(roomData);
              });
        
        const payload = {
        booking_reference: bookingReference,
        formData: Object.fromEntries(formData),
        rooms: rooms
      };
  
      fetch('/bookings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(response => {

        if (response.ok) {
        
          return response.json().then(data => {
          
              toastr.options = {
              closeButton: false,
              progressBar: true,
              timeOut: 6000,
              extendedTimeOut: 1000,
          };
          toastr.success('Booking successfully created with reference: ' + bookingReference);
            form.reset();
            const roomDynamics = document.getElementsByClassName('room-dynamics');
            roomDynamics.innerHTML = '';
          
            setTimeout(() => {
              window.location.href = `/bookings/${data.booking.id}`;
            }, 5000); // Redirects after 3 seconds
            
          })

        
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
    
        
        }
      });
    }
    });


     // Listen for changes on Room Type
    document.addEventListener('change', async (event) => {
      const target = event.target;

      // Check if the changed element is a Room Type dropdown
      if (target.matches('[id^="roomType_"]')) {
        const roomTypeSelect = target;
        const roomCount = roomTypeSelect.id.split('_')[1]; // Extract room index from ID
        console.log(roomCount)
        const roomNumberSelect = document.querySelector(`#roomNumber_${roomCount}`);

        const selectedRoomType = roomTypeSelect.value;

        // Disable Room Number/Name if no Room Type is selected
        if (!selectedRoomType) {
          roomNumberSelect.disabled = true;
          roomNumberSelect.innerHTML = '<option value="">Select..</option>'; // Clear options
          return;
        }

        // Fetch and populate Room Number/Name options based on selected Room Type
        try {
          const response = await fetch(`/rooms?type=${selectedRoomType}`);
          const rooms = await response.json();

          // Populate Room Number/Name dropdown
          roomNumberSelect.innerHTML = '<option value="">Select..</option>';
          rooms.rooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = `${room.number.charAt(0).toUpperCase() + room.number.slice(1)} - ₦${room.price}`;
            roomNumberSelect.appendChild(option);
          });

          // Enable the Room Number/Name dropdown
          roomNumberSelect.disabled = false;
        } catch (error) {
          console.error('Error fetching rooms:', error);
          roomNumberSelect.disabled = true;
          roomNumberSelect.innerHTML = '<option value="">Error loading rooms</option>';
        }
      }
    });


  //check selected room availability
  async function checkRoomAvailability(event) {
    const target = event.target;
    const roomCount = target.closest('.product-info').dataset.index; // Get room index from parent container
  
    const roomNumberSelect = document.querySelector(`#roomNumber_${roomCount}`);
    const checkInDate = document.querySelector(`#checkInDate_${roomCount}`);
    const checkOutDate = document.querySelector(`#checkOutDate_${roomCount}`);
    const alertSpan = document.querySelector(
      `#room-container_${roomCount} span[role="alert"] > strong`
    ); // Select error message <strong>
  
    const roomId = roomNumberSelect.value;
    const checkIn = checkInDate.value;
    const checkOut = checkOutDate.value;
  
    if (roomId && checkIn && checkOut) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkInDateObj = new Date(checkIn);
      checkInDateObj.setHours(0, 0, 0, 0);
      const checkOutDateObj = new Date(checkOut);
      checkOutDateObj.setHours(0, 0, 0, 0);
      
      console.log(checkIn)
      console.log(checkOut)
      // Validate dates
      if (
        checkOutDateObj < checkInDateObj ||
        checkInDateObj < today ||
        checkOutDateObj < today
      ) {
        console.log("got here")
        const errorMessage = 'Please select valid check-in and check-out dates';
        if (alertSpan) alertSpan.textContent = errorMessage; // Display the error message
        submitBtn.setAttribute('disabled', 'true'); // Disable the submit button
        return; // Stop further execution if dates are invalid
      }else{
        if (alertSpan) alertSpan.textContent = ""; // Display the error message
        submitBtn.setAttribute('disabled', 'false'); // Disable the submit button
      }
  
      try {
        const response = await fetch('/rooms/check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, checkIn, checkOut })
        });
  
        const result = await response.json();
  
        if (result.available === true) {
          submitBtn.removeAttribute('disabled');
          if (alertSpan) alertSpan.textContent = '';
        } else {
          let errorMessage = 'Room is not available for the selected dates';
          submitBtn.setAttribute('disabled', 'true');
          if (alertSpan) alertSpan.textContent = errorMessage;
        }
      } catch (error) {
        console.error('Error checking room availability:', error);
      }
    }
  }
  
  
  // Event delegation for dynamically created room sections
  document.addEventListener('change', (event) => {
    const target = event.target;
    if (
      target.matches('[id^="checkInDate_"]') ||
      target.matches('[id^="checkOutDate_"]') ||
      target.matches('[id^="roomNumber_"]')
    ) {
      checkRoomAvailability(event);
    }
  });
  



    
  });
  