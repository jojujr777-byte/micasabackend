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
    let designer_name = req.body.designer_name;
    let designer_email = req.body.designer_email;
    let designer_contact = req.body.designer_contact;
    let location_id = req.body.location_id;
    let image = req.body.image;
    let idproof = req.body.idproof;

    // Build dynamic update query based on provided fields
    let updateFields = [];
    let values = [];

    if (designer_name) {
        updateFields.push('designer_name = ?');
        values.push(designer_name);
    }
    if (designer_email) {
        updateFields.push('designer_email = ?');
        values.push(designer_email);
    }
    if (designer_contact) {
        updateFields.push('designer_contact = ?');
        values.push(designer_contact);
    }
    if (location_id) {
        updateFields.push('location_id = ?');
        values.push(location_id);
    }
    if (image) {
        updateFields.push('image = ?');
        values.push(image);
    }
    if (idproof) {
        updateFields.push('idproof = ?');
        values.push(idproof);
    }

    if (updateFields.length === 0) {
        res.status(400).send({ error: 'No fields to update' });
        return;
    }

    values.push(login_id);

    let sql = `UPDATE tbl_designer SET ${updateFields.join(', ')} WHERE login_id = ?`;

    console.log('UPDATE DESIGNER PROFILE:', sql);

    con.query(sql, values, function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send({ error: 'Designer not found' });
            return;
        }

        console.log('DESIGNER PROFILE UPDATED: login_id', login_id);
        res.send({ message: 'Profile updated successfully' });
    });
});

module.exports = router;
