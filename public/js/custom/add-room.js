

document.addEventListener("DOMContentLoaded", function () {
  // const paneContainer = document.getElementById("paneContainer"); // The wrapper holding all form panes
  async function updateRoomNumbers(roomTypeSelect) {
    const roomIndex = roomTypeSelect.id.split('_')[1]; // Extract index from roomType_0
    const roomNumberSelect = document.querySelector(`#roomNumber_${roomIndex}`); // Correct selection
    console.log("SELECTED ROOM NUMBER:", roomNumberSelect);

    const selectedRoomType = roomTypeSelect.value;
    if (!selectedRoomType) {
        roomNumberSelect.disabled = true;
        roomNumberSelect.innerHTML = '<option value="">Select..</option>'; // Clear options
        return;
    }

    try {
        const response = await fetch(`/rooms?type=${selectedRoomType}`);
        const data = await response.json();

        console.log("Fetched Rooms:", data.rooms);

        // Populate Room Number dropdown
        roomNumberSelect.disabled = false;
        roomNumberSelect.innerHTML = '<option value="">Select..</option>';
        data.rooms.forEach(room => {
            const option = document.createElement("option");
            option.value = room.id;
            option.textContent = `${room.number.charAt(0).toUpperCase() + room.number.slice(1)} - ₦${room.price}`;
            roomNumberSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching rooms:", error);
        roomNumberSelect.disabled = true;
        roomNumberSelect.innerHTML = '<option value="">Error loading rooms</option>';
    }
}

// Listen for changes on Room Type (Delegated Event Listener)
document.addEventListener("change", function (event) {
    if (event.target.matches('[id^="roomType_"]')) {
        updateRoomNumbers(event.target);
    }
});


})




document.addEventListener("DOMContentLoaded", function () {
    // const paneContainer = document.getElementById("paneContainer"); // The wrapper holding all form panes
    async function updatePaymentMode(paymentStatusSelect) {
      const roomIndex = paymentStatusSelect.id.split('_')[1]; // Extract index from roomType_0
      const paymentModeSelect = document.querySelector(`#paymentMode_${roomIndex}`); // Correct selection
      const partPaymentDiv = document.querySelector(`#partPayment_${roomIndex}`);
;
  
      const selectedPaymentStatus = paymentStatusSelect.value;
      if (!selectedPaymentStatus) {
        paymentModeSelect.disabled = true;
        paymentModeSelect.innerHTML = '<option value="">Selecty...</option>'; // Clear options
          return;
      }
         // Handle the "Part Payment" case
      if (selectedPaymentStatus === "Part Payment") {
        if (partPaymentDiv) {
            partPaymentDiv.style.display = "block";
            const partPaymentAmountInput = partPaymentDiv.querySelector('input');
            if (partPaymentAmountInput) {
               partPaymentAmountInput.setAttribute("required", "true");
            }
        }
        } else {
        if (partPaymentDiv) {
            partPaymentDiv.style.display = "none";
            const partPaymentAmountInput = partPaymentDiv.querySelector('input');
            if (partPaymentAmountInput) {
                partPaymentAmountInput.removeAttribute("required");
            }
        }
            if (selectedPaymentStatus == "Credit") {
                paymentModeSelect.disabled = false;
                paymentModeSelect.innerHTML = ''
                const option = document.createElement('option');
                option.value = 'None';
                option.textContent = 'None';
                paymentModeSelect.appendChild(option);
                return;
            }
        }
  
      try {
          const response = await fetch(`/bookings/paymentmodes`);
          const paymentModes = await response.json();
  
          console.log("Fetched Rooms:", paymentModes);
  
          // Populate Room Number dropdown
          paymentModeSelect.disabled = false;
          paymentModeSelect.innerHTML = '<option value="">Select..</option>';
          paymentModes.data.forEach(paymentMode => {
            const option = document.createElement('option');
            option.value = paymentMode.mode;
            option.textContent = paymentMode.mode;
            paymentModeSelect.appendChild(option);
          });
  
      } catch (error) {
          console.error("Error fetching rooms:", error);
          paymentModeSelect.disabled = true;
          paymentModeSelect.innerHTML = '<option value="">Error loading rooms</option>';
      }
  }
  
  // Listen for changes on Room Type (Delegated Event Listener)
  document.addEventListener("change", function (event) {
      if (event.target.matches('[id^="paymentStatus_"]')) {
          updatePaymentMode(event.target);
      }
  });
  

  
})


// const submitBtn = document.querySelector(`#saveBtn_${roomIndex}`);


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

            if (response.ok) {
                alert("Room added successfully!");
                form.reset(); // Reset form after success
                location.reload(); // Optionally reload to reflect changes
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

  //check selected room availability
  async function checkRoomAvailability(event) {

    const target = event.target;
    console.log(target)
    // const roomCount = target.closest('.product-info').dataset.index; // Get room index from parent container
    const roomIndex = target.id.split('_')[1]; // Extract index from roomType_0
    console.log("DATA INDEX")
    console.log(roomIndex)
    const roomNumberSelect = document.querySelector(`#roomNumber_${roomIndex}`);
    const checkInDate = document.querySelector(`#checkInDate_${roomIndex}`);
    const checkOutDate = document.querySelector(`#checkOutDate_${roomIndex}`);
    const submitBtn = document.querySelector(`#saveBtn_${roomIndex}`);
    const alertSpan = document.querySelector(
      `#room-container_${roomIndex} span[role="alert"] > strong`
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
        const errorMessage = 'Please select valid dates';
        if (alertSpan) alertSpan.textContent = errorMessage; // Display the error message
        submitBtn.setAttribute('disabled', 'true'); // Disable the submit button
        console.log(alertSpan)
        console.log("Invalid Dates")
        return; // Stop further execution if dates are invalid
      }else{
        if (alertSpan) alertSpan.textContent = ""; // Display the error message
        submitBtn.setAttribute('disabled', 'false'); // Disable the submit button
        console.log("Valid  Dates")
      }
  
      try {
        const response = await fetch('/rooms/check-availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, checkIn, checkOut })
        });
        console.log(response)
        const result = await response.json();
        console.log(result)
        if (result.available === true) {
          submitBtn.removeAttribute('disabled');
          if (alertSpan) alertSpan.textContent = '';
        } else {
          let errorMessage = 'Room is not available for this dates';
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
  