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

router.post('/', function (req, res, next) {
    let postreplay_id = req.body.postreplay_id;
    let post_id = req.body.post_id;

    // First, get the customer email and postreplay amount by joining tables
    let emailQuery = `SELECT c.customer_email, c.customer_name, c.login_id as customercode, pr.amount 
                      FROM tbl_postreplay pr 
                      INNER JOIN tbl_post p ON pr.post_id = p.post_id 
                      INNER JOIN tbl_customer c ON p.user_id = c.login_id 
                      WHERE pr.postreplay_id = ?`;

    con.query(emailQuery, [postreplay_id], (err, emailResult) => {
        if (err) {
            console.log('Error fetching customer email:', err);
            return res.status(500).send({ message: 'Failed', error: 'Could not retrieve customer information' });
        }

        if (emailResult.length === 0) {
            console.log('No customer found for post replay:', postreplay_id);
            return res.status(404).send({ message: 'Failed', error: 'Customer not found' });
        }

        let customeremail = emailResult[0].customer_email;
        let customername = emailResult[0].customer_name;
        let customercode = emailResult[0].customercode;
        let workamount = emailResult[0].amount || 0;

        let strquery = `UPDATE tbl_postreplay SET status = 'accepted' WHERE postreplay_id = ?`;
        con.query(strquery, [postreplay_id], (err1) => {
            if (err1) {
                console.log('Error accepting request:', err1);
                return res.status(500).send({ message: 'Failed', error: 'Could not accept request' });
            }

            // Reject all other pending replies for the same post
            let sql = `UPDATE tbl_postreplay SET status='rejected' WHERE post_id=? AND status='pending' AND postreplay_id != ?`;
            con.query(sql, [post_id, postreplay_id], (err2) => {
                if (err2) {
                    console.log('Error rejecting other requests:', err2);
                    return res.status(500).send({ message: 'Failed', error: 'Could not reject other requests' });
                }

                // Create committed work record so Payment & View Progress buttons work
                let commitQuery = `INSERT INTO tbl_commitedwork (postreplay_id, customercode, workamount, status) VALUES (?, ?, ?, 'Pending')`;
                con.query(commitQuery, [postreplay_id, customercode, workamount], (err3, commitResult) => {
                    if (err3) {
                        console.log('Error creating committed work:', err3);
                        // Still send success since the accept itself worked
                    } else {
                        console.log('Committed work created with ID:', commitResult.insertId);
                    }

                    // Send success response
                    res.send({ message: 'Success' });

                    // Send email notification to customer
                    const mailOptions = {
                        from: "jojujr777@gmail.com",
                        to: customeremail,
                        subject: "Your Designer Request Has Been Accepted - Micasa",
                        html: `
                        <h2>Great News, ${customername}!</h2>
                        <p>A designer has accepted your request on Micasa.</p>
                        <p>You can now proceed with your interior design project.</p>
                        <p>Please log in to your account to view the details and next steps.</p>
                        <br>
                        <p>Thank you for choosing Micasa!</p>
                        <p>Best regards,<br>The Micasa Team</p>
                    `
                    };

                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        auth: {
                            user: "jojujr777@gmail.com",
                            pass: "kwbv ayuu ouqi tlno"
                        }
                    });

                    transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            console.log('Error sending email:', err);
                        } else {
                            console.log('Email sent successfully:', info.response);
                        }
                    });
                });
            });
        });
    });
});

module.exports = router;
