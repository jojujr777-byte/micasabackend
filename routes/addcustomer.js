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

    let customername = req.body.customer_name;
    let customeremail = req.body.customer_email;
    let customercontact = req.body.customer_contact;
    let districtid = req.body.district_id;
    let locationid = req.body.location_id;
    let username = req.body.username;
    let password = req.body.password;
    let registerdate = new Date();

    let q2 = `select * from tbl_login where username='${username}' and password='${password}'`;
    con.query(q2, (err, rows) => {
        if (err) throw err;

        if (rows.length > 0) {
            res.send({ message: "Username and password already exist" });
            return;
        } else {

            let q3 = `select * from tbl_customer where customer_email='${customeremail}'`;
            con.query(q3, (err, rows) => {
                if (err) throw err;

                if (rows.length > 0) {
                    res.send({ message: "Customer email already exist" });
                    return;
                } else {

                    let getMaxCode = "SELECT MAX(CAST(customer_code AS UNSIGNED)) as maxcode FROM tbl_customer";
                    con.query(getMaxCode, (err, codeResult) => {
                        if (err) throw err;

                        let nextNumber = 101;
                        if (codeResult[0].maxcode) {
                            nextNumber = codeResult[0].maxcode + 1;
                        }

                        let customercode = nextNumber.toString();

                        let q1 = "insert into tbl_login (username,password,role,status) values(?,?,?,?)";
                        con.query(q1, [username, password, "customer", "registered"], (err, result) => {
                            if (err) throw err;

                            let loginid = result.insertId;

                            let sql = "insert into tbl_customer (customer_code,customer_name,customer_email,customer_contact,location_id,login_id,register_date) values(?,?,?,?,?,?,?)";
                            con.query(sql, [customercode, customername, customeremail, customercontact, locationid, loginid, registerdate], (err, customerResult) => {
                                if (err) throw err;

                                res.send({
                                    message: "success",
                                    customer_id: customerResult.insertId,
                                    customercode: customercode,
                                    login_id: loginid
                                });

                                const mailOptions = {
                                    from: "jojujr777@gmail.com",
                                    to: customeremail,
                                    subject: "Micasa",
                                    html: "Thank you for registering micasa: You are Choosing the best option"
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
                                        console.log(err);
                                    } else {
                                        console.log(info);
                                    }
                                });
                            });
                        });
                    });
                }
            });
        }
    });
});

module.exports = router;
