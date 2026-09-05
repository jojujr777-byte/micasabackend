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
    let postreplay_id = req.body.postreplay_id;
    
    let strquery = `UPDATE tbl_postreplay SET status = 'rejected' WHERE postreplay_id = ?`;
    con.query(strquery, [postreplay_id]);
    res.send({message: 'Success'});
});

module.exports = router;
