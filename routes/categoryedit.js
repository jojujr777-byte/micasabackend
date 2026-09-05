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
    let lid = req.body.categoryid;
    let n = req.body.category_name;
    let d = req.body.description;
    let img = req.body.image;
    let sql = `UPDATE tbl_category SET category_name='${n}', description='${d}', image='${img}' WHERE category_id='${lid}'`;
    console.log(sql);
    con.query(sql, function(err, rows) {
        if(err) throw err;
        res.send({message: "Success"});
    });
});

module.exports = router;