var express = require('express');
var router = express.Router();
var mysql = require('mysql2');

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// GET /admindashboard — returns all stats + lists for the admin dashboard
router.get('/', function (req, res, next) {

    // 1. Total accepted designers (login status = 'accepted')
    const totalDesigners = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_designer d
             INNER JOIN tbl_login l ON d.login_id = l.login_id
             WHERE l.status = 'accepted'`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 2. Pending designer approvals (login status = 'registered' = waiting)
    const pendingDesigners = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_designer d
             INNER JOIN tbl_login l ON d.login_id = l.login_id
             WHERE l.status = 'registered'`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 3. Total customers
    const totalCustomers = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_customer`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 4. Total posts
    const totalPosts = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_post`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 5. Total committed works
    const totalCommittedWork = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_commitedwork`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 6. Total categories
    const totalCategories = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_category`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 7. Total locations
    const totalLocations = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_location`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 8. Accepted design requests
    const acceptedRequests = new Promise((resolve, reject) => {
        con.query(
            `SELECT COUNT(*) as total FROM tbl_postreplay WHERE status = 'accepted'`,
            (err, result) => err ? reject(err) : resolve(result[0].total)
        );
    });

    // 9. Recent 5 designer registrations (newest first)
    const recentDesigners = new Promise((resolve, reject) => {
        con.query(
            `SELECT d.designer_id, d.designer_name, d.designer_email, d.designer_contact, l.status as designer_status
             FROM tbl_designer d
             INNER JOIN tbl_login l ON d.login_id = l.login_id
             ORDER BY d.designer_id DESC
             LIMIT 5`,
            (err, result) => err ? reject(err) : resolve(result)
        );
    });

    // 10. Top 5 designers by committed work count
    const topDesigners = new Promise((resolve, reject) => {
        con.query(
            `SELECT d.designer_name, COUNT(cw.commitedwork_id) as work_count
             FROM tbl_designer d
             LEFT JOIN tbl_postreplay pr ON d.designer_id = pr.designer_id
             LEFT JOIN tbl_commitedwork cw ON pr.postreplay_id = cw.postreplay_id
             GROUP BY d.designer_id, d.designer_name
             HAVING work_count > 0
             ORDER BY work_count DESC
             LIMIT 5`,
            (err, result) => err ? reject(err) : resolve(result)
        );
    });

    Promise.all([
        totalDesigners,
        pendingDesigners,
        totalCustomers,
        totalPosts,
        totalCommittedWork,
        totalCategories,
        totalLocations,
        acceptedRequests,
        recentDesigners,
        topDesigners
    ]).then(([
        designers,
        pendingCount,
        customers,
        posts,
        committedWork,
        categories,
        locations,
        accepted,
        recentList,
        topList
    ]) => {
        res.send({
            stats: {
                totalDesigners: designers,
                pendingDesigners: pendingCount,
                totalCustomers: customers,
                totalPosts: posts,
                totalCommittedWork: committedWork,
                totalCategories: categories,
                totalLocations: locations,
                acceptedRequests: accepted
            },
            recentDesigners: recentList,
            topDesigners: topList
        });
    }).catch(err => {
        console.log('Dashboard error:', err);
        res.status(500).send({ message: 'Failed', error: err.message });
    });
});

module.exports = router;
