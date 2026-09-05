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
    let designerid = req.body.designer_id;
    let categoryid = req.body.category_id;
    let workimage = req.body.work_image;
    let description = req.body.description;
    let postdate = new Date();
    
    let strquery = `INSERT INTO tbl_previouswork (designer_id, category_id, work_image, description, post_date) VALUES(?,?,?,?,?)`;
    con.query(strquery, [designerid, categoryid, workimage, description, postdate], function(err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({error: 'Database error'});
            return;
        }
        res.send({message: 'Success'});
    });
});

module.exports = router;