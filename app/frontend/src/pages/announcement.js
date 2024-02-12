import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';

function Announcement() {
    const [userId, setUserId] = useState('');
    const location = useLocation();
    const groupId = location.state?.groupId; // Assuming groupId is passed in state
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState('');
    const navigate = useNavigate();
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
        console.log(groupId,userId)
        if (groupId && userId) {
            fetch(`http://localhost:5001/posts/${userId}/${groupId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.headers.get("content-type").includes("application/json")) {
                    return response.json();
                }
                throw new Error('Response not in JSON format');
            })
            .then(data => {
                setPosts(data);
                console.log(data);
            })
            .catch(error => console.error('Error fetching posts:', error));
        
        }
    }, [groupId, userId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log({ title, detail, selectedPost });
    };

    return (
        <div className='content'>
            <h2>Create Announcement</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="detail">Detail:</label>
                    <textarea
                        id="detail"
                        value={detail}
                        onChange={(e) => setDetail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="attachedPost">Attach Post:</label>
                    <select
                        id="attachedPost"
                        value={selectedPost}
                        onChange={(e) => setSelectedPost(e.target.value)}
                    >
                        <option value="">Select a post</option>
                        {posts.map(post => (
                            <option key={post.post_id} value={post.post_id}>{post.post_title}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Submit Announcement</button>
            </form>
        </div>
    );
}

export default Announcement;
