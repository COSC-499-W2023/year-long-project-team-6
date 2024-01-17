import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            navigate('/login');
        } else {
            const user = JSON.parse(sessionUser);
            setUser(user);
            console.log(user);
        }
    }, [navigate]);

    useEffect(() => {
        if (user.userid) {
            fetch(`http://localhost:5001/get-profile/${user.userid}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(user.userid);
                    console.log('Fetched data:', data);
                    if (data.birthday) {
                        data.birthday = data.birthday.split('T')[0]; // Keeps only the 'YYYY-MM-DD' part
                    }
                    setUser(data);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                });
        }
    }, [user.userid]);


    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
    };

    const handleSaveClick = () => {
        console.log(user.userid);
        axios.put(`http://localhost:5001/edit-profile/${user.userid}`, user)
            .then(response => {
                console.log('Profile updated:', response.data);
                setIsEditMode(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Failed to update profile.');
            });
    };
    return (
        <div className="user-profile">
            <div className="avatar-container">
                <img src={user.profilePicture || profilePicture} alt={`${user.username}'s profile`} />
                {isEditMode ? (
                    <>
                        <button className="save-profile" onClick={handleSaveClick} hidden="hidden">Save</button>
                    </>
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
                    <button className="save-profile" onClick={handleSaveClick}>Save</button>
                    <button className="cancel-profile" onClick={handleCancelClick}>Cancel</button>
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
