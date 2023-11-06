import React, { useState } from "react";
import "../component/CSS/post.css";
import email_image from "../component/image/email.png"
import exchange from "../component/image/exchange.png"
import password from "../component/image/password.png"
import person from "../component/image/person.png"
import showpw from "../component/image/showpw.png"
import showpw2 from "../component/image/showpw2.png"
import user1 from "../component/image/1.jpg"
import user2 from "../component/image/2.jpg"
import user3 from "../component/image/3.jpg"


function PostPage() {
    const [selectedFile, setSelectedFile] = useState("");
    const [selectedGroup, setSelectedGroup] = useState("");

    function displayFileName(event) {
        const fileName = event.target.files[0].name;
        setSelectedFile(fileName);
    }

    function handleGroupChange(event) {
        setSelectedGroup(event.target.value);
    }

    return (
        <div>
            <div id="send">
                <h2>Send Your Post</h2>
            </div>
            <div className="flex-container">
                <div id="input">
                    <form action="image.php" method="post" enctype="multipart/form-data">
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
                            <tr>
                                <td id="img"><img src={user1} alt="User1" />User1</td>
                                <td id="date">2023/09/09</td>
                            </tr>
                            <tr>
                                <td id="img"><img src={user2} alt="User2" />User2</td>
                                <td id="date">2023/09/09</td>
                            </tr>
                            <tr>
                                <td id="img"><img src={user3} alt="User3" />User3</td>
                                <td id="date">2023/09/09</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PostPage;