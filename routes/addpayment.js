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
    let committedwork_id = req.body.committedwork_id;
    let amount = parseFloat(req.body.amount);
    let paymentdate = req.body.paymentdate;

    let query = `select * from tbl_payment where committedwork_id='${committedwork_id}'`;
    con.query(query, (err, result1) => {
        if (result1.length == 0) {
            let strquery = `INSERT INTO tbl_payment (committedwork_id, amount, paymentdate) 
                    VALUES (?, ?, ?)`;

            con.query(strquery, [committedwork_id, amount, paymentdate], function (err, result) {
                if (err) {
                    console.log('Database error:', err);
                    return res.status(500).send({
                        message: 'Failed',
                        error: 'Database error: ' + err.message
                    });
                }

                let payment_id = result.insertId;


                let updateQuery = `UPDATE tbl_commitedwork SET workamount = workamount - ?,status='Paid' WHERE commitedwork_id = ?`;

                con.query(updateQuery, [amount, committedwork_id], function (err, result) {
                    if (err) {
                        console.log('Database error updating balance:', err);
                        return res.status(500).send({
                            message: 'Payment recorded but failed to update balance',
                            error: 'Database error: ' + err.message
                        });
                    }


                    let balanceQuery = `SELECT workamount FROM tbl_commitedwork WHERE commitedwork_id = ?`;
                    con.query(balanceQuery, [committedwork_id], function (err, rows) {
                        if (err) {
                            console.log('Database error fetching balance:', err);
                            return res.status(500).send({
                                message: 'Payment recorded, balance updated, but failed to fetch new balance',
                                error: 'Database error: ' + err.message
                            });
                        }

                        if (rows.length > 0) {
                            res.send({
                                message: 'Success',
                                payment_id: payment_id,
                                remaining_balance: rows[0].workamount
                            });
                        } else {
                            res.send({
                                message: 'Success',
                                payment_id: payment_id,
                                remaining_balance: null
                            });
                        }
                    });
                });
            });
        }
        else {
            let pamount = result1[0].amount;
            let totalamount = pamount + amount;
            let payment_id = result1[0].payment_id;
            let strquery = `update tbl_payment set amount='${totalamount}' where payment_id='${payment_id}'`;

            con.query(strquery, function (err, result) {
                if (err) {
                    console.log('Database error:', err);
                    return res.status(500).send({
                        message: 'Failed',
                        error: 'Database error: ' + err.message
                    });
                }

                let updateQuery = `UPDATE tbl_commitedwork SET status='Fully Paid' WHERE commitedwork_id = ?`;

                con.query(updateQuery, [committedwork_id], function (err, result) {
                    if (err) {
                        console.log('Database error updating balance:', err);
                        return res.status(500).send({
                            message: 'Payment recorded but failed to update balance',
                            error: 'Database error: ' + err.message
                        });
                    }
                    res.send({
                        message: 'Success',
                        payment_id: payment_id,
                        remaining_balance: null
                    }); 
                });
            });
        }
    })
});

module.exports = router;