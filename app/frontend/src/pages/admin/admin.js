import React, { useState } from 'react';
import './admin.css';

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
            fetch(`http://localhost:5001/admin-user/edit/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newUsername: newUsername, newEmail: newEmail }),
            })
            .then(
                response => {
                    console.log('User updated:', response);
                    window.location.reload();
                }
            )
            .catch(
                error => {
                    console.error('Error:', error);
                }
            );
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            fetch(`http://localhost:5001/admin-user/${userId}`, {
                method: 'DELETE'
            }).then(
                response => {
                    console.log('User deleted:', response);
                    window.location.reload();

                }
            )
            .catch(
                error => {
                    console.error('Error:', error);
                }
            );
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditPost = async () => {
        try {
            fetch(`http://localhost:5001/admin-post/edit/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newTitle, newText }),
            }).then(
                response => {
                    console.log('Post updated:', response);
                    alert("Successfully update post!");
                window.location.reload();
                }
            )
            .catch(
                error => {
                    console.error('Error:', error);
                }
            );
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDeletePost = async () => {
        try {
            fetch(`http://localhost:5001/admin-post/${postId}`, {
                method: 'DELETE'
            }).then(
                response => {
                    console.log('Post deleted:', response.data);
                    alert("Successfully delete post!");
                    window.location.reload();
                }
            )
            .catch(
                error => {
                    console.error('Error:', error);
                }
            );
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEditGroup = async () => {
        try {
            fetch(`http://localhost:5001/admin-group/edit/${groupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newGroupName, newAdmin }),
            }).then(
                response => {
                    console.log('Group updated:', response.data);
                    alert("Successfully update the group!");
                    window.location.reload();
                }
            )
            .catch(
                error => {
                    console.error('Error:', error);
                }
            );
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleDeleteGroup = async () => {
        try {
            fetch(`http://localhost:5001/admin-group/${groupId}`, {
                method: 'DELETE'
            }).then(
                response => {
                    console.log('User updated:', response.data);
                    alert("Successfully deleted the group!");
                    window.location.reload();
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


    const handleRemoveUserFromGroup = async () => {
        try {
            fetch(`http://localhost:5001/admin-group/${groupId}/user/${userId}`, {
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
                <input type="text" placeholder="User ID to remove" onChange={(e) => setUserId(e.target.value)} />
                <button onClick={handleEditGroup}>Edit Group</button>
                <button onClick={handleDeleteGroup}>Delete Group</button>
                <button onClick={handleRemoveUserFromGroup}>Remove User from Group</button>
            </div>
        </div>
    );

};

export default AdminInterface;
