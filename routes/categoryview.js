var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

/* GET categories listing */
router.get('/', function(req, res, next) {
    let sql = `select * from tbl_category`;
    
    con.query(sql, function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        res.send(result);
    });
});

module.exports = router;