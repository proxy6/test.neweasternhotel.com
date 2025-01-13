document.addEventListener('DOMContentLoaded', () => {
  const roomSelector = document.getElementById('roomSelector');
  const roomIdInput = document.getElementById('roomIdInput');
  
  roomSelector.addEventListener('change', (event) => {
      // Get the selected option's data-room-id attribute
      const selectedOption = event.target.selectedOptions[0];
      const roomId = selectedOption.getAttribute('data-room-id');
      
      // Set the hidden input's value
      roomIdInput.value = roomId;
  });
});
