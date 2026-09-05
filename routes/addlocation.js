var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

/* POST register location */
router.post('/', function(req, res, next) {
   
    let districtId = req.body.district_id;
     let locationName = req.body.location_name;

    let sql = `insert into tbl_location (district_id, location_name) values (?, ?);`;
    console.log('Values:', [districtId, locationName]);
    
    con.query(sql, [districtId, locationName]);
   res.send({message: 'Success'});
});

module.exports = router;