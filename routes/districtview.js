var express = require('express');
var router = express.Router();

var mysql=require('mysql2');


var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"micasa"
});
/* GET users listing. */
router.get('/', function(req, res, next) {

  
  let sql=`select * from tbl_district`;
    con.query(sql,function(err,result){
        if(err) console.log(err);
        res.send(result);
    });
});

module.exports = router;
