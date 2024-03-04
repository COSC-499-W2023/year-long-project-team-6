const db = require('../db/db');

function insertAnnouncement(announcer, groupId, title, detail, attachedPost, callback) {
    const sql = `
      INSERT INTO announcement (announcer, groupid, title, detail, attached_post)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [announcer, groupId, title, detail, attachedPost];


    db.query(sql, params, (error, result) => {
        if (error) {
            console.error('Error inserting announcement:', error);
            callback(error, null); 
        } else {
            console.log('Announcement inserted successfully');
            callback(null, result); 
        }
    });
}
function getAnnouncements(groupId, callback) {
    const sql = 'SELECT * FROM announcement WHERE groupid = ?';

    db.query(sql, [groupId], (error, results) => {
        if (error) {
            console.error('Error fetching announcements for group:', groupId, error);
            callback(error, null);
        } else {
            console.log('Announcements fetched successfully for group:', groupId);
            callback(null, results);
        }
    });
}
function getPostById(postId, callback) {
    const sql = 'SELECT * FROM posts WHERE post_id = ?';

    db.query(sql, [postId], (error, results) => {
        if (error) {
            console.error('Error fetching post:', error);
            callback(error, null);
        } else {
            console.log('Post fetched successfully');
            callback(null, results[0]); // Assuming post_id is unique and only one record should be returned
        }
    });
}

module.exports = { getAnnouncements,insertAnnouncement,getPostById };

