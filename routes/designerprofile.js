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
    let login_id = req.body.login_id;

    let sql = `
        SELECT 
            d.designer_id,
            d.designer_name,
            d.designer_email,
            d.designer_contact,
            d.image,
            d.idproof,
            d.designer_regdate,
            d.location_id,
            l.location_name,
            l.district_id,
            di.district_name,
            lg.username,
            lg.status
        FROM tbl_designer d
        INNER JOIN tbl_login lg ON d.login_id = lg.login_id
        LEFT JOIN tbl_location l ON d.location_id = l.location_id
        LEFT JOIN tbl_district di ON l.district_id = di.district_id
        WHERE d.login_id = ?
    `;

    con.query(sql, [login_id], function (err, designerResult) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }

        if (designerResult.length === 0) {
            res.status(404).send({ error: 'Designer not found' });
            return;
        }

        console.log('DESIGNER PROFILE: Returning profile for login_id:', login_id);
        res.send(designerResult[0]);
    });
});

module.exports = router;
