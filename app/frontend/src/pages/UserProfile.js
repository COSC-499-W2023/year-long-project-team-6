import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import SamplePicture from '../component/image/AvatarForProfile.png';
import testPicture from '../component/image/profileDefault.jpg';
import "../component/CSS/profile.css";

const UserProfile = () => {
    const [user, setUser] = useState({
        userid: '',
        username: '',
        email: '',
        user_image: '',
        gender: '',
        birthday: null,
    });

    const [isHovering, setIsHovering] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [error, setError] = useState('');
    const [userId, setId] = useState('');
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const handleMouseOver = () => setIsHovering(true);
    const handleMouseOut = () => setIsHovering(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [passwError, setPasswError] = useState(false);

    // In order to automatically update the interface, we define a function that will be contained in the useEffect. 
    const fetchUserProfile = () => {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            navigate('/login');
        } else {
            const user = JSON.parse(sessionUser);
            setUser(user);
            console.log('user', user.userid);
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
                        setId(user.userid);
                        console.log('Fetched data:', data);
                        if (data.birthday) {
                            data.birthday = data.birthday.split('T')[0]; // Keeps only the 'YYYY-MM-DD' part
                        }
                        if (data.user_image) {
                            const imageUrl = `data:image/*;base64,${data.user_image}`;
                            data.user_image = imageUrl;
                        } else {
                            data.user_image = testPicture;
                        }
                        setUser({
                            userid: user.userid,
                            username: data.username,
                            email: data.email,
                            user_image: data.user_image || SamplePicture,
                            gender: data.gender || '',
                            birthday: data.birthday || null,
                        });
                        console.log('userid second', user.userid);
                    })
                    .catch(error => {
                        console.error('Error fetching posts:', error);
                    });
            }
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [navigate]);
    const handleAvatarClick = () => {
        // Trigger file input when the avatar image is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
            // fetchUserProfile();
        }
    };

    const handleInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleCancelClick = () => {
        setIsEditMode(false);
        fetchUserProfile();
    };

    const handleSaveClick = () => {
        console.log('Session User:', user);
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

    const handleFileSelect = (event) => {
        const file = event.target.files[0]; // Assuming single file selection
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append('avatar', file);
        axios.post(`http://localhost:5001/upload-avatar/${user.userid}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                console.log('Avatar updated successfully', response.data);
                //This will refresh the page with new avatar image. 
                fetchUserProfile();
            })
            .catch(error => {
                console.error('Error uploading avatar:', error);
            });
    };

    const validatePassw = () => {
        const isLengthValid = newPassword.length >= 6 && newPassword.length <= 30;
        const hasDigit = /\d/.test(newPassword);
        const hasLetter = /[a-zA-Z]/.test(newPassword);
        const hasSymbol = /[^a-zA-Z\d]/.test(newPassword);

        if (isLengthValid && hasDigit && hasLetter && hasSymbol) {
            setPasswError(false);
            return (true);
        } else {
            setPasswError(true);
            return (false);
        }
    };

    const changePassword = () => {
        if ((newPassword !== confirmNewPassword)) {
            alert('New password and confirmed password do not match!');
            return;
        } else if ((validatePassw() == false)) {
            alert("New password format is wrong!");
            return;
        }

        axios.put(`http://localhost:5001/update-password/${userId}`, {
            currentPassword,
            newPassword
        })
            .then(response => {
                console.log('Password changed:', response.data);
                closeEditPassWord();
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Failed to change password.');
            });
    };

    const closeEditPassWord = () => {
        setShowChangePasswordModal(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    };

    const renderPasswordForm = () => {
        if (showChangePasswordModal) {
            return (
                <div className="modal-backdrop" onClick={() => setShowChangePasswordModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={closeEditPassWord}>&times;</span>
                        <div className="change-password-modal">
                            <p id='old'>Old password:</p>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <p id='new'>New password:</p>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <p id='confirm'>Confirmed password:</p>
                            <input
                                type="password"
                                placeholder="Confirmed Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <p></p>
                            <button onClick={changePassword}>Submit</button>
                            <button onClick={closeEditPassWord}>Cancel</button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="user-profile">
            <div className="avatar-container">
                <div className="avatar-hover">
                    <img
                        src={user.user_image}
                        alt={`${user.username}'s profile`}
                        onClick={handleAvatarClick}
                        style={{ cursor: 'pointer' }}
                        title="Change Avatar"
                    />
                    <span className="hovering-text">Change Avatar</span>
                </div>

                {isEditMode ? (

                    <button className="save-profile" onClick={handleSaveClick} hidden="hidden">Save</button>
                ) : (
                    <button className="edit-profile" onClick={handleEditClick}>Edit Profile</button>
                )}

            </div>

            {isEditMode ? (
                <>

                    <p>Name: <input type="text" name="username" value={user.username} onChange={handleInputChange} id='username' /></p>
                    <p>Gender:
                        <input type="radio" name="gender" value="Male" checked={user.gender === "Male"} onChange={handleInputChange} /><label>Male</label>
                        <input type="radio" name="gender" value="Female" checked={user.gender === "Female"} onChange={handleInputChange} /><label>Female</label>
                        <input type="radio" name="gender" value="Other" checked={user.gender === "Other"} onChange={handleInputChange} /><label>Other</label>
                    </p>
                    <p>Birth Date: <input type="date" name="birthday" value={user.birthday} onChange={handleInputChange} id='birthday' /></p>
                    <button className="save-profile" onClick={handleSaveClick}>Save</button>
                    <button className="cancel-profile" onClick={handleCancelClick}>Cancel</button>
                </>
            ) : (
                <>
                    <button className="changePassw" type="button" onClick={() => setShowChangePasswordModal(true)}>Change Password</button>
                    <div>{renderPasswordForm()}</div>
                    <button className="change-avatar-button" onClick={() => fileInputRef.current.click()}>Change Avatar</button>
                    <input type="file" onChange={handleFileSelect} ref={fileInputRef} style={{ display: 'none' }} />
                    <h1>Username: {user.username}</h1>
                    <p><strong>Email: </strong>{user.email}</p>
                    <p><strong>Gender: </strong>{user.gender}</p>
                    <p><strong>Birth Date: </strong>{user.birthday}</p>
                </>
            )}
        </div>
    );
}

export default UserProfile;
