const mysql = require('mysql');
const db = require('../db/db');



async function getPostInfor(userId, sort, groupId, callback) {
    let orderBy = '';
    if (sort === 'date_asc') {
        orderBy = 'ORDER BY p.post_date ASC';
    } else if (sort === 'date_desc') {
        orderBy = 'ORDER BY p.post_date DESC';
    } else if (sort === 'name_asc') {
        orderBy = 'ORDER BY p.post_title ASC';
    } else if (sort === 'name_desc') {
        orderBy = 'ORDER BY p.post_title DESC';
    }

    let groupFilter = '';
    // if group filter not selected, then no groupId. 
    let parameters = [userId];
    if (groupId && groupId !== 'all') {
        groupFilter = 'AND groupid = ?';
        parameters = [userId, groupId];
    }

    const query = `
        SELECT p.userid, p.post_id, p.post_title, p.post_date, p.post_text
        FROM posts p
        JOIN users u ON u.userid = p.userid
        WHERE u.userid = ? ${groupFilter}
        ${orderBy};
    `;

    db.query(query, parameters, (err, results) => {
        if (err) {
            console.log("DAO: Error - ", err);
            callback(err, null);
        } else {
            console.log("DAO: Results - ", results);
            callback(null, results);
        }
    });
}


async function getGroupInfor(userId, callback) {
    const query = `
        SELECT g.groupid, g.groupname
        FROM \`groups\` g
        JOIN user_groups ug ON g.groupid = ug.groupid
        WHERE ug.userid = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.log("DAO: Error in getGroupInfor - ", err);
            callback(err, null);
        } else {
            console.log("DAO: Group Info Results - ", results);
            callback(null, results);
        }
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

async function getPostByPostId(postId, callback) {
    const query = `
        SELECT p.userid, p.post_id, p.post_title, p.post_date, p.post_text
        FROM posts p
        WHERE p.post_id = ?
        `;
    db.query(query, [postId], (err, result) => {
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
    editPost,
    getPostByPostId,
    getGroupInfor
};