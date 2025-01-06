$('.show-hide').show();
$('.show-hide span').addClass('show');

$('.show-hide span').on('click', function () {
    if ($(this).hasClass('show')) {
        $('input[name="password"]').attr('type', 'text');
        $(this).removeClass('show');
    } else {
        $('input[name="password"]').attr('type', 'password');
        $(this).addClass('show');
    }
});
$('form button[type="submit"]').on('click', function () {
    $('.show-hide span').addClass('show');
    $('.show-hide').parent().find('input[name="password"]').attr('type', 'password');
});


$('.show-hide-confirm').show();
$('.show-hide-confirm span').addClass('show');

$('.show-hide-confirm span').on('click', function () {
    if ($(this).hasClass('show')) {
        $('input[name="confirm_password"]').attr('type', 'text');
        $(this).removeClass('show');
    } else {
        $('input[name="confirm_password"]').attr('type', 'password');
        $(this).addClass('show');
    }
});
$('form button[type="submit"]').on('click', function () {
    $('.show-hide-confirm span').addClass('show');
    $('.show-hide').parent().find('input[name="confirm_password"]').attr('type', 'confirm_password');
});

$('.confirmPassword').on('change', function () {
// document.getElementsByClassName('password').addEventListener('change', function (event) {
    const password = $('.password').val();
    const confirmPassword = $('.confirmPassword').val();
    const errorMessage = $('.passwordError');
    const submitButton = $('.btn-primary');
    
    // Initially disable the button
    submitButton.prop('disabled', true);

    if (password === confirmPassword && password !== '') {
        errorMessage.text('').hide(); // Clear error and hide
        submitButton.prop('disabled', false); // Enable button

    } else {
        errorMessage.text('Passwords do not match.').show(); // Show error
        submitButton.prop('disabled', true); // Disable button
    }
});