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

    let sql = `
        SELECT 
            c.customer_id,
            c.customer_code,
            c.customer_name,
            c.customer_email,
            c.customer_contact,
            c.location_id,
            c.register_date,
            l.location_name,
            l.district_id,
            di.district_name,
            lg.username,
            lg.status
        FROM tbl_customer c
        INNER JOIN tbl_login lg ON c.login_id = lg.login_id
        LEFT JOIN tbl_location l ON c.location_id = l.location_id
        LEFT JOIN tbl_district di ON l.district_id = di.district_id
        WHERE c.login_id = ?
    `;

    con.query(sql, [login_id], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }

        if (result.length === 0) {
            res.status(404).send({ error: 'Customer not found' });
            return;
        }

        res.send(result[0]);
    });
});

module.exports = router;
