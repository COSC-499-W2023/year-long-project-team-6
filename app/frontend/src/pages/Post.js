import React, { useEffect, useState } from "react";
import "../component/CSS/post.css";
import email_image from "../component/image/email.png"
import exchange from "../component/image/exchange.png"
import password from "../component/image/password.png"
import person from "../component/image/person.png"
import showpw from "../component/image/showpw.png"
import showpw2 from "../component/image/showpw2.png"


function PostPage() {
    const [userId, setUserId] = useState(2);
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");
    const [postHistory, setPostHistory] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/post-history/${userId}`)
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
    }, [userId]);


    function displayFileName(event) {
        const fileName = event.target.files[0].name;
        setSelectedFile(fileName);
    }

    function handleGroupChange(event) {
        setSelectedGroup(event.target.value);
    }
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Formats to 'month/day/year'. Adjust the locale and options as needed.
    };

    return (
        <div id='page'>
            <div id="send">
                <h2>Send Your Post</h2>
            </div>
            <div className="flex-container">
                <div id="input">
                    <form action="image.php" method="post" encType="multipart/form-data">
                        <div id="main" className="main">
                            <div id="choose">
                                <label className="custom-file-upload">
                                    <input
                                        type="file"
                                        name="file"
                                        id="file"
                                        accept="video/*, audio/*"
                                        onChange={displayFileName}
                                    />
                                    Select File
                                </label>
                                <span id="selectedFileName">{selectedFile}</span>

                                <label className="custom-file-upload">
                                    <input
                                        type="file"
                                        name="file"
                                        id="file"
                                        accept="video/*, audio/*"
                                        onChange={displayFileName}
                                    />
                                    Record Your Video
                                </label>
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