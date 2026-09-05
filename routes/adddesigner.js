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
    let designername = req.body.designer_name;
    let designeremail = req.body.designer_email;
    let designercontact = req.body.designer_contact;
    let locationid = req.body.location_id;
    let image = req.body.image;
    let idproof = req.body.idproof;
    let username = req.body.username;
    let password = req.body.password;
    let designerregdate = new Date()

    let q2 = `select * from tbl_login where username='${username}' and password='${password}'`;
    con.query(q2, (err, rows) => {
        if (err) throw err;
        if (rows.length > 0) {
            res.send({ message: "Username and password already exist" });
            return;
        }
        else {
            let q3 = `select * from tbl_designer where designer_email='${designeremail}'`;
            con.query(q3, (err, rows) => {
                if (err) throw err;
                if (rows.length > 0) {
                    res.send({ message: "Designer email already exist" });
                    return;
                }
                else {
                    let q1 = "insert into tbl_login (username,password,role,status) values(?,?,?,?)";
                    con.query(q1, [username, password, "designer", "registered"], (err, result) => {
                        if (err) throw err;
                        let loginid = result.insertId

                        let sql = "insert into tbl_designer (designer_name,designer_email,designer_contact,image,location_id,designer_regdate,idproof,login_id) values(?,?,?,?,?,?,?,?)";
                        con.query(sql, [designername, designeremail, designercontact, image, locationid, designerregdate, idproof, loginid], (err, result) => {
                            if (err) throw err;
                            res.send({ message: "success" });
                            const mailOptions = {
                                from: "jojujr777@gmail.com",
                                to: designeremail,
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
                }
            });
        }
    });
});

module.exports = router;    