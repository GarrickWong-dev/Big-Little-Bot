const path = require('path'); 
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

async function getMaxSubs(contestID) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT maxSubs
            FROM Contests
            WHERE contestID = ?
        `;
        db.get(query, [contestID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                reject(new Error('Contest not found'));
                return;
            }
            resolve(row.maxSubs);
        });
    });
}

async function getStatus(contestID) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT active
            FROM Contests
            WHERE contestID = ?
        `;
        db.get(query, [contestID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                reject(new Error('Contest not found'));
                return;
            }
            resolve(row.active);
        });
    });
}

async function getContestName(contestID) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT contestName
            FROM Contests
            WHERE contestID = ?
        `;
        db.get(query, [contestID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                reject(new Error('Contest not found'));
                return;
            }
            resolve(row.contestName);
        });
    });
}

module.exports = {
    getMaxSubs,
    getStatus,
    getContestName
};