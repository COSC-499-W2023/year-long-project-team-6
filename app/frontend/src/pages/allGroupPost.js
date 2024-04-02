import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const GroupPostsPage = () => {
    const { groupId } = useParams();
    const [userId, setUserId] = useState('');
    const [adminid, setAdminid] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    
    const showDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const handleView = (postId) => {
        navigate(`/video/${postId}`);
    };

    useEffect(() => {
        fetch(`http://localhost:5001/all-group-post/${groupId}`)
            .then((response) => response.json())
            .then((data) => {
                setPosts(data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [groupId]);

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
        <div id="content">
            <div id="VideoList">
                <table className="videoTable">
                    <thead>
                        <tr>
                            <td className="all" colSpan="4">All Videos</td>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.post_id} onClick={() => handleView(post.post_id)} style={{ cursor: 'pointer' }}>
                                <td className="title" data-description={post.post_text}>
                                    {post.post_title}
                                </td>
                                <td>{showDate(post.post_date)}</td>
                                <td>
                                    <button className='view' onClick={(e) => {
                                        e.stopPropagation();
                                        handleView(post.post_id);
                                    }}>View</button>
                                </td>
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
    );
};

export default GroupPostsPage;
