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
