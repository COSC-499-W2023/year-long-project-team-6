import React, { useEffect, useState, useRef } from "react";
import "../component/CSS/post.css";
import { useNavigate } from "react-router-dom";
import { initializeWebRTC, cleanupWebRTC } from './webrtc';
import { uploadVideo } from './webrtc';

function PostPage() {
    const [showWebRTC, setShowWebRTC] = useState(false);
    const [userId, setUserId] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [postHistory, setPostHistory] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const signalingClientRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localView = useRef(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const navigate = useNavigate();
    const [isRecordingStopped, setIsRecordingStopped] = useState(false);
    const [recordedVideo, setRecordedVideo] = useState(null);
    const [blurFace, setBlurFace] = useState(false);


    const channelARN = 'arn:aws:kinesisvideo:us-east-1:466618866658:channel/webrtc-499/1701571372732';
    useEffect(() => {
        const sessionUser = sessionStorage.getItem('user');
        console.log("Sessopm User: " + sessionUser);
        if (!sessionUser) {
            navigate('/login');
        } else {
            const user = JSON.parse(sessionUser);
            setUserId(user.userid);
            console.log("User Id: " + user.userid);
        }
    }, []);

    useEffect(() => {
        if (userId) {
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
        }
    }, [userId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        let videoKey = '';

        if (recordedVideo) {
            try {
                const uploadResult = await uploadVideo(recordedVideo, formData.get('post_title'));
                console.log('Video uploaded successfully:', uploadResult);
                videoKey = uploadResult.key;
            } catch (uploadError) {
                console.error('Failed to upload video:', uploadError);
                return; // Stop the submission if the upload fails
            }
        }
        const postData = {
            post_title: formData.get('post_title'),
            post_text: formData.get('post_text'),
            s3_content_key: videoKey,
            userid: userId,
            blurFace: blurFace

        };


        console.log("postData to be sent:", postData); // Add this line for debugging

        fetch('http://localhost:5001/add-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('Success:', data);
                navigate('/');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleSortChange = (event) => {
        const sortOrder = event.target.value;
        setPostHistory(prevHistory => {
            return [...prevHistory].sort((a, b) => {
                const dateA = new Date(a.post_date);
                const dateB = new Date(b.post_date);
                return sortOrder === 'Asc' ? dateA - dateB : dateB - dateA;
            });
        });
    };

    useEffect(() => {
        console.log('recordedChunks updated:', recordedChunks);
    }, [recordedChunks]);
    // Temporary array to hold recorded chunks, outside of the function
    let tempRecordedChunks = [];

    const handleTogglePlay = async () => {
        console.log('Click - isPlaying:', isPlaying, 'Refs:', localView.current);

        if (!isPlaying) {
            setTimeout(async () => {
                if (localView.current) {
                    try {
                        const webrtc = await initializeWebRTC(channelARN, localView.current);
                        signalingClientRef.current = webrtc.signalingClient;
                        peerConnectionRef.current = webrtc.peerConnection;

                        // Initialize MediaRecorder here
                        const stream = localView.current.srcObject; // Assuming this is your local stream
                        console.log('stream', stream);

                        const recorder = new MediaRecorder(stream);
                        setMediaRecorder(recorder);

                        recorder.ondataavailable = (event) => {
                            if (event.data.size > 0) {
                                tempRecordedChunks.push(event.data);
                            }
                        };

                        recorder.onstop = async () => {
                            const blob = new Blob(tempRecordedChunks, { type: 'video/webm' });
                            setRecordedVideo(blob); // Assuming you have a state called recordedVideo
                            tempRecordedChunks = [];
                        };


                        setShowWebRTC(true);
                        recorder.start();

                    } catch (error) {
                        console.error('Error initializing WebRTC: ', error);
                    }
                } else {
                    console.log('Refs are not set:', localView.current);
                }
            }, 100);
        } else {
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
            cleanupWebRTC(signalingClientRef.current, peerConnectionRef.current);
            signalingClientRef.current = null;
            peerConnectionRef.current = null;
            setShowWebRTC(false);
        }
        setIsPlaying(!isPlaying);
    };
    const handleClear = () => {
        // Reset form fields
        document.getElementById("postform").reset(); // Replace "yourFormId" with the actual ID of your form
    
        // Stop recording if it's in progress
        if (isPlaying && mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }
    
        // Reset all relevant states to their initial values
        setShowWebRTC(false);
        setIsPlaying(false);
        setIsRecordingStopped(false);
        setRecordedVideo(null);
        setBlurFace(false);
    
        // Cleanup WebRTC if needed
        if (signalingClientRef.current || peerConnectionRef.current) {
            cleanupWebRTC(signalingClientRef.current, peerConnectionRef.current);
            signalingClientRef.current = null;
            peerConnectionRef.current = null;
        }
    
        // Clear recorded video URL to avoid memory leaks
        if (recordedVideo) {
            URL.revokeObjectURL(recordedVideo);
        }
    };
    function handleGroupChange(event) {
        setSelectedGroup(event.target.value);
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };
    return (
        <div id='page'>
            <div id="send">
                <h2>Send Your Post </h2>
            </div>
            <div className="flex-container">
                <div id="input">
                    <form onSubmit={handleSubmit} id="postform">
                        <div id="main" className="main">
                            <div id="videoContainer">
                                {isPlaying && (
                                    <>
                                        <video ref={localView} style={{ width: '640px'}} autoPlay playsInline />

                                    </>
                                )}
                               

                                {recordedVideo ? (
                                <div>
                                <video style={{ width: '640px'}} controls>
                                <source src={URL.createObjectURL(recordedVideo)} type="video/webm" />
                                 </video>
                            </div>
                            ) : (
                                <button id="record_button" type='button' onClick={handleTogglePlay}>{isPlaying ? 'Stop' : 'Start Recording'}</button>
                            )}


                            </div>

                            <div className="EnterText" id="text_one">
                                <legend>Name your new video</legend>
                                <input type="text" id="VName" placeholder="Video Name" name="post_title" />
                            </div>
                            {/*
                            <div className="EnterText">
                                <legend>Choose a Group</legend>
                                <select id="GName" name="GName" value={selectedGroup} onChange={handleGroupChange}>
                                    <option value=""></option>
                                    <option value="Sender">Sender</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Professor">Professor</option>
                                </select>
                            </div>
                        */}
                            <div className="EnterText" id="text_two">
                                <legend>Description of Your Video</legend>
                                <input type="text" id="Description" placeholder="Describe your video" name="post_text" />
                            </div>
                        </div>
                        <div className="blur">
                                <legend>
                                    BlurFace  
                                </legend>   
                                <input
                                    type="checkbox"
                                     id="blurFace"
                                     checked={blurFace}
                                     onChange={(e) => setBlurFace(e.target.checked)}
                                    />
                            </div>
                            <button type="submit" value="Submit" name="submit" id="submit">Submit</button>
                            <button type="button" onClick={handleClear} id="submit">Clear</button>

                    </form>
                </div>
                <div id="HistroyBar">
                    <table id="histroyTable">
                        <thead>
                            <tr>
                                <td>History</td>
                                <td id="Sort">
                                    <select id="order" name="order" onChange={handleSortChange}>
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
                                    <td id="date">{formatDate(post.post_date)}</td>
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