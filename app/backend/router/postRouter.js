const express = require('express');
const { getUsernameAndPostDate } = require('../dao/displayDAO'); 
const router = express.Router();

router.get('/post-history/:user_id', (req, res) => {
    const userId = req.params.user_id;
    getUsernameAndPostDate(userId, (err, results) => {
        if (err) {
            console.error('Error in /post-history/:user_id:', err);
            res.status(500).send('Error retrieving data from database');
        } else {
            res.json({ data: results });
        }
    });
});


module.exports = router;
