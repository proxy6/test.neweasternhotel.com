

//SUMIT MODAL FORM
document.addEventListener("DOMContentLoaded", function () {
  
    async function submitForm(submitBtn) {
        const roomIndex = submitBtn.id.split('_')[1]; // Extract booking ID
        const form = document.querySelector(`#addRoom_${roomIndex}`);

        if (!form) {
            console.error("Form not found for index:", roomIndex);
            return;
        }

        let isValid = true; // Assume form is valid initially.

        // Validate required inputs
        form.querySelectorAll('input[required], select[required]').forEach((input) => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
                console.warn(`Missing value for: ${input.name}`);
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            console.log("Validation failed");
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving...";
        // Debugging: Log form data
        console.log("Form Data Entries:");
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]); // Key-value pairs
        }
        let backendData = JSON.stringify(Object.fromEntries(formData))
        console.log(backendData)
        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: backendData,
                headers: { "Content-Type": "application/json" }
            });
            console.log("RESPONSE")
            console.log(response)
            if (response.ok) {
                // alert("Room added successfully!");
                response.json().then(data => {
                    console.log("SUBMIT FORM")
                    console.log(data)
                    toastr.options = {
                    closeButton: false,
                    progressBar: true,
                    timeOut: 6000,
                    extendedTimeOut: 1000,
                };
                toastr.success('Booking successfully created with reference: ' + data.booking.booking_reference);
                form.reset(); // Reset form after success
                //  location.reload(); // Optionally reload to reflect changes
                window.location.href = `/bookings/${data.booking.id}/singlereceipt`;
            })
             
            } else {
                const errorMessage = await response.text();
                console.error("Submission failed:", errorMessage);
                alert("Error: " + errorMessage);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An unexpected error occurred.");
        }
    }

    // Listen for button clicks
    document.addEventListener("click", function (event) {
        if (event.target.matches('[id^="saveBtn_"]')) {
            event.preventDefault();
            submitForm(event.target);
        }
    });

});

