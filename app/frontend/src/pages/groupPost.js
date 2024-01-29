import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import "../component/CSS/sidebar_style.css";

function GroupPost() {
    const [userId, setUserId] = useState('');
    const { groupId, currentuserid } = useParams();
    const [senderId, setSenderId] = useState('');
    const [posts, setPosts] = useState([]);
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
    }
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
                                    <td>{showdate(post.post_date)}</td>
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