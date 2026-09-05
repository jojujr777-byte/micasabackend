var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
const nodemailer = require("nodemailer");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

// Store OTPs temporarily in memory (key: email, value: {otp, timestamp})
const otpStore = {};

router.post('/', function (req, res, next) {
    let email = req.body.email;

    // Check if email exists in tbl_customer or tbl_designer
    let sql = `SELECT tbl_login.login_id, tbl_login.username, 'customer' as type FROM tbl_login
               INNER JOIN tbl_customer ON tbl_login.login_id = tbl_customer.login_id
               WHERE tbl_customer.customer_email = ?
               UNION
               SELECT tbl_login.login_id, tbl_login.username, 'designer' as type FROM tbl_login
               INNER JOIN tbl_designer ON tbl_login.login_id = tbl_designer.login_id
               WHERE tbl_designer.designer_email = ?`;

    con.query(sql, [email, email], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ success: false, message: 'Database error' });
            return;
        }

        if (result.length === 0) {
            res.send({ success: false, message: 'No account found with this email' });
            return;
        }

        // Generate 6-digit OTP
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP with timestamp (expires in 5 minutes)
        otpStore[email] = {
            otp: otp,
            timestamp: Date.now(),
            login_id: result[0].login_id,
            username: result[0].username
        };

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "jojujr777@gmail.com",
                pass: "kwbv ayuu ouqi tlno"
            }
        });

        const mailOptions = {
            from: "jojujr777@gmail.com",
            to: email,
            subject: "Micasa - Password Reset OTP",
            html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4e54c8; text-align: center;">Micasa</h2>
                <p>Your OTP for password reset is:</p>
                <div style="background: #f5f7fa; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                    <h1 style="color: #4e54c8; letter-spacing: 8px; margin: 0;">${otp}</h1>
                </div>
                <p style="color: #666; font-size: 14px;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
            </div>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log('Email error:', err);
                res.send({ success: false, message: 'Failed to send OTP email' });
            } else {
                console.log('OTP sent:', info);
                res.send({ success: true, message: 'OTP sent to your email' });
            }
        });
    });
});

// Export both router and otpStore so verifyotp can access it
module.exports = router;
module.exports.otpStore = otpStore;
