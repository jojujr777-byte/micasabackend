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
router.post('/', function(req, res, next) {
 
  let username=req.body.username;
  let password=req.body.password;
  
  let sql=`select * from tbl_login where username='${username}' and password='${password}'`;
    con.query(sql,function(err,result){
        if(err) console.log(err);
        res.send(result);
    });
});

module.exports = router;
