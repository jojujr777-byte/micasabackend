var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

router.post('/', function (req, res, next) {
    let post_id = req.body.post_id;
    console.log(post_id);
    // Add cw.workamount to the SELECT
    let strquery = `SELECT pr.*, d.designer_name, cw.commitedwork_id, cw.workamount,cw.status as workstatus
                FROM tbl_postreplay pr 
                LEFT JOIN tbl_designer d ON pr.designer_id = d.login_id 
                LEFT JOIN tbl_commitedwork cw ON pr.postreplay_id = cw.postreplay_id
                WHERE pr.post_id = ?
                ORDER BY pr.replay_date DESC`;
    console.log(strquery, [post_id]);
    con.query(strquery, [post_id], function (err, result) {
        if (err) {
            console.log(err);
            res.send([]);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;