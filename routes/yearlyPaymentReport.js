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
    let login_id = req.body.designer_id;  // frontend sends loginid from localStorage
    let month = req.body.month;
    let year = req.body.year;

    if (!login_id || !month || !year) {
        return res.status(400).send({
            message: 'Failed',
            error: 'designer_id (login_id), month and year are required'
        });
    }

    let qry = `SELECT
                p.payment_id,
                p.committedwork_id,
                p.amount AS payment_amount,
                p.paymentdate,
                cw.customercode,
                cw.type AS work_type,
                cw.workamount AS remaining_balance,
                c.customer_name,
                d.designer_name
               FROM tbl_payment p
               INNER JOIN tbl_commitedwork cw ON p.committedwork_id = cw.commitedwork_id
               INNER JOIN tbl_postreplay pr ON cw.postreplay_id = pr.postreplay_id
               INNER JOIN tbl_designer d ON pr.designer_id = d.login_id
               INNER JOIN tbl_post po ON pr.post_id = po.post_id
               INNER JOIN tbl_customer c ON po.user_id = c.login_id
               WHERE d.login_id = ?
                 AND MONTH(p.paymentdate) = ?
                 AND YEAR(p.paymentdate) = ?
               ORDER BY p.paymentdate DESC`;

    con.query(qry, [login_id, month, year], (err, rows) => {
        console.log(qry,[login_id,month,year]);
        if (err) {
            console.log('Database error:', err);
            return res.status(500).send({
                message: 'Failed',
                error: 'Database error: ' + err.message
            });
        }
        res.send(rows);
    });
});

module.exports = router;
