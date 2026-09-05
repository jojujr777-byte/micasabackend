var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

router.post('/', function (req, res, next) {
    let login_id = req.body.login_id;
    let newPassword = req.body.new_password;

    // Access the shared otpStore from sendotp module to clean up
    const otpStore = require('./sendotp').otpStore;

    let sql = `UPDATE tbl_login SET password = ? WHERE login_id = ?`;

    con.query(sql, [newPassword, login_id], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }

        if (result.affectedRows > 0) {
            // Clean up any stored OTPs for this user
            Object.keys(otpStore).forEach(key => {
                if (otpStore[key].login_id == login_id) {
                    delete otpStore[key];
                }
            });
            res.send({ success: true, message: 'Password updated successfully' });
        } else {
            res.send({ success: false, message: 'Account not found' });
        }
    });
});

module.exports = router;
