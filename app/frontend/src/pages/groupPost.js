import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import "../component/CSS/sidebar_style.css";

function GroupPost() {
    const [userId, setUserId] = useState('');
    const { groupId, sendername } = useParams();
    const [senderId, setSenderId] = useState('');
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            navigate('/login');
        } else {
            const user = JSON.parse(sessionUser);
            setUserId(user.userid);
            fetch(`http://localhost:5001/get-sender-id/${sendername}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const sender = data[0].userid;
                        setSenderId(sender);
                    } else {
                        console.log("No data received or data is empty");
                    }
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                });
        }

        const fetchPosts = async () => {
            try {
                console.log("SenderId: " + senderId);
                console.log("GroupId: " + groupId);
                const response = await fetch(`http://localhost:5001/posts/22/${groupId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data);
                console.log("Post Data: " + data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, []);

    // useEffect(() => {
    //     const fetchPosts = async () => {
    //         try {
    //             console.log("SenderId: " + senderId);
    //             console.log("GroupId: " + groupId);
    //             const response = await fetch(`http://localhost:5001/posts/${senderId}/${groupId}`);
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //             const data = await response.json();
    //             setPosts(data);
    //         } catch (error) {
    //             console.error('Error fetching posts:', error);
    //         }
    //     };
    //     fetchPosts();
    // }, [senderId, groupId]);

    const handleView = async (videoId) => {
        navigate(`/Video/${videoId}`)
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    return (
        <>
            <div id="content">
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

export default GroupPost;