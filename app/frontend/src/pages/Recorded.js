import React, { useState, useEffect } from 'react';
import "../component/CSS/recorded.css";
import "../component/CSS/sidebar_style.css";

function RecordedPage() {
    const [userId, setUserId] = useState('2');
    const [group, setGroup] = useState('all');
    const [arrangement, setArrangement] = useState('date');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/get-posts/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched data:', data); 
                setPosts(data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, [userId]);
    

    const handleDelete = (postId) => {
        fetch(`http://localhost:5000/delete-post/${postId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error in deleting post');
                }
                return response.json();
            })
            .then(() => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(error => console.error('Error:', error));
    };

    const handleEdit = (postId, newTitle, newText) => {
        const postData = { title: newTitle, text: newText };
        fetch(`http://localhost:5000/edit-post/${postId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error in editing post');
                }
                return response.json();
            })
            .then(() => {
                setPosts(posts.map(post => post.id === postId ? { ...post, ...postData } : post));
            })
            .catch(error => console.error('Error:', error));
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Formats to 'month/day/year'. Adjust the locale and options as needed.
    };

    return (
        <>
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
                                <select name="group" value={group} onChange={(e) => setGroup(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="group1">Group 1</option>
                                    <option value="group2">Group 2</option>
                                </select>
                            </td>
                            <td>
                                <select name="arrange" value={arrangement} onChange={(e) => setArrangement(e.target.value)}>
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
                        {posts.map((post) => (
                            <tr key={post.post_id}>
                                <td className="title" data-description={post.post_text}>
                                    {post.post_title}
                                </td>
                                <td>{formatDate(post.post_date)}</td>
                                <td>
                                    <button className='editButton' onClick={() => handleEdit(post.post_id)}>Edit</button>
                                    <button className='deleteButton' onClick={() => handleDelete(post.post_id)}>Delete</button>
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
