import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import "../component/CSS/recorded.css";
import "../component/CSS/sidebar_style.css";

function RecordedPage() {
    const [userId, setUserId] = useState('');
    const [group, setGroup] = useState('all');
    const [arrangement, setArrangement] = useState('date');
    const [posts, setPosts] = useState([]);
    const [editingPostId, setEditingPostId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newText, setNewText] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const handleView = async (videoId) => {
        navigate(`/Video/${videoId}`)
    };


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

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5001/get-posts/${userId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(userId);
                    console.log('Fetched data:', data);
                    setPosts(data);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                });
        }
    }, [userId]);


    const handleDelete = (postId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this post?");
        if (!isConfirmed) {
            return;
        }
        fetch(`http://localhost:5001/delete-posts/${postId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error in deleting post');
                }
                return response.text();
            })
            .then(() => {
                setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
                window.alert("Post deleted successfully");
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEdit = (postId) => {
        const postData = { id: postId, newTitle: newTitle, newText: newText };

        fetch('http://localhost:5001/edit-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('Post edited:', data);
                setPosts(posts.map(post => post.post_id === postId ? { ...post, post_title: newTitle, post_text: newText } : post));
                setShowModal(false);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const showdate = (timestamp) => {
        let date = new Date(timestamp);
        let formattedDate = date.toLocaleDateString();
        let formattedTime = date.toLocaleTimeString();
        let formattedDateTime = formattedDate + ' ' + formattedTime;
        return formattedDateTime
    }

    const renderEditForm = () => {
        if (showModal) {
            return (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Edit Post</h2>
                        <h3>Change Title</h3>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="New title"
                            className="modal-input"
                        />
                        <h3>Change Description</h3>
                        <input
                            type="text"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            placeholder="New text"
                            className="modal-input"
                        />
                        <button className='save' onClick={() => handleEdit(editingPostId)}>Save</button>
                    </div>
                </div>
            );
        }
        return null;
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    function handleApplyClick() {
        fetch(`http://localhost:5001/get-posts/${userId}?sort=${arrangement}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data);
                setPosts(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }

    return (
        <>
            <div id="content">
                <div id="condition">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <h3>Group</h3>
                                </td>
                                <td>{showdate(posts.post_date)}</td>

                                <td>
                                    <h3>Arrange By</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <select name="group" value={group} onChange={(e) => setGroup(e.target.value)}>
                                        <option value="all">All</option>
                                        <option value="group1">Group 1</option>
                                        <option value="group2">Group 2</option>
                                    </select>
                                </td>
                                <td>
                                    <select name="arrange" value={arrangement} onChange={(e) => setArrangement(e.target.value)}>
                                        <option value="date_asc">Date Ascending</option>
                                        <option value="date_desc">Date Descending</option>
                                        <option value="name_asc">Name Ascending</option>
                                        <option value="name_desc">Name Descending</option>
                                    </select>
                                </td>
                                <td>
                                    <button type="submit" name="apply" id="apply" onClick={handleApplyClick}>Apply</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="VideoList">
                    <table id="videoTable">
                        <thead>
                            <tr>
                                <td className="all">All Videos</td>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.post_id}>
                                    <td className="title" data-description={post.post_text}>
                                        {post.post_title}
                                    </td>
                                    <td>{formatDate(post.post_date)}</td>
                                    <td>
                                        <button className='editButton' onClick={() => {
                                            setEditingPostId(post.post_id);
                                            setNewTitle(post.post_title);
                                            setNewText(post.post_text);
                                            setShowModal(true);
                                        }}>Edit</button>
                                        <button className='deleteButton' onClick={() => handleDelete(post.post_id)}>Delete</button>
                                        {renderEditForm()}
                                    </td>
                                    <td><button className='view' onClick={() => {
                                        handleView(post.post_id)
                                    }}>View</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default RecordedPage;



