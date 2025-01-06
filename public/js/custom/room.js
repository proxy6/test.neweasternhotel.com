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
                _token: '6Fu0mPnkf8AM2Gh7CQVlLI7TTaEuhxtdWXs9IhLp',
            },
            success: function(data) {
                clickedToggle.prop('checked', status);
                toastr.success("Status Updated Successfully");
            },
            error: function(xhr, status, error) {
                console.log(error)
            }
        });
    });




});
