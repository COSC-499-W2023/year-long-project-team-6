import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import "../component/CSS/sidebar_style.css";
import '../component/CSS/MembersPage.css';

function GroupPost() {
    const [userId, setUserId] = useState('');
    const { groupId, currentuserid } = useParams();
    const [senderId, setSenderId] = useState('');
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [admin, setAdmin] = useState([])
    const [members, setMembers] = useState([]);
    const [adminid, setAdminid] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();
console.log(groupId, currentuserid);
    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            navigate('/login');
        } else {
            const user = JSON.parse(sessionUser);
            setUserId(user.userid);
            setSenderId(currentuserid);
        }
    }, []);

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

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                console.log("SenderId: " + senderId);
                console.log("GroupId: " + groupId);
                const response = await fetch(`http://localhost:5001/posts/${senderId}/${groupId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, [senderId, groupId]);

    const handleView = async (videoId) => {
        navigate(`/Video/${videoId}`)
    };

    const showdate = (timestamp) => {
        let date = new Date(timestamp);
        let formattedDate = date.toLocaleDateString();
        let formattedTime = date.toLocaleTimeString();
        let formattedDateTime = formattedDate + ' ' + formattedTime;
        return formattedDateTime
    };

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`http://localhost:5001/admin-post/${postId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            alert("Successfully deleted post!");
            setPosts(posts.filter(post => post.post_id !== postId));
            setShowModal(false);
            setSelectedPost(null);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    
    const renderEditForm = () => {
        if (showModal) {
            return (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <h2>Are you sure to delete {selectedPost.post_title}</h2>
                        <button onClick={() => handleDeletePost(selectedPost.post_id)}>Yes</button>
                        <button onClick={() => setShowModal(false)}>No</button>    
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <div id="content">
                <div id="VideoList">
                    <table className="videoTable">
                        <thead>
                            <tr>
                                <td className="all" colSpan='4'>All Videos</td>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post.post_id} onClick={() => handleView(post.post_id)} style={{cursor: 'pointer'}}>
                                    <td className="title" data-description={post.post_text}>
                                        {post.post_title}
                                    </td>
                                    <td>{showdate(post.post_date)}</td>
                                    <td><button className='view' onClick={() => {
                                        handleView(post.post_id)
                                    }}>View</button></td>
                                    <td>
                                        {userId == adminid && (
                                            <button className='editButton' onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPost(post);
                                            setShowModal(true);
                                        }}>Delete Post</button>                                        
                                        )}
                                        {renderEditForm()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );




}

export default GroupPost;