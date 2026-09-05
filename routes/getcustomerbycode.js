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
    let customerCode = req.body.customer_code;
    let designer_id = req.body.designer_id;
    let sql = `SELECT tbl_customer.*, tbl_location.location_name, tbl_login.username 
              FROM tbl_customer 
              LEFT JOIN tbl_location ON tbl_customer.location_id = tbl_location.location_id
              LEFT JOIN tbl_login ON tbl_customer.login_id = tbl_login.login_id
              inner join tbl_post p on p.user_id=tbl_customer.login_id left join tbl_postreplay pr on p.post_id=pr.post_id
              WHERE tbl_customer.customer_code = ? and pr.designer_id=? and pr.status='accepted'`;
    console.log(sql, [customerCode, designer_id]);
    con.query(sql, [customerCode, designer_id], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }
        else {
            res.send(result);
        }
    });
});

module.exports = router;