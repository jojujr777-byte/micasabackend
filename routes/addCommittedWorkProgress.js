var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

// Add committed work progress
router.post('/', function(req, res, next) {
    let committedwork_id = req.body.committedwork_id;
    let details = req.body.details;
    let image = req.body.image;
    let date = req.body.date;
    
    let strquery = `INSERT INTO tbl_committedworkprograss (committedwork_id, details, image, date) VALUES(?,?,?,?)`;
    con.query(strquery, [committedwork_id, details, image, date], function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        res.send({message: 'Success'});
    });
});

// View progress by committedwork_id
router.post('/view', function(req, res, next) {
    let committedwork_id = req.body.committedwork_id;
    
    let strquery = `SELECT * FROM tbl_committedworkprograss WHERE committedwork_id = ? ORDER BY date DESC`;
    con.query(strquery, [committedwork_id], function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        res.send(result);
    });
});

// View all progress
router.get('/viewall', function(req, res, next) {
    let strquery = `SELECT * FROM tbl_committedworkprograss ORDER BY date DESC`;
    con.query(strquery, function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        res.send(result);
    });
});

// Get progress by id
router.post('/getbyid', function(req, res, next) {
    let prograss_id = req.body.prograss_id;
    
    let strquery = `SELECT * FROM tbl_committedworkprograss WHERE prograss_id = ?`;
    con.query(strquery, [prograss_id], function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        res.send(result);
    });
});

module.exports = router;