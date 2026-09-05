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
    let categoryname = req.body.category_name;
    let description = req.body.description;
    let image = req.body.image;
    
    let strquery = `INSERT INTO tbl_category (category_name, description, image) VALUES(?,?,?)`;
    con.query(strquery, [categoryname, description, image]);
    res.send({message: 'Success'});
});

module.exports = router;