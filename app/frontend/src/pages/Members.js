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


    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRoleFilter(event.target.value);
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
        }
    }, [userId]);
    console.log(members);

    return (
        <div className="members-page">
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
                    <option value="Receiver">Receiver</option>
                </select>
            </div>
            <table className="members-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Posts</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.userId}>
                            <td>{member.username}</td>
                            <td>{member.role}</td>
                            <td><Link to={`/groupPost/${groupId}/${member.username}`}>Check members</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default MembersPage;
