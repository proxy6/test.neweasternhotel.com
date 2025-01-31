let paneContainer = document.getElementById("bookingForm"); // The wrapper that holds form panes
const submitBtn = document.getElementById('savePane2');
document.addEventListener("DOMContentLoaded", function () {
  const panes = document.querySelectorAll(".form-pane");
  let currentPane = 0;
  let bookingId = null; // Store the booking ID from API response
  

  function showPane(index) {
      const allPanes = document.querySelectorAll(".form-pane");
      allPanes.forEach((pane, i) => {
          pane.style.display = i === index ? "block" : "none";
      });
  }

  function validateInputs(pane) {
    let isValid = true;
    console.log("THIS IS THE PANE RECEIVED")
    console.log(pane)
    pane.querySelectorAll("input[required], select[required]").forEach(input => {
        // Check if the input is empty and required
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
            alert("Please fill out all required inputs")
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
}


  async function submitPane(url, pane, prompt, callback) {
    // const formData = new FormData(document.getElementById("bookingForm"));
    console.log("This is the pane")
    console.log(pane)
      const formData = new FormData();
      panes.forEach(pane => {
        pane.querySelectorAll("input, select").forEach(input => {
            formData.append(input.name, input.value);
        });
    });
      if (bookingId) {
          formData.append("booking_id", bookingId); // Attach booking ID if available
      }

      console.log("THIS IS FORM DATA")
      console.log(formData)
      console.log("THIS IS FORM URL")
      console.log(url)

      try {
          const response = await fetch(url, {
              method: "POST",
              body: JSON.stringify(Object.fromEntries(formData)),
              headers: { "Content-Type": "application/json" }
          });

          const data = await response.json();
          console.log("This is the response data")
          console.log(data)
          if (data.message= "Successful") {
              // if (prompt === "continue") {
                  bookingId = data.booking.id; // Save the booking ID from response
              // }
              callback(data);
          } else {
            toastr.options = {
              closeButton: false,
              progressBar: true,
              timeOut: 3000,
              extendedTimeOut: 1000,
          };
           toastr.success('Error submitting data. Please try again.');
              // alert("Error submitting data. Please try again.");
          }
      
        } catch (error) {
          console.error("Error:", error);
      }
  }

  // Move to Pane 2 when "Next" is clicked in Pane 1
  document.getElementById("nextPane1").addEventListener("click", function () {
      if (!validateInputs(panes[0])) return; // Validate Pane 1 before proceeding

      currentPane = 1;
      showPane(currentPane);
      currentPane++;
      currentPane++;
  });

  // Move to Pane 1 when "Prev" is clicked in Pane 2
  document.getElementById("prevPane").addEventListener("click", function () {
      currentPane = 0;
      showPane(currentPane);
  });

  // Handle "Save" button on Pane 2 → Calls /bookings and redirects to thank-you page
  submitBtn.addEventListener("click", function () {
    const saveButton = this;
      if (!validateInputs(panes[0]) || !validateInputs(panes[1])) return; // Validate Pane 1 & 2
      saveButton.disabled = true;
      saveButton.textContent = "Saving...";
      console.log("SUBMIT")
      console.log("DISPLAY THE PLANE BEFORE SENDING")
      console.log(panes[0])
      let prompt = "save";
      submitPane("/bookings/add", [panes[0], panes[1]], prompt, () => {
          if(bookingId){
            window.location.href = `/bookings/${bookingId}/receipt`;
          }else{
            window.location.href = "/bookings"
          }
         
      });
  });

 
document.getElementById("saveAndAddRoom").addEventListener("click", function () {
    if (!validateInputs(panes[0]) || !validateInputs(panes[1])) return; // Validate Pane 1 & 2


    submitPane(`/bookings/add`, [panes[0], panes[1]], "continue", () => {
        if (!bookingId) {
            alert("Saving Booking Failed");
            return;
        }

      
        // panes[0].querySelectorAll("input, select").forEach(input => input.value = "");
        // panes[1].querySelectorAll("input, select").forEach(input => input.value = "");

        console.log("CURRNT PANE")
        console.log(currentPane)
        addRoomSection(currentPane);


        document.querySelectorAll(".form-pane").forEach((pane) => {
          pane.style.display = "none";
        });
        const allPanes = document.querySelectorAll(".form-pane");
        const newPane = allPanes[allPanes.length - 1];
        newPane.style.display = "block";
        // Navigate back to pane 1
        // currentPane = 2;
        // showPane(currentPane);


    });
});

async function addRoomAndExit(event) {
  if (!bookingId){
    alert("Adding Rooms Failed")
    return;
  }

  console.log("CURRENT PANE VALIDATION")
  console.log(currentPane-1)
  console.log(panes[currentPane-1])
  if (!validateInputs(panes[currentPane-1])) return; // Validate Pane

  submitPane(`/bookings/${bookingId}/add`, [panes[currentPane-1]], "save", () => {
    if(bookingId){
      window.location.href = `/bookings/${bookingId}/receipt`;
    }else{
      window.location.href = "/bookings"
    }

  });
};

async function addMoreRoom(event) {
  
  console.log("CURRENT PANE VALIDATION")

  let validatePaneNo = currentPane - 1
  console.log(panes[validatePaneNo])
  const allPanes1 = document.querySelectorAll(".form-pane");
  const newPane1 = allPanes1[allPanes1.length - 1];
  console.log(newPane1)

  if (!newPane1) {
    console.error("No valid pane found to validate.");
    return;
}
  if (!validateInputs(newPane1)) return; // Validate Pane

  submitPane(`/bookings/${bookingId}/add`, [panes[currentPane - 1]], "continue", () => {
      if (!bookingId) {
          alert("Saving Booking Failed");
          return;
      }

      console.log("CURRNT PANE")
      console.log(currentPane)
      addRoomSection(currentPane);


      document.querySelectorAll(".form-pane").forEach((pane) => {
        pane.style.display = "none";
      });
      const allPanes = document.querySelectorAll(".form-pane");
      const newPane = allPanes[allPanes.length - 1];
      newPane.style.display = "block";
      // Navigate back to pane 1
      // currentPane = 2;
      // showPane(currentPane);


  });
};

// Listen for changes on addMoreRoom (Delegated Event Listener)
document.addEventListener("click", function (event) {
  if (event.target.matches('[id^="addMoreRoom_"]')) {
    addMoreRoom(event.target);
  }
});

// Listen for changes on addRoomAndExit (Delegated Event Listener)
document.addEventListener("click", function (event) {
  if (event.target.matches('[id^="addRoomAndExit_"]')) {
    addRoomAndExit(event.target);
  }
});


  // showPane(currentPane);


function addRoomSection(currentPane) {
  const roomTypeOptions = roomTypes.map(roomType => 
    `<option value="${roomType.type}">${roomType.type.charAt(0).toUpperCase() + roomType.type.slice(1)} </option>`
   ).join('');
   
  let roomCount = bookingId
  roomCount++; // Increment room count to assign unique identifiers
  // currentPane++
  let pane = document.createElement("div");
        pane.className = "form-pane";
        pane.id = `pane${currentPane}`;
        pane.style.display = "block"; // Show the pane immediately
        currentPane =  currentPane++
        // Add inner HTML structure
        pane.innerHTML = `
            <div class="card"> 
                <div class="card-body">
                    <div class="product-info room-section" id="room-container">
                        <h4>Room Details Info</h4>
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
                                        <select name="room_id_0" required id="roomNumber_${roomCount}" class="form-select" disabled>
                                            <option value="">Select..</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="row"> 
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Check In Date <span>*</span></label>
                                        <input class="form-control" name="check_in_date_0" id="checkInDate_${roomCount}" type="date" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Check Out Date <span>*</span></label>
                                        <input class="form-control" name="check_out_date_0" id="checkOutDate_${roomCount}" type="date" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row"> 
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Check In Time <span>*</span></label>
                                        <input class="form-control" name="check_in_time_0" type="time" required>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Room Discount </label>
                                        <input class="form-control" name="discount_0" placeholder="Discount for Room" type="number" onkeydown="return event.key !== 'e' && event.key !== 'E'">
                                    </div>
                                </div>
                            </div>

                            <div class="row"> 
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Number of Persons<span>*</span></label>
                                        <input class="form-control" name="no_persons_0" placeholder="Enter Number of Persons" type="number" required onkeydown="return event.key !== 'e' && event.key !== 'E'">
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Checkin Status<span>*</span></label>
                                        <select required name="status_0" class="form-select"> 
                                            <option value="">Select an Option</option> 
                                            <option value="pending">Pending</option>
                                            <option value="checkedin">Checkin</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Payment Status<span>*</span></label>
                                        <select required name="payment_status_0" class="form-select" id="paymentStatus_${roomCount}"> 
                                            <option value="">Select an Option</option> 
                                            <option value="Part Payment"> Part Payment </option>
                                            <option value="Full Payment"> Full Payment </option>
                                            <option value="Credit"> Credit </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="mb-3">
                                        <label class="form-label">Payment Mode<span>*</span></label>
                                        <select required id="paymentMode_${roomCount}" name="payment_mode_0" class="form-select" disabled> 
                                            <option value="">Select..</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-sm-12" id="partPayment_${roomCount}" style="display: none;">
                                    <div class="mb-3">
                                        <label class="form-label">Part Payment Amount<span>*</span></label>
                                        <input class="form-control" name="part_payment_amount_0" type="number" onkeydown="return event.key !== 'e' && event.key !== 'E'">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                    <div class="mt-4">
                        <div class="row"> 
                            <div class="col-sm-12 text-end">
                                <button type="button" id="addRoomAndExit_${roomCount}" class="btn btn-primary">Save</button>
                                <button type="button" id="addMoreRoom_${roomCount}" class="btn btn-tertiary">Save and Add Room</button>
                                <a href="/bookings" class="btn btn-secondary">Cancel</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append the pane to the DOM
        paneContainer.appendChild(pane);
}
});



// document.addEventListener("DOMContentLoaded", function () {
//   // const paneContainer = document.getElementById("paneContainer"); // The wrapper holding all form panes
//   // let roomIndex = 1; // Counter to track unique room indexes
//     // Function to update room numbers based on the selected room type

//     async function updateRoomNumbers(roomTypeSelect) {
//       const roomIndex = roomTypeSelect.id.split('_')[1];
//       // const roomCount = roomTypeSelect.dataset.index; // Get unique index
//       const roomNumberSelect =  document.querySelector(`#roomNumber_${roomIndex}`);
//       console.log("SELECTED ROOM NUMBER")
//       console.log(roomNumberSelect)
//       console.log(roomNumberSelect)
//       const selectedRoomType = roomTypeSelect.value;
//       console.log(selectedRoomType)
//       if (!selectedRoomType) {
//           console.log("GOT HERE")
//           roomNumberSelect.disabled = true;
//           roomNumberSelect.innerHTML = '<option value="">Select..</option>'; // Clear options
//           return;
//       }

//       try {
//         console.log("try rooms")
//           const response = await fetch(`/rooms?type=${selectedRoomType}`);
//           const rooms = await response.json();
//           console.log(rooms)
//           console.log("rooms")
//           // Populate Room Number dropdown
//           roomNumberSelect.innerHTML = '<option value="">Select..</option>';
//           rooms.rooms.forEach(room => {
//               const option = document.createElement("option");
//               option.value = room.id;
//               option.textContent = `${room.number.charAt(0).toUpperCase() + room.number.slice(1)} - ₦${room.price}`;
//               roomNumberSelect.appendChild(option);
//           });

//           // Enable the Room Number dropdown
//           roomNumberSelect.disabled = false;
//       } catch (error) {
//           console.error("Error fetching rooms:", error);
//           roomNumberSelect.disabled = true;
//           roomNumberSelect.innerHTML = '<option value="">Error loading rooms</option>';
//       }
//   }

//   // Listen for changes on Room Type (Delegated Event Listener)
//   document.addEventListener("change", function (event) {
//       if (event.target.matches('[id^="roomType_"]')) {
//         // console.log(event.target.value)
//         // const data = event.target.value
//           updateRoomNumbers(event.target);
//       }
//   });

// })


// document.addEventListener("DOMContentLoaded", function () {
// const paymentStatusChange = document.getElementById('paymentStatus');
// // Listen for payment status change
// paymentStatusChange.addEventListener('change', async (event) => {
//   // const target = event.target;

//   // Check if the changed element is a Room Type dropdown
//   // if (target.matches('[id^="paymentStatus"]')) {
//     const paymentStatusSelected = paymentStatusChange.value;
//     // const paymentStatusSelect = paymentStatusChange.value;
//     // const roomCount = paymentStatusSelect.id.split('_')[1]; // Extract room index from ID
//     // console.log(roomCount)
//     // const roomNumberSelect = document.querySelector(`#roomNumber_${roomCount}`);
//     const paymentModeSelect = document.querySelector(`#paymentMode`);
   
//     const partPaymentInput = document.querySelector(`#partPaymentInput`);
//     const partPaymentAmountInput = partPaymentInput.querySelector('input');
//     // Disable Room Number/Name if no Room Type is selected
//     if (!paymentStatusSelected) {
//       paymentModeSelect.disabled = true;
//       paymentModeSelect.innerHTML = '<option value="">Select..</option>'; // Clear options
//       return;
//     }
//     console.log(paymentStatusSelected)

//     if (paymentStatusSelected == "Part Payment") {
      
//       partPaymentInput.style.display = "block";
//       partPaymentAmountInput.setAttribute("required", "true");
//              // 🔹 Manually validate the input when shown
//             // if (!partPaymentInput.value.trim()) {
//             //     partPaymentInput.classList.add('is-invalid');
//             // } else {
//             //     partPaymentInput.classList.remove('is-invalid');
//             // }
      
           
//     }else{
//       partPaymentInput.style.display = "none";
//       partPaymentAmountInput.removeAttribute("required"); 
//       // partPaymentInput.classList.remove('is-invalid'); // Remove error styling
//     }
//     if (paymentStatusSelected == "Credit") {
//       paymentModeSelect.disabled = false;
//       paymentModeSelect.innerHTML = ''
//       const option = document.createElement('option');
//       option.value = 'None';
//       option.textContent = 'None';
//       paymentModeSelect.appendChild(option);
//       return;
//     }
//     // Fetch and populate Room Number/Name options based on selected Room Type
//     try {
//       const response = await fetch(`/bookings/paymentmodes`);
//       const paymentModes = await response.json();
//       console.log(paymentModes)
//       // Populate Room Number/Name dropdown
//       paymentModeSelect.innerHTML = '<option value="">Select..</option>';

//       paymentModes.data.forEach(paymentMode => {
//         const option = document.createElement('option');
//         option.value = paymentMode.mode;
//         option.textContent = paymentMode.mode;
//         paymentModeSelect.appendChild(option);
//       });

//       // Enable the Room Number/Name dropdown
//       paymentModeSelect.disabled = false;
//     } catch (error) {
//       console.error('Error fetching rooms:', error);
//       paymentModeSelect.disabled = true;
//       paymentModeSelect.innerHTML = '<option value="">Error loading payment modes</option>';
//     }

// });
// })



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
        const errorMessage = 'Please select valid check-in and check-out dates';
        if (alertSpan) alertSpan.textContent = errorMessage; // Display the error message
        submitBtn.setAttribute('disabled', 'true'); // Disable the submit button
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