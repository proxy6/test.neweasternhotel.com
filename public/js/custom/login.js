
document.addEventListener('DOMContentLoaded', function () {
    const resendButton = document.getElementById('resend-button');
    const countdownTimer = document.getElementById('countdown-timer');
    let countdown;
    let timerInterval;

    function updateCountdown() {
        const minutes = Math.floor(countdown / 60);
        const seconds = countdown % 60;
        countdownTimer.textContent = ` (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;

        if (countdown > 0) {
            countdown--;
        } else {
            clearInterval(timerInterval);
            resendButton.style.pointerEvents = 'auto'; // Enable button
            resendButton.style.color = ''; // Restore button color
            countdownTimer.textContent = ''; // Clear countdown timer text
        }
    }

    function startCountdown() {
        countdown = 180; // 3 minutes in seconds
        updateCountdown(); // Initialize timer display
        timerInterval = setInterval(updateCountdown, 1000); // Update countdown every second
        resendButton.style.pointerEvents = 'none'; // Disable button
        resendButton.style.color = 'gray'; // Change button color to indicate disabled state
    }

    resendButton.addEventListener('click', function (event) {
        event.preventDefault();
        
        // Add your resend OTP logic here, e.g., make an AJAX request to the server
        console.log('Resend OTP clicked');
        var email = $(this).data('email');
        $.ajax({
            url: `/resend-otp`,
            method: 'GET',
            contentType: 'application/json',
            // data: JSON.stringify({ email }),
            success: function(response) {
            },
            error: function(xhr, status, error) {
                console.error('Failed to delete article:', error);
            }
        });
        

        if (!timerInterval) { // Check if the countdown is not already running
            startCountdown(); // Start countdown only if not already started
        }
    });
});
