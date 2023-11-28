import React, { useState } from "react";
import "../component/CSS/recorded.css";

function EditPage() {
    const [title, setTitle] = useState("This is a video title");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("2023-09-09");

    const updatePost = (event) => {
        event.preventDefault(); // Prevent the default form submit action
        // Perform update action here, such as sending data to a server
        alert("Video updated successfully.");
        // Redirect or close modal depending on your application's flow
    };

    return (
        <div id="main">
            <h1>Edit Video</h1>
            
            <form id="editForm" onSubmit={updatePost}>
                <label htmlFor="videoTitle">Video Title:</label>
                <input 
                    type="text" 
                    id="videoTitle" 
                    name="videoTitle" 
                    placeholder="Enter video title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                /><br /><br />

                <label htmlFor="videoDescription">Video Description:</label><br />
                <textarea 
                    id="videoDescription" 
                    name="videoDescription" 
                    rows="4" 
                    cols="50" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                /><br /><br />

                <label htmlFor="videoDate">Video Date:</label>
                <input 
                    type="date" 
                    id="videoDate" 
                    name="videoDate" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                /><br /><br />

                <button type="submit" id="saveButton">Save Changes</button>
            </form>
        </div>
    );
}

export default EditPage;
