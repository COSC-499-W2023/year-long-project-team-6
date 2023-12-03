const express = require('express');
const router = express.Router();
const PostDao = require('../dao/PostDao');
const mysql = require('mysql');
require('dotenv').config({ path: "./process.env" });

const connection = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
});

connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});
const postDao = new PostDao(connection);


router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Login request received with data:", req.body);
    postDao.authenticateUser(email, password, (err, userExists) => {
        if (err) {
            console.error("Error during authentication:", err);
            res.status(500).send('Error during authentication');
        } else if (userExists) {
            console.log("Authentication result:", userExists);
            postDao.getUserByEmail(email, (err, user) => {
                if (err) {
                    console.log("Error fetching user data:", err.message);
                    res.status(500).send('Error fetching user data');
                } else {
                    console.log("successful fetching user data");
                    res.status(200).json({ success: true, user: user });
                }
            });
        } else {
            res.status(401).send('Invalid credentials');
        }
    });
});
router.post('/signup', (req, res) => {
    const { username, email, password, role, userImage } = req.body;
    // Check if username exists
    postDao.checkUsernameExists(username, (err, usernameExists) => {
        if (err) {
            console.error("Error checking username:", err);
            return res.status(500).json({ success: false, message: 'Error checking username' });
        }
        if (usernameExists) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }

        // Check if email exists
        postDao.checkEmailExists(email, (err, emailExists) => {
            if (err) {
                console.error("Error checking email:", err);
                return res.status(500).json({ success: false, message: 'Error checking email' });
            }
            if (emailExists) {
                return res.status(409).json({ success: false, message: 'Email already exists' });
            }

            // Proceed with registration if both checks pass
            postDao.signup(username, email, password, role, userImage, (err, results) => {
                if (err) {
                    console.error("Error during user registration:", err);
                    return res.status(500).json({ success: false, message: 'Error during user registration' });
                }
                return res.status(201).json({ success: true, message: 'User successfully registered' });
            });
        });
    });
});

module.exports = router;