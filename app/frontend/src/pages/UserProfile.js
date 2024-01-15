import React, { useState, useEffect } from 'react';
import axios from 'axios';
import profilePicture from '../component/image/AvatarForProfile.png';
import "../component/CSS/profile.css";

const UserProfile = () => {
    const [user, setUser] = useState({
        userId: '',
        username: '',
        email: '',
        profilePicture: '',
        gender: '',
        birthday: '',
        role: ''
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUserData = sessionStorage.getItem('user');
        const storedUser = storedUserData ? JSON.parse(storedUserData) : null;
        if (storedUser && storedUser.userid) {
            axios.get(`http://localhost:5001/get-profile/${storedUser.userid}`)
                .then(response => {
                    setUser(response.data);
                })
                .catch(error => {
                    console.error('Error fetching profile: ', error);
                    setError('Failed to fetch profile.');
                    if (error.response) {
                        console.error('User not found');
                    } else {
                        console.error('Error fetching profile:', error);
                    }
                });
        }
    }, []);


    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleSaveClick = () => {
        const storedUserData = sessionStorage.getItem('user');
        const storedUser = storedUserData ? JSON.parse(storedUserData) : null;
        console.log("User: is " + user);
        if (storedUser && storedUser.userid) {
            axios.post(`http://localhost:5001/edit-profile/${storedUser.userid}`, user)
                .then(response => {
                    setIsEditMode(false);
                    setError('');
                })
                .catch(error => {
                    console.error('Error updating profile:', error);
                    setError('Failed to update profile.');
                });
        }
    };


    return (
        <div className="user-profile">
            <div className="avatar-container">
                <img src={user.profilePicture || profilePicture} alt={`${user.username}'s profile`} />
                {isEditMode ? (
                    <button className="save-profile" onClick={handleSaveClick} hidden="hidden">Save</button>
                ) : (
                    <button className="edit-profile" onClick={handleEditClick}>Edit Profile</button>
                )}
            </div>
            {isEditMode ? (
                <>
                    <p>Name: <input type="text" name="username" value={user.username} onChange={handleInputChange} /></p>
                    <p>Gender: <input type="radio" name="male" value="Male" onChange={handleInputChange} /><label for="male">Male</label>
                        <input type="radio" name="female" value="Female" onChange={handleInputChange} /><label for="female">Female</label>
                        <input type="radio" name="other" value="Other" onChange={handleInputChange} /><label for="other">Other</label></p>
                    <p>Birth Date: <input type="date" name="birthday" value={user.birthday} onChange={handleInputChange} /></p>
                    <p>Role: <input type="radio" name="receiver" value="receiver" onChange={handleInputChange} /><label for="receiver">receiver</label>
                        <input type="radio" name="sender" value="sender" onChange={handleInputChange} /><label for="sender">Sender</label></p>
                    <button className="save-profile" onClick={handleSaveClick}>Save</button>
                    <button className="cancel-profile" onClick={handleSaveClick}>Cancel</button>
                </>
            ) : (
                <>
                    <h1>Username: {user.username}</h1>
                    <p><strong>Email: </strong>{user.email}</p>
                    <p><strong>Gender: </strong>{user.gender}</p>
                    <p><strong>Birth Date: </strong>{user.birthday}</p>
                    <p><strong>Role: </strong>{user.role}</p>
                </>
            )}
        </div>
    );
}

export default UserProfile;
