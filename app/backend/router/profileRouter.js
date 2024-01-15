const express = require('express');
const router = express.Router();
const { editUserProfile, getUserProfile } = require('../dao/profileDao');

router.put('/edit-profile/:userId', express.json(), (req, res) => {
    const userId = req.params.userId;
    const updatedProfile = req.body;
    editUserProfile(userId, updatedProfile, (err, result) => {
        if (err) {
            res.status(500).send('Error updating profile: ' + err.message);
        } else {
            res.status(200).send('Profile updated successfully');
        }
    });
});

router.get('/get-profile/:userId', (req, res) => {
    const userId = req.params.userId;
    getUserProfile(userId, (err, result) => {
        if (err) {
            res.status(500).send('Error fetching profile: ' + err.message);
        } else if (result) {
            console.log("reslut:"+result);
            res.status(200).json(result);
        }
    });
});

module.exports = router;
