$(document).ready(function() {
    $('#country').change(function() {
        // var countryIso2 = $(this).val();
        var countryIso2 = $(this).find('option:selected').data('country-iso2'); // Get the selected country name
        console.log(countryIso2)
        $.ajax({
            url: '/states',
            method: 'POST',
            data: { iso2: countryIso2 },
            success: function(response) {
                var states = response;
                
                var stateSelect = $('#state');
                stateSelect.empty().append('<option value="">Select an Option</option>'); // Clear previous options
                $.each(states, function(index, state) {
                    console.log(state)
                    stateSelect.append($('<option>', {
                        value: state.name,
                        text: state.name
                    }));
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching states:', error);
            }
        });
    });

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
