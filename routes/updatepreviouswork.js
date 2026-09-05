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
    let categoryid = req.body.category_id;
    let description = req.body.description;
    let workimage = req.body.work_image;
    
    let sql = `UPDATE tbl_previouswork SET category_id='${categoryid}', description='${description}', work_image='${workimage}' WHERE work_id='${workid}'`;
    console.log(sql);
    con.query(sql, function(err, result) {
        if(err) throw err;
        res.send({message: "Success"});
    });
});

module.exports = router;