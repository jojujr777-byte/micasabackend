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
    const {
        // tbl_post fields
        customer_login_id,
        category_id,
        post_description,
        address,
        location_id,
        plandoc,
        // designer
        designer_id,
        // tbl_commitedwork fields
        customercode,
        work_type,
        start_date,
        end_date,
        work_description,
        workamount
    } = req.body;

    if (!customer_login_id || !designer_id || !customercode) {
        return res.status(400).send({ message: 'Failed', error: 'Customer, designer and customer code are required' });
    }

    const post_date = new Date();

    // Step 1: Insert into tbl_post
    const postQuery = `INSERT INTO tbl_post (user_id, category_id, description, post_date, address, location_id, plandoc, status)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    con.query(postQuery, [
        customer_login_id,
        category_id || null,
        post_description || '',
        post_date,
        address || '',
        location_id || null,
        plandoc || null,
        'Accepted'
    ], function (err, postResult) {
        if (err) {
            console.error('Error inserting post:', err);
            return res.status(500).send({ message: 'Failed', error: 'Post insert error: ' + err.message });
        }

        const post_id = postResult.insertId;

        // Step 2: Insert into tbl_postreplay
        const replayQuery = `INSERT INTO tbl_postreplay (post_id, designer_id, replay, replay_date, amount, status)
                             VALUES (?, ?, ?, ?, ?, ?)`;

        con.query(replayQuery, [
            post_id,
            designer_id,
            'Offline work registered by designer',
            post_date,
            workamount || 0,
            'Accepted'
        ], function (err, replayResult) {
            if (err) {
                console.error('Error inserting postreplay:', err);
                return res.status(500).send({ message: 'Failed', error: 'Proposal insert error: ' + err.message });
            }

            const postreplay_id = replayResult.insertId;

            // Step 3: Insert into tbl_commitedwork
            const workQuery = `INSERT INTO tbl_commitedwork (postreplay_id, customercode, type, workamount, start_date, end_date, detail_image, status)
                               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

            con.query(workQuery, [
                postreplay_id,
                customercode,
                work_type || 'Offline',
                workamount || 0,
                start_date && start_date.trim() !== '' ? start_date : null,
                end_date && end_date.trim() !== '' ? end_date : null,
                plandoc || null,
                'Pending'
            ], function (err, workResult) {
                if (err) {
                    console.error('Error inserting committedwork:', err);
                    return res.status(500).send({ message: 'Failed', error: 'Work insert error: ' + err.message });
                }

                res.send({
                    message: 'Success',
                    post_id: post_id,
                    postreplay_id: postreplay_id,
                    committedwork_id: workResult.insertId
                });
            });
        });
    });
});

module.exports = router;
