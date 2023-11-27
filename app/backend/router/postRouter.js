const express = require('express');
const { getUsernameAndPostDate } = require('../dao/displayDAO'); // Update the path to the actual location of your PostDao file

const router = express.Router();

// Endpoint to get username and post date based on user ID
router.get('/post-history/:user_id', (req, res) => {
    const userId = req.params;
    console.log(userId)
    getUsernameAndPostDate(userId, (err, results) => {
        if (err) {
            console.error('Error in /post-history/:user_id:', err);
            res.status(500).send('Error retrieving data from database');
        } else {
            res.json({data : results });
        }
    });
});

// Additional routes can be defined here using postDao's methods

module.exports = router;
