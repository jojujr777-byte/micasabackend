var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});


router.get('/', function (req, res, next) {
    let sql = `
        SELECT 
            p.post_id,
            p.user_id,
            p.category_id,
            p.description,
            p.address,
            p.location_id,
            p.plandoc,
            p.post_date,
            p.status,
            c.customer_name,
            cat.category_name,
            l.location_name,
            l.district_id,
            d.district_name
        FROM tbl_post p
        INNER JOIN tbl_login u ON p.user_id = u.login_id
        INNER JOIN tbl_customer c ON u.login_id = c.login_id
        INNER JOIN tbl_category cat ON p.category_id = cat.category_id
        INNER JOIN tbl_location l ON p.location_id = l.location_id
        INNER JOIN tbl_district d ON l.district_id = d.district_id
        LEFT JOIN tbl_postreplay pr ON p.post_id = pr.post_id AND pr.status = 'accepted'
        WHERE p.status = 'Pending' AND pr.postreplay_id IS NULL
        ORDER BY p.post_date DESC
    `;

    con.query(sql, function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }
        console.log('POST VIEW: Returning', result.length, 'available posts (committed posts excluded)');
        res.send(result);
    });
});

module.exports = router;
