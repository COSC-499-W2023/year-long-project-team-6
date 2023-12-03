import React, { useEffect, useState, useRef } from "react";
import "../component/CSS/post.css";
import email_image from "../component/image/email.png"
import exchange from "../component/image/exchange.png"
import password from "../component/image/password.png"
import person from "../component/image/person.png"
import showpw from "../component/image/showpw.png"
import showpw2 from "../component/image/showpw2.png"
import { initializeWebRTC, cleanupWebRTC } from './webrtc';

function PostPage() {
    const [showWebRTC, setShowWebRTC] = useState(false);
    const [userId, setUserId] = useState(2);
    const [selectedGroup, setSelectedGroup] = useState("");
    const [postHistory, setPostHistory] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const signalingClientRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localView = useRef(null);
    
    const remoteView = useRef(null);

    const channelARN = 'arn:aws:kinesisvideo:us-east-1:466618866658:channel/webrtc-499/1701571372732';
    useEffect(() => {
        fetch(`http://localhost:5001/post-history/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const arr = [];
                for (let i in data) {
                    let o = {};
                    o[i] = data[i];
                    arr.push(o);
                }
                console.log(arr[0].data);
                setPostHistory(arr[0].data);
            })
            .catch(error => console.error('Error fetching post history:', error));
            
        // Cleanup
        return () => {
            cleanupWebRTC(signalingClientRef.current, peerConnectionRef.current);
        };
    }, [userId]);
   
    const handleTogglePlay = async () => {
        console.log('Click - isPlaying:', isPlaying, 'Refs:', localView.current);

        if (!isPlaying) {

            setTimeout(async() => {
                console.log('Click - isPlaying:', isPlaying, 'Refs:', localView.current);
            if (localView.current ) {
                try {
                    const webrtc = await initializeWebRTC(channelARN, localView.current);
                    signalingClientRef.current = webrtc.signalingClient;
                    peerConnectionRef.current = webrtc.peerConnection;
                    setShowWebRTC(true);
                } catch (error) {
                    console.error('Error initializing WebRTC: ', error);
                }
            } else {
                console.log('Refs are not set:', localView.current);
            }},100);
        
        } else {
            cleanupWebRTC(signalingClientRef.current, peerConnectionRef.current);
            signalingClientRef.current = null;
            peerConnectionRef.current = null;
            setShowWebRTC(false);
        }
        setIsPlaying(!isPlaying);
    };
    

    function handleGroupChange(event) {
        setSelectedGroup(event.target.value);
    }

    return (
        <div id='page'>
            <div id="send">
                <h2>Send Your Post</h2>
            </div>
            <div className="flex-container">
                <div id="input">
                    <form action="image.php" method="post" encType="multipart/form-data">
                        <div id="main" className="main">
                        <div id="videoContainer">
                        {isPlaying && (
                    <>
                       <video ref={localView} style={{ width: '640px' }} autoPlay playsInline />

                    </>
                )}
                <button type='button' onClick={handleTogglePlay}>{isPlaying ? 'Stop' : 'Start'}</button>
</div>

                            <div className="EnterText">
                                <legend>Name your new video</legend>
                                <input type="text" id="VName" placeholder="Video Name" name="VName" />
                            </div>

                            <div className="EnterText">
                                <legend>Choose a Group</legend>
                                <select id="GName" name="GName" value={selectedGroup} onChange={handleGroupChange}>
                                    <option value=""></option>
                                    <option value="Sender">Sender</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Professor">Professor</option>
                                </select>
                            </div>

                            <div className="EnterText">
                                <legend>Description of Your Video</legend>
                                <input type="text" id="Description" placeholder="Describe your video" name="description" />
                            </div>
                        </div>

                        <div id="button">
                            <button type="submit" value="Submit" name="submit" id="submit">Submit</button>
                        </div>
                    </form>
                </div>
                <div id="HistroyBar">
                    <table id="histroyTable">
                        <thead>
                            <tr>
                                <td>History</td>
                                <td id="Sort">
                                    <select id="order" name="order">
                                        <option value="Des">Descending</option>
                                        <option value="Asc">Ascending</option>
                                    </select>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {postHistory.map((post, index) => (
                                <tr key={index}>
                                    <td id="img">
                                        {`${post.post_title}`}
                                    </td>
                                    <td id="date">{new Date(post.post_date).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PostPage;