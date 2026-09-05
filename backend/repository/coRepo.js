const path = require('path'); 
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

function getcontest(adminID) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT contestID
            FROM ContestOwners
            WHERE userID = ?
        `;
        db.all(query, [adminID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                reject(new Error('Contest not found or user is not an owner'));
                return;
            }
            resolve(row);
        });
    });
}

module.exports = {
    getcontest
};