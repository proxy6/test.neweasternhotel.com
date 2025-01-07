const express = require('express')
const router = express.Router()
const {signinPage,
    //  signup, getVerifySigninPage, verifySignin, 
//     getVerifyPage, verifyEmailOtp, resendSignupOtp, signIn, signOut,
//     completeSignIn,
//     getChangePassword,
//     getResetPasswordPage,
//     getVerifyResetPasswordnPage,
//     verifyPasswordReset,
//     getVerifyEmailPage,
//     verifyOtpPasswordReset,
    completePasswordReset,
    getForgetPasswordPage,
    getVerifyEmailPage,
    getVerifySigninPage,
    resendSignupOtp,
    resendOtp,
    signIn,
    verifySignin,
    completeSignIn,
    getChangePasswordPage,
    signOut,
    unauthorizedPage} = require('../controllers/auth.controller')
// // const { isVendor } = require('../middleware/authorization')
// // const {getAdminDash, getVendorPage, getStores} = require('../controller/dashboard.controller')

router.get('/unauthorized', unauthorizedPage)
router.get('/signin', signinPage )
router.post('/signin', signIn)
router.get('/password/reset', getForgetPasswordPage)
router.post('/complete-signin', completeSignIn)
router.get('/signin/verify', getVerifySigninPage)
router.post('/signin/verify', verifySignin)
// router.get('/verify-email', getVerifyEmailPage)
// router.post('/verify-reset', getVerifyResetPasswordnPage)
// router.get('/reset-password', getResetPasswordPage)
// router.post('/reset-password', verifyOtpPasswordReset)
// router.post('/complete-reset-password', completePasswordReset )
router.get('/resend-otp', resendOtp)
router.get('/change-password', getChangePasswordPage )
// // router.post('/signup', signup )
// // router.get('/signup/verify', getVerifySignupPage)
// // router.post('/signup/verify', verifySignup)
// router.get('/verify', getVerifyPage)
// router.post('/verify', verifyEmailOtp)
// router.get('/resend-otp', resendSignupOtp)
router.get('/signout', signOut)

module.exports = router