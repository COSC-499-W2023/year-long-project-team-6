import React, { useState, useEffect } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import '../component/CSS/viewannouncement.css';

function ViewAnnouncement() {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const location = useLocation();
    const groupId = location.state?.groupId; 
    const [postTitles, setPostTitles] = useState({});


    console.log("groupid",groupId);
    useEffect(() => {
        fetch(`http://localhost:5001/viewAnnouncement/${groupId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setAnnouncements(data);
            })
            .catch(error => console.error('Error fetching announcements:', error));
    }, [groupId]);
const handleView = (postId) =>{
    navigate(`/Video/${postId}`);
}
    const fetchPostTitle = (postId) => {
        fetch(`http://localhost:5001/post/${postId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPostTitles(prevTitles => ({ ...prevTitles, [postId]: {
                    title: data.post_title,
                    description: data.post_text 
                } }));
            })
            .catch(error => console.error('Error fetching post:', error));
    };
    useEffect(() => {
        announcements.forEach(announcement => {
            if (announcement.attached_post) {
                fetchPostTitle(announcement.attached_post);
            }
        });
    }, [announcements]); // Depend on announcements so this runs when announcements change
    
    
    return (
        <div id='announce'>
            <h2>Announcements</h2>
    {announcements.map((announcement, index) => (
        <table key={index} className='announcetab'>
            <tbody>
                <tr className='announcetitle'>
                    <td>{announcement.title}</td>
                </tr>
                <tr className="announce-date-row">
            <td>{new Date(announcement.announce_date).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        })}</td>
        </tr>
                <tr className='announcedetail'>

                    <td>{announcement.detail}</td>
                </tr>
                <tr>
                <td>

                {announcement.attached_post && postTitles[announcement.attached_post] ? (

                        <div className='announcepost' onClick={() => handleView(announcement.attached_post)}>
                            <b>Attached Post: </b> 
                            <p className='attachposttitle'>{postTitles[announcement.attached_post].title}</p>
                            <p className='attachposttext'>{postTitles[announcement.attached_post].description}</p>
                        </div>
                    ) : ""}
</td>
                </tr>
            </tbody>
        </table>
    ))}
        </div>
    );
}

export default ViewAnnouncement;
