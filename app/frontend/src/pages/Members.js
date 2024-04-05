import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from "react-router-dom";
import { FaChevronDown } from 'react-icons/fa';
import ReactModal from 'react-modal';

import '../component/CSS/MembersPage.css';
import testPicture from '../component/image/profileDefault.jpg';

ReactModal.setAppElement('#root');

function MembersPage() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [admin, setAdmin] = useState([]);
    const [adminid, setAdminid] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const [isOpen, setIsOpen] = useState(true);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const [userDetails, setUserDetails] = useState(null);
    const [showModal2, setShowModal2] = useState(false);
    const [code, setCode] = useState([]);


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
            fetch(`http://localhost:5001/delete-group/${groupId}`, {
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


    const navigateToAnnounce = () => {
        navigate('/announcement', { state: { groupId } });
    }
    const navigateToView = () => {
        navigate('/view-announce', { state: { groupId } });
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
                    console.log(data[0].username);
                    setAdmin(data[0].username);
                    setAdminid(data[0].admin);
                    setCode(data[0].invite_code);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                });
        }

    }, [userId]);


    const renderEditForm = () => {
        if (showModal) {
            return (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Are you sure to delete {selectedMember?.username}</h2>
                        <button onClick={() => removeUserFromGroup(selectedMember?.userid)}>Yes</button>
                        <button onClick={() => setShowModal(false)}>No</button>
                    </div>
                </div>
            );
        }
        return null;
    };

    const handleUserClick = async (userId) => {
        const response = await fetch(`http://localhost:5001/user-details/${userId}`);
        const data = await response.json();
        if (data.user_image) {
            data.user_image = `data:image/*;base64,${data.user_image}`;
        }
        setUserDetails(data);
        setShowModal2(true);
    };
    const formatBirthday = (birthday) => {
        if (!birthday) return '';
        const date = new Date(birthday);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    // Function inside your component
    const handleViewPostsClick = (member) => {
        setSelectedMember(member);
        navigate(`/groupPost/${groupId}/${member.userid}`);
    };

    const handleViewAllPosts = (groupId) => {
        navigate(`/allGroupPost/${groupId}`);
    };


    return (
        <>
            <ReactModal className="userDetail" isOpen={showModal2} onRequestClose={() => setShowModal2(false)} >
                {/* <h2><center>User Info</center></h2> */}
                <span className="close" onClick={() => setShowModal2(false)}>&times;</span>
                {userDetails && (
                    <div>
                        <h2>User Info</h2>
                        <img src={userDetails.user_image || testPicture} style={{ width: '90px', height: '90px', borderRadius: '50%' }} />
                        <br></br>
                        <p>Username: {userDetails.username}</p>
                        <br></br>
                        <p>Gender: {userDetails.gender}</p>
                        <br></br>
                        <p>Birthday: {formatBirthday(userDetails.birthday)}</p>
                    </div>
                )}
            </ReactModal>

            <div className="members-page">
                <h3 id="admin">Admin: {admin}</h3>
                {/* everyone can see the invite code and it is easy for the invitation between the team members */}
                <h3 id="admin">{(<span>Invite Code: {code}</span>)}
                </h3>
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
                        <option value="Sender">Sender</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <div className="dropdown-content">
                        <button onClick={() => handleViewAllPosts(groupId)} className='dropdown-button'>View All Posts</button>
                        {userId == adminid && (
                            <>
                                <button onClick={() => deleteGroup(groupId)} className='dropdown-button'>Delete Group</button>
                                <button onClick={navigateToAnnounce} className='dropdown-button'>Create Announcement</button>
                            </>
                        )}

                        <button onClick={navigateToPostPage} className='dropdown-button'>Create Post</button>
                        <button onClick={navigateToView} className='dropdown-button'>View Announcement</button>
                    </div>

                </div>
                <table className="members-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {members
                            .filter(member => {
                                const matchesSearchTerm = member.username.toLowerCase().includes(searchTerm.toLowerCase());

                                if (roleFilter === 'All Roles') {
                                    return matchesSearchTerm;
                                } else if (roleFilter === 'Admin') {
                                    return matchesSearchTerm && (member.userid == adminid);
                                } else if (roleFilter === 'Sender') {
                                    return matchesSearchTerm && (member.userid != adminid);
                                }
                                return false;
                            })
                            .map((member, index) => (
                                <tr key={member.userid + '-' + index}
                                    onClick={() => navigateToGroupPostMember(member.userid, 'tr')}  // 使用箭头函数传递额外参数 'tr'
                                    style={{ cursor: 'pointer' }}
                                    className="table-row-hover">
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <img src={member.user_image} style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', transition: 'transform 0.3s ease' }} onClick={() => handleUserClick(member.userid)} alt="avatar"
                                                onMouseOver={(e) => (e.target.style.transform = 'scale(1.2)')}
                                                onMouseOut={(e) => (e.target.style.transform = 'scale(1)')} />
                                            <span onClick={() => handleUserClick(member.userid)} alt="avatar" style={{ cursor: 'pointer', borderBottom: '1px solid transparent', transition: 'border-bottom 0.3s ease' }}
                                                onMouseOver={(e) => (e.target.style.borderBottom = '1px solid #000')}
                                                onMouseOut={(e) => (e.target.style.borderBottom = '1px solid transparent')}>
                                                {member.username}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{member.userid == adminid ? 'Admin' : 'Sender'}</td>
                                    <td>

                                        <button onClick={() => handleViewPostsClick(member)}>View Posts</button>
                                    </td>
                                    <td>


                                        {userId == adminid && (
                                            <button className='editButton' onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedMember(member);
                                                setShowModal(true);
                                            }}>Delete Member</button>
                                        )}
                                        {renderEditForm()}
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
