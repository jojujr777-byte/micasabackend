var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});


router.get('/', function (req, res, next) {
    let sql = `select * from tbl_designer i inner join tbl_login d on i.login_id=d.login_id where d.status='registered'`;

    console.log('=== DESIGNER VIEW DEBUG ===');
    console.log('Executing query:', sql);

    con.query(sql, function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }
        console.log('Query successful. Number of results:', result.length);
        console.log('Results:', JSON.stringify(result, null, 2));
        console.log('=== END DEBUG ===');
        res.send(result);
    });
});

module.exports = router;