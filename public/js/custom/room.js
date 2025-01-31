$(document).ready(function() {
    $('.toggle-status').change(function() {
        let status = $(this).prop('checked') ? 1 : 0;
        let url = $(this).data('route');
        let clickedToggle = $(this);
        $.ajax({
            type: "PUT",
            url: url,
            data: {
                status: status,
             
            },
            success: function(data) {
           
                if(data.status != true){
                    toastr.error(data.error);
                    setTimeout(() => {
                        location.reload(); // Reloads the current page
                    }, 1000); // 
                }else{
                clickedToggle.prop('checked', status);
                toastr.success("Status Updated Successfully");
                }
            },
            error: function(xhr, status, error) {
                console.log(error)
            }
        });
    });




});


$(document).ready(function () {
    $('.dropdown-item').click(function (event) {
        event.preventDefault(); // Prevent the default link action

        let url = $(this).attr('href'); // Get the update URL

        $.ajax({
            type: "PUT",
            url: url,
            data: {}, // You may include status if needed
            success: function (data) {
                if (data.status !== true) {
                    toastr.error(data.error);
                    setTimeout(() => {
                        location.reload(); // Reloads the page
                    }, 1000);
                } else {
                    toastr.success("Status Updated Successfully");
                    setTimeout(() => {
                        location.reload(); // Refresh after a short delay
                    }, 1000);
                }
            },
            error: function (xhr, status, error) {
                console.log(error);
                toastr.error("An error occurred. Please try again.");
            }
        });
    });
});

