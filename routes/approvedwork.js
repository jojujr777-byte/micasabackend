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
    let designer_id = req.body.designer_id;
    let sql = `select tpr.postreplay_id, tpr.replay, tpr.amount, tpr.replay_date as created_date, tpr.status, c.customer_code as customercode 
               from tbl_postreplay tpr 
               inner join tbl_post p on tpr.post_id = p.post_id 
               inner join tbl_customer c on p.user_id = c.login_id 
               where tpr.designer_id = '${designer_id}' and lower(tpr.status) = 'accepted'
               order by tpr.replay_date desc`;
    console.log(sql);
    con.query(sql, function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        res.send(result);
    });
});

module.exports = router;