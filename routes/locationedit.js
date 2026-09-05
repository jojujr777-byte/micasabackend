var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

/* POST edit location */
router.post('/', function(req, res, next) {
    var id = req.body.locationid;
    var locationName = req.body.location_name;
    var districtId = req.body.district_id;
    
    // console.log('Request body:', req.body);
    
    // if (!id) {
    //     res.status(400).send({message: 'Location ID is required'});
    //     return;
    // }
    let sql = `update tbl_location set location_name='${locationName}' where location_id='${id}'`;
    console.log('SQL Query:', sql);
   
    con.query(sql, function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({message: 'Error'});
            return;
        }
        console.log('Update result:', result);
        res.send({message: 'Success'});
    });
});

module.exports = router;
