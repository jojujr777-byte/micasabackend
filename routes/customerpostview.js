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
    let user_id = req.body.user_id;

    let sql = `SELECT p.*, cat.category_name, l.location_name, d.district_name
               FROM tbl_post p
               JOIN tbl_category cat ON p.category_id = cat.category_id
               JOIN tbl_location l ON p.location_id = l.location_id
               JOIN tbl_district d ON l.district_id = d.district_id
               WHERE p.user_id = ? ORDER BY p.post_date DESC`;

    con.query(sql, [user_id], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.send([]);
            return;
        }
        res.send(result);
    });
});

module.exports = router;
