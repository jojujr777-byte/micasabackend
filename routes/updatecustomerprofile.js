var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});

router.put('/', function (req, res, next) {
    let { login_id, customer_name, customer_email, customer_contact, location_id } = req.body;

    let updateFields = [];
    let values = [];

    if (customer_name) {
        updateFields.push('customer_name = ?');
        values.push(customer_name);
    }
    if (customer_email) {
        updateFields.push('customer_email = ?');
        values.push(customer_email);
    }
    if (customer_contact) {
        updateFields.push('customer_contact = ?');
        values.push(customer_contact);
    }
    if (location_id) {
        updateFields.push('location_id = ?');
        values.push(location_id);
    }

    if (updateFields.length === 0) {
        res.status(400).send({ error: 'No fields to update' });
        return;
    }

    values.push(login_id);

    let sql = `UPDATE tbl_customer SET ${updateFields.join(', ')} WHERE login_id = ?`;

    con.query(sql, values, function (err, result) {
        if (err) {
            console.log('Database error:', err);
            res.status(500).send({ error: 'Database error' });
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send({ error: 'Customer not found' });
            return;
        }

        res.send({ message: 'Profile updated successfully' });
    });
});

module.exports = router;
