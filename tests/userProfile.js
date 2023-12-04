import React,{useState, useEffect} from 'react';
import profilePicture from '../app/userProfile_UI/AvatarForProfile.png';
const UserProfile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        profilePicture: profilePicture,
        gender: '',
        Bdate: '',
        role: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);
    const [tempGender, setTempGender] = useState(user.gender);
    const [tempBdate, setTempBdate] = useState(user.Bdate);

    useEffect(() => {
        const storedUser = JSON.parse(sessionStorage.getItem('user'));
        if (storedUser) {
            setUser({
                ...user,
                ...storedUser,
                profilePicture: storedUser.profilePicture || profilePicture
            });
        }
    }, []);

    const handleEditClick = () => {
        setIsEditMode(true);
    };

    const handleSaveClick = () => {
        setUser({ ...user, gender: tempGender, Bdate: tempBdate });
        setIsEditMode(false);
    };


    return (
        <div className="user-profile">
            <div className="avatar-container">
                <img src={user.profilePicture} alt={`${user.username}'s profile`} />
                {/* first is false, so we show the edit profile. when handleEditclick function perform, isEditmode will be true. Then we came to the edit page*/}
                {isEditMode ? (
                    <button className="save-profile" onClick={handleSaveClick}>Save</button>
                ) : (
                    <button className="edit-profile" onClick={handleEditClick}>Edit Profile</button>
                )}
            </div>
            <h1>Username: {user.username}</h1>
            <p><strong>Email: </strong>{user.email}</p>
            <p><strong>Gender: </strong>
                {isEditMode ? (
                    // since we are in edit mode, we need to change the value. However, input value will be back to N/A after a refresh. 
                    <input type="text" value={tempGender} onChange={(input) => setTempGender(input.target.value)} />
                ) : (
                    user.gender || "Null"
                )}
            </p>
            <p><strong>Birth Date: </strong>
                {isEditMode ? (
                    <input type="date" value={tempBdate} onChange={(input) => setTempBdate(input.target.value)} />
                ) : (
                    user.Bdate || "Null"
                )}
            </p>
            <p><strong>Role: </strong>{user.role}</p>
        </div>
    );


}

export default UserProfile;