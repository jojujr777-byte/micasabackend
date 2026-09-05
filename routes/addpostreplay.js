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
    let post_id = req.body.post_id;
    let designer_id = req.body.designer_id;
    let replay = req.body.replay;
    let amount = req.body.amount;
    let replay_date = new Date();

    // Validate required fields
    if (!replay || replay.trim() === '') {
        console.log('Validation error: replay is required');
        return res.status(400).send({ message: 'Failed', error: 'Proposal/replay text is required' });
    }

    if (!post_id || !designer_id) {
        console.log('Validation error: post_id and designer_id are required');
        return res.status(400).send({ message: 'Failed', error: 'Post ID and Designer ID are required' });
    }

    let strquery = `INSERT INTO tbl_postreplay (post_id, designer_id, replay, replay_date, amount, status) VALUES(?,?,?,?,?,?)`;

    con.query(strquery, [post_id, designer_id, replay, replay_date, amount, 'pending'], function (err, result) {
        if (err) {
            console.log('ERROR inserting post reply:', err);
            return res.status(500).send({ message: 'Failed', error: err.message });
        }
        console.log('Post reply inserted successfully. ID:', result.insertId);
        res.send({ message: 'Success', postreplay_id: result.insertId });
    });
});

module.exports = router;
