import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import '../component/CSS/MembersPage.css';
import testPicture from '../component/image/flash.png';


function MembersPage() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [admin, setAdmin] = useState([])
    const [adminid, setAdminid] = useState([])
    console.log(groupId);
    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            navigate('/login');
        } else {
            const user = JSON.parse(sessionUser);
            setUserId(user.userid);
            console.log("User Id: " + user.userid);
        }
    }, []);
    const navigateToGroupPostMember = (memberId) => () => {
        navigate(`/groupPost/${groupId}/${memberId}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRoleFilter(event.target.value);
    };

    const removeUserFromGroup = async (memberId) => {
        try {
            fetch(`http://localhost:5001/admin-group/${groupId}/user/${memberId}`, {
                method: 'DELETE'
            }).then(
                response => {
                    console.log('User removed:', response.data);
                    alert("Successfully removed user from group!");
                    window.location.reload();
                }
            )
                .catch(
                    error => {
                        console.error('Error:', error);
                    }
                );
        } catch (error) {
            console.error('Error removing user from group:', error);
        }
    };

    const deleteGroup = async (groupId) => {
        try {
            fetch(`http://localhost:5001/admin-group/${groupId}`, {
                method: 'DELETE'
            }).then(
                response => {
                    console.log('User updated:', response.data);
                    alert("Successfully deleted the group!");
                    navigate(`/`);
                }
            )
                .catch(
                    error => {
                        console.error('Error:', error);
                    }
                );
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };


    const navigateToPostPage = () => {
        navigate('/PostPage', { state: { groupId } });
    };

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5001/groups-users/${groupId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(userId);
                    console.log('Fetched data:', data);
                    const updatedMembers = data.map(member => {
                        if (member.user_image) {
                            member.user_image = `data:image/*;base64,${member.user_image}`;
                        } else {
                            member.user_image = testPicture;
                        }
                        return member;
                    });
                    setMembers(updatedMembers);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                });
            fetch(`http://localhost:5001/group-admin/${groupId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(userId);
                    console.log('groupadmin:', data);
                    console.log(data[0].username)
                    setAdmin(data[0].username);
                    setAdminid(data[0].admin);

                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                });
        }

    }, [userId]);
    console.log(roleFilter);

    return (
        <>
            <div className="members-page">
                <h3 id="admin">Admin: {admin}</h3>
                <div className="members-filter">
                    <input
                        type="text"
                        placeholder="Search username"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-bar"
                    />

                    <select value={roleFilter} onChange={handleRoleChange} className="dropdown">
                        <option value="All Roles">All Roles</option>
                        <option value="sender">Sender</option>
                        <option value="Admin">Admin</option>
                    </select>
                    <span className='button'>
                        {userId != adminid ? (
                            <button onClick={navigateToGroupPostMember(adminid)}>View Posts</button>
                        ) :
                            <button onClick={() => deleteGroup(groupId)}>Delete Group</button>
                        }
                    </span>
                    <button onClick={navigateToPostPage} className="navigate-post-page-button">Create Post</button>
                </div>
                <table className="members-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter(member =>
                                member.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                (roleFilter === 'All Roles' || member.role === roleFilter)
                            )
                            .map((member, index) => (
                                <tr key={member.userid + '-' + index}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={member.user_image} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt="avatar" />
                                            <span>{member.username}</span>
                                        </div>
                                    </td>
                                    <td>{member.userid == adminid ? 'Admin' : 'Sender'}</td>
                                    <td>
                                        {userId == adminid ? (
                                            <div className='adminButton'>
                                                <button onClick={navigateToGroupPostMember(member.userid)}>View Posts</button>
                                                <button onClick={() => removeUserFromGroup(member.userid)}>Delete User</button>
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    );

}

export default MembersPage;
