var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

// GET endpoint to retrieve designer work statistics
router.get('/', function (req, res, next) {
    // SQL query to get designers with their committed work count
    let strquery = `SELECT d.designer_id, d.designer_name, COUNT(cw.commitedwork_id) as work_count
                    FROM tbl_designer d
                    INNER JOIN tbl_login l ON d.login_id = l.login_id AND l.status = 'accepted'
                    LEFT JOIN tbl_postreplay pr ON d.login_id = pr.designer_id
                    LEFT JOIN tbl_commitedwork cw ON pr.postreplay_id = cw.postreplay_id
                    GROUP BY d.designer_id, d.designer_name
                    ORDER BY work_count DESC`;

    con.query(strquery, function (err, result) {
        if (err) {
            console.log('Database error:', err);
            return res.status(500).send({
                message: 'Failed',
                error: 'Database error: ' + err.message
            });
        }
        res.send(result);
        console.log(result);
    });
});

module.exports = router;
