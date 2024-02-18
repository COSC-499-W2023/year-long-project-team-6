import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link  } from "react-router-dom";
import '../component/CSS/MembersPage.css';


function MembersPage() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const { groupId } = useParams();
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [admin , setAdmin] = useState([])
    const [adminid, setAdminid]=useState([])
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
                    setMembers(data);
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
                            ) : null}
                </span>
                <button onClick={navigateToPostPage} className="navigate-post-page-button">Create Post</button>
                {userId == adminid ? (<button onClick={navigateToAnnounce} className="navigate-announce-button">Create Announcement</button>
                  ) : null}
        <button onClick={navigateToView} className="navigate-view-announce-button">View Announcement</button>

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
                            <td>{member.username}</td>
                            <td>{member.userid == adminid ? 'Admin' : 'Sender'}</td>
                            <td>
                             {userId == adminid ? (
                             <button onClick={navigateToGroupPostMember(member.userid)}>View Posts</button>
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
