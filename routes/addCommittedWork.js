var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

// POST endpoint to add committed work
router.post('/', function (req, res, next) {
    let postreply_id = req.body.postreply_id;
    let customercode = req.body.customercode;
    let type = req.body.type;
    let start_date = req.body.start_date;
    let end_date = req.body.end_date;
    let description = req.body.description;
    let detail_image = req.body.detail_image;
    let workamount = req.body.workamount;

    // Validate required fields
    if (!customercode) {
        return res.status(400).send({
            message: 'Failed',
            error: 'Customer code is required'
        });
    }

    // Only insert columns that are always available to avoid NOT NULL errors
    let strquery = `INSERT INTO tbl_commitedwork 
                    (postreplay_id, customercode, type, workamount, status) 
                    VALUES (?, ?, ?, ?, ?)`;

    con.query(strquery, [
        postreply_id,
        customercode,
        type || 'New',
        workamount || 0,
        'Pending'
    ], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            return res.status(500).send({
                message: 'Failed',
                error: 'Database error: ' + err.message
            });
        }
        res.send({
            message: 'Success',
            committedwork_id: result.insertId
        });
    });
});

module.exports = router;
