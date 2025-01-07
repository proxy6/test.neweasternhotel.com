
    // Get the current hour
    const now = new Date();
    const hour = now.getHours();

    // Determine the greeting
    let greeting = '';

    if (hour < 12) {
        greeting = 'Good Morning';
    } else if (hour < 18) {
        greeting = 'Good Afternoon';
    } else {
        greeting = 'Good Evening';
    }

    // Display the greeting
    if(typeof username  !== 'undefined'){
        document.getElementById('greeting').textContent = `${greeting} ${username}!`;
    }else{
    document.getElementById('greeting').textContent = `${greeting}!`;
    }
         // API Call to fetch advice
         async function getAdvice() {
            try {
                const response = await fetch('/quote');
                const data = await response.json();
              
                const quote = data[0].q;
                const author = data[0].a;
                // Display the advice in the paragraph
                document.getElementById('advice').textContent = quote;
            } catch (error) {
                console.error("Error fetching advice:", error);
                document.getElementById('advice').textContent = "Couldn't fetch advice. Please try again.";
            }
        }

        // Call the function when the page loads
        getAdvice();