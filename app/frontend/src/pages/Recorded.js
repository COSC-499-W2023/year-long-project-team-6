import React, { useState } from "react";
import "../component/CSS/recorded.css";
import "../component/CSS/sidebar_style.css"
import user1 from "../component/image/1.jpg"
import user2 from "../component/image/2.jpg"
import user3 from "../component/image/3.jpg"
import addgroup from "../component/image/addgroup.png"
import downloads from "../component/image/downloads.png"
import home from "../component/image/home.png"
import inbox from "../component/image/inbox-64.png"
import likes from "../component/image/likes-64.png"
import post from "../component/image/post.ico"
import setting from "../component/image/settings-3-64.png"

function RecordedPage() {
    const [group, setGroup] = useState('all');
    const [arrangement, setArrangement] = useState('date');

    const confirmDelete = () => {
        const result = window.confirm('Are you sure you want to delete this video?');
        if (result) {
            // Code to delete the video goes here
            alert('Video deleted successfully.');
        }
    };

    const openEditPopup = () => {
        var editPageUrl = "EditPage"; // Replace with the actual URL of your edit page

        // Set the window features (size, position, etc.)
        var popupFeatures = "width=600,height=400,scrollbars=yes";

        // Open the edit page in a new popup window
        window.open(editPageUrl, "Edit Video", popupFeatures);
    };

    return (
        <>
        <div class="topnav">
      <div class="topnav-right">
        <a href="../../login_signup/LS.html">
          login
        </a>
      </div>
    </div>
    <div class="sidebar">
      <ul>
        <li>
          <a href="../../HomePage_UI/Homepage.html">
            <img src={home}/>
          </a>
          <span class="tooltiptext">
            Home
          </span>
        </li>
        <li>
          <a href="#" class="active">
            <img src={downloads}/>
          </a>
          <span class="tooltiptext">
            Recorded
          </span>
        </li>
        <li>
          <a href="../PostPage/post.html">
            <img src={post}/>
          </a>
          <span class="tooltiptext">
            Post
          </span>
        </li>
        <li>
          <a href="#" id="myBtn" class="addgroup">
            <img src={addgroup}/>
          </a>
          <span class="tooltiptext">
            Add Group
          </span>
        </li>
        <div id="myModal" class="modal">
          <div class="modal-content">
            <span class="close">
              &times;
            </span>
            <div class="addgroup">
              <h3>
                Find your group here
              </h3>
              <input type="text" id="searchInput" maxlength="5" placeholder="Enter a 5-character code"
              oninput="this.value = this.value.toUpperCase()"/>
              <button onclick="searchGroup()">
                Search
              </button>
              <p id="resultContainer">
              </p>
            </div>
          </div>
        </div>
        <div class="bot-set">
          <li>
            <a href='#'>
              <img src={setting}/>
              <span class="tooltiptext">
                Setting
              </span>
            </a>
          </li>
        </div>
      </ul>
    </div>
            <div id="condition">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <h3>Group</h3>
                            </td>
                            <td>
                                <h3>Arrange By</h3>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <select id="groupId" name="groupId" value={group} onChange={(e) => setGroup(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="A">GroupA</option>
                                    <option value="B">GroupB</option>
                                </select>
                            </td>
                            <td>
                                <select id="arrange" name="arrange" value={arrangement} onChange={(e) => setArrangement(e.target.value)}>
                                    <option value="date">Date</option>
                                    <option value="asc">Name Ascending</option>
                                    <option value="des">Name Descending</option>
                                </select>
                            </td>
                            <td>
                                <button type="submit" name="apply" id="apply">Apply</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div id="VideoList">
                <table id="videoTable">
                    <thead>
                        <tr>
                            <td className="title">All Videos</td>
                        </tr>
                    </thead>
                    <tbody>
                        {[user1, user2, user3, user1, user2, user3].map((userImg, index) => (
                            <tr key={index}>
                                <td className="img"><img src={userImg} alt={`User ${index + 1}`} /></td>
                                <td className="title" data-description="This is the description of the video.">This is a title</td>
                                <td className="date">2023/09/09</td>
                                <td className="edit">
                                    <button type="button" className="editButton" onClick={openEditPopup}>Edit</button>
                                </td>
                                <td className="delete">
                                    <button type="button" className="deleteButton" onClick={confirmDelete}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default RecordedPage;