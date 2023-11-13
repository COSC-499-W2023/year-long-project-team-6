const express = require('express');
const PostDao = require('../dao/displayDAO');
const router = express.Router();

router.get('/', (req, res) => {
    const postDao = new PostDao(req.db);

    postDao.getUsernameAndPostDate((err, results) => {
        if (err) {
            res.status(500).send('Error retrieving data from database');
            return;
        }
        res.json(results);
    });
});

module.exports = router;
