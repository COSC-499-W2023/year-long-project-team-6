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
                });
        }
    }, []);

    useEffect(() => {
        console.log(user);
    }, [user]);

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleSaveClick = () => {
        axios.put(`/edit-profile/${user.userId}`, user)
            .then(response => {
                setIsEditMode(false);
                setError('');
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                setError('Failed to update profile.');
            });
    };

    return (
        <div className="user-profile">
            <div className="avatar-container">
                <img src={user.profilePicture || profilePicture} alt={`${user.username}'s profile`} />
                {isEditMode ? (
                    <button className="save-profile" onClick={handleSaveClick}>Save</button>
                ) : (
                    <button className="edit-profile" onClick={handleEditClick}>Edit Profile</button>
                )}
            </div>
            {isEditMode ? (
                <>
                    <input type="text" name="username" value={user.username} onChange={handleInputChange} />
                    <input type="text" name="gender" value={user.gender} onChange={handleInputChange} />
                    <input type="date" name="birthday" value={user.birthday} onChange={handleInputChange} />
                    <input type="text" name="role" value={user.role} onChange={handleInputChange} />
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
