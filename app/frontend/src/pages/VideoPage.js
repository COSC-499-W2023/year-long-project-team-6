import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "../component/CSS/sidebar_style.css";
import "../component/CSS/videopage.css";
import "../component/CSS/recorded.css";
function VideoPage() {
    const [videoUrl, setVideoUrl] = useState('');
    const { videoId } = useParams();
    const [postId, setPostId] = useState('');
    const [postInfo, setPostInfo] = useState('');

    useEffect(() => {
        const fetchPostInfo = async () => {
            try {
                const response = await fetch(`http://localhost:5001/get-posts-postid/${videoId}`);
                const data = await response.json();
                console.log(data);
                if (response.ok) {
                    setPostInfo(data[0]);
                } else {
                    console.error('Failed to fetch post information:', data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching post information:', error);
            }
        };
        console.log(postInfo);
        fetchPostInfo();
    }, [videoId])
    useEffect(() => {

        const fetchVideoUrl = async () => {
            try {
                const response = await fetch(`http://localhost:5001/get-video-url/${videoId}`);
                const data = await response.json();
                if (response.ok) {
                    setVideoUrl(data.signedUrl); // Set the fetched URL
                } else {
                    console.error('Failed to fetch video URL:', data.error || 'Unknown error');
                }
            } catch (error) {
                console.error('Error fetching video URL:', error);
            }
        };

        fetchVideoUrl();
    }, [videoId]); 

    const handleDownload = (url, id) => {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `video_${id}.mp4`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };


    return (
        <div className="video-container">
            <h1>{postInfo.post_title}</h1>
            <h3>{postInfo.post_text}</h3>
            {videoUrl ? (
                <>
                    <video width="640" controls>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <br />
                    <h4>Notice: If you upload a blurring face video, it needs maximum 5 minutes to be shown in here</h4>
                    <button className="download-btn" onClick={() => handleDownload(videoUrl, videoId)}> Download Video</button>

                </>
            ) : (
                <p>Loading video...</p>
            )}
        </div>
    );
}

export default VideoPage;
