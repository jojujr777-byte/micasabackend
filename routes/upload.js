var express = require('express');
var router = express.Router();
const util = require("util");
const multer = require("multer");
const path = require("path");
var mysql = require('mysql2');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "micasa"
});
let storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, __basedir + "/public/images"); },
    filename: (req, file, cb) => {
        console.log(file.originalname); cb(null,
            file.originalname);
    },
});
let uploadFile = multer({ storage: storage, }).single("file");

// Create a proper route handler
router.post('/', (req, res) => {
    uploadFile(req, res, (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(500).json({
                message: "File upload failed",
                error: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "No file provided"
            });
        }

        console.log('File uploaded successfully:', req.file.originalname);
        return res.status(200).json({
            message: "File uploaded successfully",
            filename: req.file.originalname
        });
    });
});

module.exports = router;