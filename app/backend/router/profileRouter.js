const express = require('express');
const multer = require('multer');
const router = express.Router();
const { editUserProfile, getUserProfile, updateUserAvatar,updateUserPassword} = require('../dao/profileDao');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.put('/edit-profile/:userId', (req, res) => {
    console.log('Received data:', req.body);
    const userId = req.body.userid;
    const userData = req.body;
    console.log('receivedid:', userId)
    // Assuming the array is sent directly
    editUserProfile(userId, userData, (err, result) => {
        if (err) {
            console.log("error", err);
            res.status(500).send('Error updating profile: ' + err.message);
        } else {
            res.status(200).send('Profile updated successfully');
            console.log(result);
        }
    });
});


router.get('/get-profile/:userId', (req, res) => {
    const userId = req.params.userId;
    getUserProfile(userId, (err, result) => {
        if (err) {
            console.log("error", err);
            res.status(500).send('Error fetching profile: ' + err.message);
        } else if (result) {
            res.status(200).json(result);
        }
    });
});

router.post('/upload-avatar/:userId', upload.single('avatar'), (req, res) => {
    const userId = req.params.userId;
    const avatar = req.file; // This is the uploaded file

    if (!avatar) {
        return res.status(400).send('No file uploaded.');
    }

    const avatarBlob = avatar.buffer;

    updateUserAvatar(userId, avatarBlob, (err, result) => {
        if (err) {
            console.error('Error updating avatar:', err);
            res.status(500).send('Error updating avatar');
        } else {
            res.status(200).send('Avatar updated successfully');
        }
    });
});

router.put('/update-password/:userId', (req, res) => {
    const userId = req.params.userId;
    const newPassword = req.body.newPassword;

    if (!newPassword || newPassword.trim() === '') {
        return res.status(400).send('Invalid newPassword.');
    }

    updateUserPassword(userId, newPassword, (err, result) => {
        if (err) {
            console.error('Error updating password:', err);
            res.status(500).send('Error updating password');
        } else {
            res.status(200).send('Password updated successfully');
        }
    });
});

module.exports = router;
