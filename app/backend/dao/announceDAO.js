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

module.exports = { insertAnnouncement };
