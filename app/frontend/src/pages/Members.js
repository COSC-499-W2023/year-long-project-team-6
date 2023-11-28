import React, { useState } from 'react';
import '../component/CSS/MembersPage.css';

const mockData = [
    { name: 'David', group: 'Group 1', role: 'Sender' },
    { name: 'Smith', group: 'Group 1', role: 'Sender' },
    { name: 'Grace', group: 'Group 1', role: 'Sender' },
    { name: 'Jason', group: 'Group 1', role: 'Receiver' },
    { name: 'Jerry', group: 'Group 1', role: 'Sender' },
    { name: 'Henry', group: 'Group 1', role: 'Receiver' },
    { name: 'Lisa', group: 'Group 1', role: 'Sender' },
];

const Members = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRoleFilter(event.target.value);
    };

    return (
        <div className="members-page">
            <div className="members-filter">
                <input
                    type="text"
                    placeholder="Search users"
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
                        <th>Section</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {mockData.map((member, index) => (
                        <tr key={index}>
                            <td>{member.name}</td>
                            <td>{member.group}</td>
                            <td>{member.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Members;
