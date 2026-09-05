var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// POST /admincommission — returns all payments with 2% admin commission
// Optional body params: year, month (both required together for filtering)
router.post('/', function (req, res, next) {
    let year = req.body.year;
    let month = req.body.month;

    let qry = `
        SELECT
            p.payment_id,
            p.committedwork_id,
            p.amount         AS payment_amount,
            p.paymentdate,
            cw.customercode,
            cw.type          AS work_type,
            c.customer_name,
            d.designer_name,
            ROUND(p.amount * 0.02, 2) AS commission
        FROM tbl_payment p
        INNER JOIN tbl_commitedwork cw ON p.committedwork_id = cw.commitedwork_id
        INNER JOIN tbl_postreplay  pr ON cw.postreplay_id = pr.postreplay_id
        INNER JOIN tbl_designer     d  ON pr.designer_id  = d.login_id
        INNER JOIN tbl_post         po ON pr.post_id      = po.post_id
        INNER JOIN tbl_customer     c  ON po.user_id      = c.login_id
    `;

    const params = [];
    if (year && month) {
        qry += ` WHERE YEAR(p.paymentdate) = ? AND MONTH(p.paymentdate) = ?`;
        params.push(year, month);
    } else if (year) {
        qry += ` WHERE YEAR(p.paymentdate) = ?`;
        params.push(year);
    }

    qry += ` ORDER BY p.paymentdate DESC`;

    con.query(qry, params, (err, rows) => {
        if (err) {
            console.log('Database error:', err);
            return res.status(500).send({ message: 'Failed', error: 'Database error: ' + err.message });
        }

        const totalCommission = rows.reduce((sum, r) => sum + parseFloat(r.commission), 0);
        res.send({
            payments: rows,
            totalCommission: Math.round(totalCommission * 100) / 100
        });
    });
});

module.exports = router;
