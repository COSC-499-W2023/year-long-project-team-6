const express = require('express');
const router = express.Router();
const { editUserProfile } = require('../dao/profileDao'); 

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

module.exports = router;
