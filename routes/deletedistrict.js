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
 
  var id=req.body.district_id;
  
  let sql=`delete from tbl_district where district_id ='${id}'`;
  console.log(sql);
    con.query(sql,function(err,result){
        if(err) {
            console.log(err);
            res.status(500).send({message:'Error'});
            return;
        }
        res.send({message:'Success'});
    });
});

module.exports = router;
