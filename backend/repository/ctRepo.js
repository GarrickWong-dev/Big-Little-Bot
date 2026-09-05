const path = require('path'); 
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

function addPoints(contestID, userID, points) {
    return new Promise((resolve, reject) => {
        if (!contestID || !userID || points === undefined) {
            reject(new Error("contestID, userID, and points are required"));
            return;
        }
        const update = `
        UPDATE ContestTeams
        SET pointsTotal = pointsTotal + ?
        WHERE contestID = ? AND userID = ?
        `;
        db.run(update, [points, contestID, userID], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ contestID, userID, points });
        });
    });
}

function removePoints(submissionID, userID, contestID) {
    return new Promise((resolve, reject) => {
        if (!submissionID) {
            reject(new Error("submissionID is required"));
            return;
        }
        const update = `
        UPDATE ContestTeams
        SET pointsTotal = pointsTotal - (
            SELECT points
            FROM Submissions
            WHERE submissionID = ?
        )
        WHERE userID = ? AND contestID = ?
        `;
        db.run(update, [submissionID, userID, contestID], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ submissionID });
        });
    });
}

module.exports = {
    addPoints,
    removePoints
};