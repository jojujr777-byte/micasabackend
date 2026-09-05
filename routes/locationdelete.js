var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

/* POST delete location */
router.post('/', function(req, res, next) {
    var id = req.body.locationid;
    
    let sql = `delete from tbl_location where location_id='${id}'`;
    console.log(sql);
    
    con.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send({message: 'Error'});
            return;
        }
        res.send({message: 'Success'});
    });
});

module.exports = router;
