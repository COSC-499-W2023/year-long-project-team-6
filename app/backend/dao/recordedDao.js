const mysql = require('mysql');
<<<<<<< HEAD

class recordedDao {
    constructor(db) {
        this.db = db;
    }
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
=======
const db = require('../db/db');



async function getPostInfor(userId, callback) {
    const query = `
            SELECT p.userid, p.post_id, p.post_title, p.post_date, p.post_text
            FROM posts p
            JOIN users u ON u.userid = p.userid
            WHERE u.userid = ?;
        `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.log("DAO: Error - ", err);
            callback(err, null);
        } else {
            console.log("DAO: Results - ", results);
            callback(null, results);
        }
    });
}

async function getGroupInfor(callback) {
    const query = `
>>>>>>> 07fffb993a70f62b8a37adff83105b36f9c6883f
        SELECT groupid, groupname
        FROM groups;
        `;

<<<<<<< HEAD
        this.db.query(query, (err, results) => {
            callback(err, results);
        });
    }

    deletePost(postId, callback) {
        const query = `
            DELETE FROM posts 
            WHERE post_id = ?
        `;
        this.db.query(query, [postId], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

    editPost(postId, newTitle, newText, callback) {
        const query = `
=======
    this.db.query(query, (err, results) => {
        callback(err, results);
    });
}

async function deletePost(postId, callback) {
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

async function editPost(postId, newTitle, newText, callback) {
    const query = `
>>>>>>> 07fffb993a70f62b8a37adff83105b36f9c6883f
            UPDATE posts 
            SET post_title = ?, post_text = ?
            WHERE post_id = ?
        `;
<<<<<<< HEAD
        this.db.query(query, [newTitle, newText, postId], (err, result) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, result);
            }
        });
    }

}


module.exports = recordedDao;
=======
    db.query(query, [newTitle, newText, postId], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
}




module.exports = {
    getPostInfor,
    deletePost,
    editPost
};
>>>>>>> 07fffb993a70f62b8a37adff83105b36f9c6883f
