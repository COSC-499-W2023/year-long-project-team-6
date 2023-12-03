import React from 'react';
import profilePicture from '../app/userProfile_UI/AvatarForProfile.png';
const defaultUser = {
    name: 'David',
    email: 'DavidIsWorking@UBC.com',
    profilePicture: profilePicture,
    gender: 'Male',
    Bdate: '2001-01-01',
    role: 'Sender'
};

function UserProfile ({ user = defaultUser }) {
    return (
        <div className="user-profile">
            <div className="avatar-container">
                <img src={user.profilePicture} alt={`${user.name}'s profile`} />
                <button className="change-avatar">Edit Profile</button>
            </div>
            <h1>Username: {user.name}</h1>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Gender: </strong>{user.gender}</p>
            <p><strong>Birth Date: </strong>{user.Bdate}</p>
            <p><strong>Role: </strong>{user.role}</p >
        </div >
    );
};

export default UserProfile;