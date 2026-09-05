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
    let committedwork_id = req.body.committedwork_id;

    let query = `SELECT * from tbl_payment where committedwork_id = '${committedwork_id}'`;
    console.log(query);
    con.query(query, function (err, result) {
        if (err) throw err;
        res.send(result);

    });
});

module.exports = router;