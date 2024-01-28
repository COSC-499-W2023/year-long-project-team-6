import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import "../component/CSS/sidebar_style.css";

function groupPost() {
    const [userId, setUserId] = useState('');
    const { groupId, senderName } = useParams();
    const [senderId, setSenderId] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        if (!sessionUser) {
            navigate('/login');
        } else {
            const user = JSON.parse(sessionUser);
            setUserId(user.userid);
            console.log("User Id: " + user.userid);
            fetch(`http://localhost:5001/get-sender-id/${senderName}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setSenderId(data);
                    console.log("Data: " + data);
                })
                .catch(error => {
                    console.error('Error fetching posts:', error);
                });
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5001/get-posts/${senderId}`)
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
    }, [senderId]);

    const handleView = async (videoId) => {
        navigate(`/Video/${videoId}`)
    };

    return (
        <>
        </>
    );




}

export default groupPost;