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
    let loginid = req.body.loginid;
    let sql = `select tbl_previouswork.*, tbl_category.category_name from tbl_previouswork inner join tbl_category on tbl_previouswork.category_id = tbl_category.category_id where designer_id = '${loginid}'`;
    console.log(sql);
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