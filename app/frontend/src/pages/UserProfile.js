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
        if (storedUser && storedUser.userid) {
            const userDataArray = Object.values(user);
            console.log(userDataArray);
            axios.put(`http://localhost:5001/edit-profile/${storedUser.userid}`, userDataArray)            
            .then(response => {
                console.log(response);
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
                    <p>Gender: 
                        <input type="radio" name="gender" value="Male" checked={user.gender === "Male"} onChange={handleInputChange} /><label>Male</label>
                        <input type="radio" name="gender" value="Female" checked={user.gender === "Female"} onChange={handleInputChange} /><label>Female</label>
                        <input type="radio" name="gender" value="Other" checked={user.gender === "Other"} onChange={handleInputChange} /><label>Other</label>
                    </p>
                    <p>Birth Date: <input type="date" name="birthday" value={user.birthday} onChange={handleInputChange} /></p>
                    <p>Role: 
                        <input type="radio" name="role" value="Receiver" checked={user.role === "Receiver"} onChange={handleInputChange} /><label>Receiver</label>
                        <input type="radio" name="role" value="Sender" checked={user.role === "Sender"} onChange={handleInputChange} /><label>Sender</label>
                    </p>
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
