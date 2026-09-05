var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) {
    let email = req.body.email;
    let otp = req.body.otp;

    // Access the shared otpStore from sendotp module
    const otpStore = require('./sendotp').otpStore;

    if (!otpStore[email]) {
        res.send({ success: false, message: 'OTP expired or not requested. Please resend.' });
        return;
    }

    let storedData = otpStore[email];

    // Check if OTP is expired (5 minutes = 300000 ms)
    if (Date.now() - storedData.timestamp > 300000) {
        delete otpStore[email];
        res.send({ success: false, message: 'OTP has expired. Please resend.' });
        return;
    }

    // Verify OTP
    if (storedData.otp !== otp) {
        res.send({ success: false, message: 'Invalid OTP. Please try again.' });
        return;
    }

    // OTP is valid - send back username for display
    res.send({
        success: true,
        message: 'OTP verified successfully',
        username: storedData.username,
        login_id: storedData.login_id
    });
});

module.exports = router;