const updateBtn = document.getElementById('update-btn');
const saveAddon = document.getElementById('save-addon');
  //check selected room availability
  async function checkBookedRoomAvailability(event) {
    const target = event.target;
    const roomCount = target.closest('.book-room-section').dataset.index; // Get room index from parent container
    console.log("ROOMCOUNT")
    console.log(roomCount)
    const roomNumberSelect = document.querySelector(`#bookedRoomNumber_${roomCount}`);
    const bookingId = document.querySelector(`#bookedRoomNumberId_${roomCount}`);
    const checkInDate = document.querySelector(`#bookedCheckInDate_${roomCount}`);
    const checkOutDate = document.querySelector(`#bookedCheckOutDate_${roomCount}`);
    const alertSpan = document.querySelector(
      `#bookedRoomContainer_${roomCount} span[role="alert"] > strong`
    ); // Select error message <strong>
  
    const roomId = roomNumberSelect.value;
    const checkIn = checkInDate.value;
    const checkOut = checkOutDate.value;
    const booking_id = bookingId.value
    console.log(roomId)
    console.log(checkIn)
    console.log(checkOut)
    console.log("BOOKING ID")
    console.log(booking_id)
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
        //removed this condition so as not to pick check in date for edit booking
        // checkOutDateObj < checkInDateObj ||
        // checkInDateObj < today ||
        checkOutDateObj < today
      ) {
        console.log("got here")
        const errorMessage = 'Please select valid check-in and check-out dates';
        if (alertSpan) alertSpan.textContent = errorMessage; // Display the error message
        updateBtn.setAttribute('disabled', 'true'); // Disable the submit button
        return; // Stop further execution if dates are invalid
      }else{
        if (alertSpan) alertSpan.textContent = ""; // Display the error message
        updateBtn.setAttribute('disabled', 'false'); // Disable the submit button
      }
  
      try {
        const response = await fetch('/rooms/edit-check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, checkIn, checkOut, booking_id })
        });
  
        const result = await response.json();
        console.log(result)
        if (result.available === true) {
          updateBtn.removeAttribute('disabled');
          if (alertSpan) alertSpan.textContent = '';
        } else {
          let errorMessage = 'Room is not available for the selected dates';
          updateBtn.setAttribute('disabled', 'true');
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
      target.matches('[id^="bookedCheckOutDate_"]')
    ) {
      checkBookedRoomAvailability(event);
    }
  });

    
    // Listen for changes on Addon Type
    document.addEventListener('change', async (event) => {
      const target = event.target;

      // Check if the changed element is a Room Type dropdown
      if (target.matches('[id^="addonType_"]')) {
        const addonTypeSelect = target;
        const bookingRoomCount = addonTypeSelect.id.split('_')[1]; // Extract room index from ID
        console.log(bookingRoomCount)
        const addonNameSelect = document.querySelector(`#addonName_${bookingRoomCount}`);

        const selectedRoomType = addonTypeSelect.value;
      
        console.log(selectedRoomType)
        // Disable Room Number/Name if no Room Type is selected
        if (!selectedRoomType) {
          console.log("GOT HERE !")
          addonNameSelect.disabled = true;
          addonNameSelect.innerHTML = '<option value="">Select..</option>'; // Clear options
          return;
        }

        // Fetch and populate Room Number/Name options based on selected Room Type
        try {
          const response = await fetch(`/addons/type?type=${selectedRoomType}`);
          const addons = await response.json();
          console.log(addons)
          // Populate Room Number/Name dropdown
          addonNameSelect.innerHTML = '<option value="">Select..</option>';
          addons.data.forEach(addon => {
            const option = document.createElement('option');
            option.value = addon.id;
            option.textContent = `${addon.name.charAt(0).toUpperCase() + addon.name.slice(1)}`;
            addonNameSelect.appendChild(option);
          });

          // Enable the Room Number/Name dropdown
          addonNameSelect.disabled = false;
        } catch (error) {
          console.error('Error fetching rooms:', error);
          addonNameSelect.disabled = true;
          addonNameSelect.innerHTML = '<option value="">Error loading rooms</option>';
        }
      }
    });


    updateBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent form submission if validation fails.
    
      let isValid = true; // Assume form is valid initially.
    
      // Validate Customer Info
      form.querySelectorAll('input[required], select[required]').forEach((input) => {
          if (!input || !input.value.trim()) { // Invalid input
            // input.classList.remove('is-invalid');
            isValid = false;
            console.log(input)
            input.classList.add('is-invalid'); // No error, input is an element.
          } else { // Invalid or missing input
            input.classList.remove('is-invalid');
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
              const checkOutDate = section.querySelector(`[name='check_out_date_${roomIndex}']`);
              const noPersons = section.querySelector(`[name='no_persons_${roomIndex}']`);
              const status = section.querySelector(`[name='status_${roomIndex}']`);
              
              // Validate each required field in the room section
              [roomId, checkInDate, checkInTime, checkOutDate, noPersons, status].forEach((input) => {
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
    
  
      const payload = {
      formData: Object.fromEntries(formData),

    };

  
    fetch(`/bookings/${payload.formData.booking_id}`, {
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
        toastr.success('Booking successfully updated ');
          form.reset();
          const roomDynamics = document.getElementsByClassName('room-dynamics');
          roomDynamics.innerHTML = '';
        
          setTimeout(() => {
            window.location.href = `/bookings`;
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
  
      //   alert('Failed to create booking.');
      }
    });
   
  }
  });


  document.addEventListener("DOMContentLoaded", function () {
  
  updateBtn.addEventListener('click', async (event) => {
      e.preventDefault(); // Prevent form submission if validation fails.
    
        const roomIndex = submitBtn.id.split('_')[1]; // Extract booking ID
        const form = document.querySelector(`#addRoom_${roomIndex}`);

        if (!form) {
            console.error("Form not found for index:", roomIndex);
            return;
        }

        let isValid = true; // Assume form is valid initially.

        // Validate required inputs
        form.querySelectorAll('input[required], select[required]').forEach((input) => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
                console.warn(`Missing value for: ${input.name}`);
            } else {
                input.classList.remove('is-invalid');
            }
        });

        if (!isValid) {
            console.log("Validation failed");
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        submitBtn.disabled = true;
        submitBtn.textContent = "Saving...";
        // Debugging: Log form data
        console.log("Form Data Entries:");
        for (const pair of formData.entries()) {
            console.log(pair[0], pair[1]); // Key-value pairs
        }
        let backendData = JSON.stringify(Object.fromEntries(formData))
        console.log(backendData)
        try {
            const response = await fetch(form.action, {
                method: "POST",
                body: backendData,
                headers: { "Content-Type": "application/json" }
            });
            console.log("RESPONSE")
            console.log(response)
            if (response.ok) {
                // alert("Room added successfully!");
                response.json().then(data => {
                    console.log("SUBMIT FORM")
                    console.log(data)
                    toastr.options = {
                    closeButton: false,
                    progressBar: true,
                    timeOut: 6000,
                    extendedTimeOut: 1000,
                };
                toastr.success('Booking successfully created with reference: ' + data.booking.booking_reference);
                form.reset(); // Reset form after success
                //  location.reload(); // Optionally reload to reflect changes
                window.location.href = `/bookings/${data.booking.id}/singlereceipt`;
            })
             
            } else {
                const errorMessage = await response.text();
                console.error("Submission failed:", errorMessage);
                alert("Error: " + errorMessage);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An unexpected error occurred.");
        }
    });

    // Listen for button clicks
    // document.addEventListener("click", function (event) {
    //     if (event.target.matches('[id^="saveBtn_"]')) {
    //         event.preventDefault();
    //         submitForm(event.target);
    //     }
    // });

});
  
  
    