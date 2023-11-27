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
    authenticateUser(email, password, callback) {
        const query = `
            SELECT password 
            FROM users 
            WHERE email = ?;
        `;
        console.log("Executing query:", query);
        this.db.query(query, [email], (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                const userExists = results.length > 0 && results[0].password === password;
                callback(null, userExists);
            }
        });
    }
    getUserByEmail(email, callback) {
        const query = 'SELECT userid, username, email,role,user_image FROM users WHERE email = ?';
        this.db.query(query, [email], (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                // Check if user is found
                if (results.length > 0) {
                    const user = results[0];
                    callback(null, user);
                } else {
                    callback(new Error('User not found'), null);
                }
            }
        });
    }
}

module.exports = PostDao;
