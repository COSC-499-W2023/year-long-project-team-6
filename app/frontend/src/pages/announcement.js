import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Announcement() {
    const [userId, setUserId] = useState('');
    const location = useLocation();
    const groupId = location.state?.groupId;
    const [title, setTitle] = useState('');
    const [detail, setDetail] = useState('');
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        console.log(groupId, userId)
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
        setIsSubmitting(true);
        if (!title.trim()) {
            window.alert('Please enter a title for the announcement.');
            return;
        }

        if (!detail.trim()) {
            window.alert('Please enter details for the announcement.');
            return;
        }
        console.log({ title, detail, selectedPost });
    };
    useEffect(() => {
        if (isSubmitting) {
            let announcementData = {
                announcer: userId,
                groupId,
                title,
                detail
            };

            if (selectedPost) {
                announcementData.attachedPost = selectedPost;
            }

            fetch('http://localhost:5001/insertAnnouncement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(announcementData),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    setIsSubmitting(false);
                    navigate(`/Members/${groupId}`);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsSubmitting(false);
                });
        }
    }, [isSubmitting, userId, groupId, title, detail, selectedPost, navigate]);


    return (
        <div className='announcement-container'>
            <div className="form-container">
                <h2 className="heading">Create An Announcement</h2>
                <form onSubmit={handleSubmit} className="announcement-form">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Title:</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="detail" className="form-label">Detail:</label>
                        <textarea
                            id="detail"
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            required
                            className="form-textarea"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="attachedPost" className="form-label">Attach Post:</label>
                        <select
                            id="attachedPost"
                            value={selectedPost}
                            onChange={(e) => setSelectedPost(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Select a post</option>
                            {posts.map(post => (
                                <option key={post.post_id} value={post.post_id}>{post.post_title}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="submit-button">Post Announcement</button>
                </form>
            </div>
        </div>
    );
}

export default Announcement;
