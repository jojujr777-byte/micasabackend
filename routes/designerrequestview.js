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
    console.log('Designer ID:', designer_id);
    
    // Get all proposals sent by this designer with post and customer details
    let strquery = `SELECT 
                        pr.postreplay_id,
                        pr.replay,
                        pr.amount,
                        pr.status,
                        pr.replay_date,
                        pr.post_id,
                        pr.designer_id,
                        p.description as post_description,
                        p.post_date,
                        p.address as post_address,
                        p.plandoc,
                        c.customer_name,
                        c.customer_email,
                        c.customer_contact,
                        c.customer_id,
                        cw.commitedwork_id,
                        cw.workamount,
                        cw.status as work_status
                    FROM tbl_postreplay pr
                    INNER JOIN tbl_post p ON pr.post_id = p.post_id
                    INNER JOIN tbl_customer c ON p.user_id = c.customer_id
                    LEFT JOIN tbl_commitedwork cw ON pr.postreplay_id = cw.postreplay_id
                    WHERE pr.designer_id = ?
                    ORDER BY pr.replay_date DESC`;
    
    console.log('Query:', strquery);
    console.log('Parameters:', [designer_id]);
    
    con.query(strquery, [designer_id], function (err, result) {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send({ error: 'Database error', details: err.message });
        } else {
            console.log('Results found:', result.length);
            res.send(result);
        }
    });
});

module.exports = router;
