const express = require('express');
const { getUsernameAndPostDate, addPost} = require('../dao/displayDAO'); 

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

// Add a new post
router.post('/add-post', express.json(), (req, res) => {
    console.log('Received post data:', req.body); 
    const postData = req.body;
    addPost(postData, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error adding post: ' + err.message);
        } else {
            console.log('Post add result:', postData);
            res.status(200).send(`New post added successfully with ID ${result.insertId}`);
        }
    });
});



module.exports = router;
