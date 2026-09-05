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
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;

    let qry = `SELECT 
                p.payment_id,
                p.committedwork_id,
                p.amount as payment_amount,
                p.paymentdate,
                cw.customercode,
                cw.type as work_type,
                cw.start_date,
                cw.end_date,
                cw.description as work_description,
                cw.workamount as remaining_balance,
                c.customer_name,
                c.customer_email,
                c.customer_contact,
                d.designer_name,
                d.designer_email
               FROM tbl_payment p
               INNER JOIN tbl_commitedwork cw ON p.committedwork_id = cw.commitedwork_id
               INNER JOIN tbl_postreplay pr ON cw.postreplay_id = pr.postreplay_id
               INNER JOIN tbl_designer d ON pr.designer_id = d.designer_id
               INNER JOIN tbl_post po ON pr.post_id = po.post_id
               INNER JOIN tbl_customer c ON po.user_id = c.login_id
               WHERE p.paymentdate >= ? AND p.paymentdate <= ?
               ORDER BY p.paymentdate DESC`;

    con.query(qry, [startdate, enddate], (err, row) => {
        if (err) {
            console.log('Database error:', err);
            return res.status(500).send({
                message: 'Failed',
                error: 'Database error: ' + err.message
            });
        }
        res.send(row);
    });
});

module.exports = router;
