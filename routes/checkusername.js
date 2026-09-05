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
    let username = req.body.username;

    if (!username) {
        res.status(400).send({ error: 'Username is required' });
        return;
    }

    let sql = "SELECT * FROM tbl_login WHERE username = ?";

    con.query(sql, [username], function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }

        if (result.length > 0) {
            res.send({ available: false, message: 'Username is already taken' });
        } else {
            res.send({ available: true, message: 'Username is available' });
        }
    });
});

module.exports = router;
