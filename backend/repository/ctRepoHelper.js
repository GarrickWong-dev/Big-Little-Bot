const path = require('path'); 
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

function addPoints(contestID, teamID, points) {
    return new Promise((resolve, reject) => {
        if (!contestID || !teamID || points === undefined) {
            reject(new Error("contestID, teamID, and points are required"));
            return;
        }
        const update = `
        UPDATE ContestTeams
        SET pointsTotal = pointsTotal + ?
        WHERE contestID = ? AND teamID = ?
        `;
        db.run(update, [points, contestID, teamID], function(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ contestID, teamID, points });
        });
    });
}

function removePoints(submissionID, teamID, contestID) {
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
        WHERE teamID = ? AND contestID = ?
        `;
        db.run(update, [submissionID, teamID, contestID], function(err) {
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