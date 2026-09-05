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
    let designer_id = req.body.designer_id;

    if (!designer_id) {
        return res.status(400).send({
            message: 'Failed',
            error: 'Designer ID is required'
        });
    }

    let strquery = `SELECT cw.commitedwork_id, cw.postreplay_id, cw.customercode, cw.type, cw.start_date, cw.end_date, cw.description, cw.detail_image, cw.workamount, pr.replay, pr.amount, pr.status, pr.replay_date, d.designer_id, d.designer_name, p.post_id, p.description as post_description, p.address, p.plandoc, c.customer_id, c.customer_name, c.customer_code, c.customer_email, c.customer_contact, l.location_name 
FROM tbl_commitedwork cw INNER JOIN tbl_postreplay pr ON cw.postreplay_id = pr.postreplay_id INNER JOIN tbl_designer d ON pr.designer_id = d.login_id INNER JOIN tbl_post p ON pr.post_id = p.post_id INNER JOIN tbl_customer c ON c.customer_code = cw.customercode LEFT JOIN tbl_location l ON c.location_id = l.location_id 
WHERE pr.designer_id = ? ORDER BY cw.commitedwork_id DESC`;

    con.query(strquery, [designer_id], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            return res.status(500).send({
                message: 'Failed',
                error: 'Database error: ' + err.message
            });
        }
        res.send(result);
    });
});

module.exports = router;