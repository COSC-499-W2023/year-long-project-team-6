const express = require('express');
<<<<<<< HEAD
const PostDao = require('../dao/displayDAO');
const router = express.Router();

router.get('/post-history', (req, res) => {
    const postDao = new PostDao(req.db);

    postDao.getUsernameAndPostDate((err, results) => {
        if (err) {
            res.status(500).send('Error retrieving data from database');
            return;
        }
        res.json(results);
    });
});

=======
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
            res.status(500).send('Error adding post: ' + err.message);
        } else {
            console.log('Post add result:', postData);
            res.status(200).send(`New post added successfully with ID ${result.insertId}`);
        }
    });
});



>>>>>>> 07fffb993a70f62b8a37adff83105b36f9c6883f
module.exports = router;
