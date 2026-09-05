var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

/* GET location by ID for editing */
router.post('/', function(req, res, next) {
    var id = req.body.id;
    
    console.log('Request body:', req.body);
    
    if (!id) {
        res.status(400).send({message: 'Location ID is required'});
        return;
    }
    
    let sql = `select * from tbl_location l 
               inner join tbl_district d on l.district_id = d.district_id 
               where l.location_id = '${id}'`;
    console.log('SQL Query:', sql);
   
    con.query(sql, function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({message: 'Error'});
            return;
        }
        console.log('Select result:', result);
        res.send(result);
    });
});

module.exports = router;
