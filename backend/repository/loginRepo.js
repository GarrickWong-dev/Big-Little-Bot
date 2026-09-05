const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

function findUserByCredentials(username, password) {
    return new Promise((resolve, reject) => {
        if (!username || !password) {
            reject(new Error('Username and password are required'));
            return;
        }

        const query = `
            SELECT userID, username, role
            FROM Users
            WHERE username = ? AND password = ?
        `;

        db.get(query, [username, password], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (!row) {
                reject(new Error('Invalid username or password'));
                return;
            }

            resolve(row);
        });
    });
}

module.exports = {
    findUserByCredentials
};
