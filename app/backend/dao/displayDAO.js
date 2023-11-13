const mysql = require('mysql');

class PostDao {
    constructor(db) {
        this.db = db;
    }

    getUsernameAndPostDate(callback) {
        const query = `
            SELECT u.username, p.post_date 
            FROM users u 
            JOIN posts p ON u.userid = p.userid;
        `;

        this.db.query(query, (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = PostDao;
