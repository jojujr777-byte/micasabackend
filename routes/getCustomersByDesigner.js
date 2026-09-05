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
    let designerId = req.body.designer_id;
    console.log('getCustomersByDesigner - designer_id:', designerId);
    let sql = `SELECT DISTINCT c.customer_code, c.customer_name 
              FROM tbl_customer c
              INNER JOIN tbl_post p ON p.user_id = c.login_id
              INNER JOIN tbl_postreplay pr ON pr.post_id = p.post_id
              WHERE pr.designer_id = ? AND pr.status = 'accepted'`;
    console.log(sql);
    con.query(sql, [designerId], function (err, result) {
        console.log('Query result:', result);
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
