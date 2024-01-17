const express = require('express');
const router = express.Router();
const { editUserProfile, getUserProfile } = require('../dao/profileDao');

router.put('/edit-profile/:userId', (req, res) => {
    console.log('Received data:', req.body);
    const userId = req.params.userId;
    const userData = req.body; // Assuming the array is sent directly
    // console.log("Updated Profile: " + updatedProfile);
    editUserProfile(userId, userData, (err, result) => {
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
            res.status(200).json(result);
        }
    });
});

module.exports = router;
