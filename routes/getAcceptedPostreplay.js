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
    let customerId = req.body.customer_id;
    let designerId = req.body.designer_id;

    let params = [customerId];
    let designerFilter = '';

    if (designerId) {
        designerFilter = ' AND tbl_postreplay.designer_id = ?';
        params.push(designerId);
    }

    let sql = `SELECT tbl_postreplay.*, tbl_post.description, tbl_post.address, tbl_post.plandoc, 
                      tbl_designer.designer_name, cw.commitedwork_id, cw.workamount, cw.status as workstatus
              FROM tbl_postreplay 
              INNER JOIN tbl_post ON tbl_postreplay.post_id = tbl_post.post_id 
              INNER JOIN tbl_designer ON tbl_postreplay.designer_id = tbl_designer.login_id
              LEFT JOIN tbl_commitedwork cw ON tbl_postreplay.postreplay_id = cw.postreplay_id
              WHERE tbl_post.user_id = ? AND tbl_postreplay.status = 'accepted'${designerFilter}
              ORDER BY tbl_postreplay.replay_date DESC`;
    con.query(sql, params, function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }
        else {
            res.send(result);
        }
    });
});

module.exports = router;