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
    let workid = req.body.work_id;
    let sql = `SELECT tbl_previouswork.*, tbl_category.category_name FROM tbl_previouswork INNER JOIN tbl_category ON tbl_previouswork.category_id = tbl_category.category_id WHERE tbl_previouswork.work_id = '${workid}'`;
    console.log(sql);
    con.query(sql, function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        else
        {
            res.send(result);
        }
    });
});

module.exports = router;