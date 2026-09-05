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
    let user = req.body.user_id;
    let category = req.body.category_id;
    let description = req.body.description;
    let postdate = new Date();
    let address = req.body.address;
    let locationid = req.body.location_id;
    let plandoc = req.body.plandoc;
    
    let strquery = `INSERT INTO tbl_post (user_id,category_id,description,post_date,address,location_id,plandoc,status) VALUES(?,?,?,?,?,?,?,?)`;
    con.query(strquery, [user, category, description, postdate, address, locationid, plandoc, 'Pending']);
    res.send({message: 'Success'});
});

module.exports = router;