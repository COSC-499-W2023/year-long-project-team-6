import React, { useState } from 'react';

const AdminInterface = () => {
    const [userId, setUserId] = useState('');
    const [postId, setPostId] = useState('');
    const [groupId, setGroupId] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');
    const [newGroupName, setNewGroupName] = useState('');
    const [newAdmin, setNewAdmin] = useState('');

    const handleEditUser = async () => {
        try {
            const response = await fetch(`http://localhost:5001/admin-user/edit/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newUsername, newEmail }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            console.log('User updated successfully:', result);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:5001/admin-user/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('User deleted successfully:', result);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditPost = async () => {
        try {
            const response = await fetch(`http://localhost:5001/admin-post/edit/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newTitle, newText }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Post updated successfully:', result);
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePost = async () => {
        try {
            const response = await fetch(`http://localhost:5001/admin-post/${postId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Post deleted successfully:', result);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEditGroup = async () => {
        try {
            const response = await fetch(`http://localhost:5001/admin-group/edit/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newGroupName, newAdmin }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Group updated successfully:', result);
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            const response = await fetch(`http://localhost:5001/admin-group/${groupId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Group deleted successfully:', result);
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };


    const handleRemoveUserFromGroup = async () => {
        try {
            const response = await fetch(`http://localhost:5001/admin-group/${groupId}/user/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('User removed from group successfully:', result);
        } catch (error) {
            console.error('Error removing user from group:', error);
        }
    };


    return (
        <div className="admin-page">
            <h2>Admin Dashboard</h2>

            <div className="user-management">
                <h3>User Management</h3>
                <input type="text" placeholder="User ID" onChange={(e) => setUserId(e.target.value)} />
                <input type="text" placeholder="New Username" onChange={(e) => setNewUsername(e.target.value)} />
                <input type="email" placeholder="New Email" onChange={(e) => setNewEmail(e.target.value)} />
                <button onClick={handleEditUser}>Edit User</button>
                <button onClick={handleDeleteUser}>Delete User</button>
            </div>

            <div className="post-management">
                <h3>Post Management</h3>
                <input type="text" placeholder="Post ID" onChange={(e) => setPostId(e.target.value)} />
                <input type="text" placeholder="New Post Title" onChange={(e) => setNewTitle(e.target.value)} />
                <textarea placeholder="New Post Text" onChange={(e) => setNewText(e.target.value)}></textarea>
                <button onClick={handleEditPost}>Edit Post</button>
                <button onClick={handleDeletePost}>Delete Post</button>
            </div>

            <div className="group-management">
                <h3>Group Management</h3>
                <input type="text" placeholder="Group ID" onChange={(e) => setGroupId(e.target.value)} />
                <input type="text" placeholder="New Group Name" onChange={(e) => setNewGroupName(e.target.value)} />
                <input type="text" placeholder="New Admin User ID" onChange={(e) => setNewAdmin(e.target.value)} />
                <button onClick={handleEditGroup}>Edit Group</button>
                <button onClick={handleDeleteGroup}>Delete Group</button>
                <button onClick={handleRemoveUserFromGroup}>Remove User from Group</button>
            </div>
        </div>
    );

};

export default AdminInterface;
