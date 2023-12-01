const mysql = require('mysql');

class recordedDao {

    getPostInfor(userId, callback) {
        const query = `
            SELECT p.userid, p.post_id, p.post_title, p.post_date, p.s3_content_key, p.post_text
            FROM posts p WHERE p.userid = ? 
        `;
        this.db.query(query, [userId], (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    }

    getGroupInfor(callback) {
        const query = `
        SELECT groupid, groupname
        FROM groups;
        `;

        this.db.query(query, (err, results) => {
            callback(err, results);
        });
    }

    deletePost(postId, callback) {
        const query = `
            DELETE FROM posts 
            WHERE post_id = ?
        `;
        db.query(query, [postId], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    editPost(postId, newTitle, newText, callback) {
        const query = `
            UPDATE posts 
            SET post_title = ?, post_text = ?
            WHERE post_id = ?
        `;
        db.query(query, [newTitle, newText, postId], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    addPost(postData, callback) {
        const { user_group_id, s3_content_key, post_text, userid, post_title } = postData;
        const query = `
            INSERT INTO posts (user_group_id, s3_content_key, post_text, userid, post_title)
            VALUES (?, ?, ?, ?, ?)
        `;
        this.db.query(query, [user_group_id, s3_content_key, post_text, userid, post_title], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

}


module.exports = recordedDao;