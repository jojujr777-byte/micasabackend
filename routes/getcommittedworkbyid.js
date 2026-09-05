var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

router.post('/', function(req, res, next) {
    let committedwork_id = req.body.committedwork_id;

    if (!committedwork_id) {
        return res.status(400).send({
            message: 'Failed',
            error: 'Committed work ID is required'
        });
    }

    let strquery = `SELECT cw.commitedwork_id, cw.postreplay_id, cw.customercode, cw.type, 
                    cw.start_date, cw.end_date, cw.description, cw.detail_image, cw.workamount,
                    pr.replay, pr.amount, pr.status, pr.replay_date, pr.designer_id,
                    p.post_id, p.description as post_description, p.address, p.plandoc
                    FROM tbl_commitedwork cw 
                    INNER JOIN tbl_postreplay pr ON cw.postreplay_id = pr.postreplay_id 
                    INNER JOIN tbl_post p ON pr.post_id = p.post_id
                    WHERE cw.commitedwork_id = ?`;

    con.query(strquery, [committedwork_id], function(err, result) {
        if (err) {
            console.log('Database error:', err);
            return res.status(500).send({
                message: 'Failed',
                error: 'Database error: ' + err.message
            });
        }
        
        if (result.length === 0) {
            return res.send({ workamount: 0 });
        }
        
        res.send(result[0]); // Return single record with workamount field
    });
});

module.exports = router;