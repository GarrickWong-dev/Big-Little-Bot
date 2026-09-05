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

function getContestsByUser(userID) {
    return new Promise((resolve, reject) => {
        if (!userID) {
            reject(new Error("userID is required"));
            return;
        }
        const query = `
        SELECT contestID
        FROM ContestTeams
        WHERE userID = ?
        ORDER BY contestID
        `;
        db.all(query, [userID], function(err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows.map((row) => row.contestID));
        });
    });
}

function getLeaderboard(contestID) {
    return new Promise((resolve, reject) => {
        if (!contestID) {
            reject(new Error("contestID is required"));
            return;
        }
        const query = `
        SELECT
            ContestTeams.userID,
            Users.username AS teamName,
            ContestTeams.pointsTotal,
            RANK() OVER (ORDER BY ContestTeams.pointsTotal DESC) AS place
        FROM ContestTeams
        JOIN Users ON Users.userID = ContestTeams.userID
        WHERE ContestTeams.contestID = ?
        ORDER BY ContestTeams.pointsTotal DESC, Users.username ASC
        `;
        db.all(query, [contestID], function(err, rows) {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

module.exports = {
    addPoints,
    removePoints,
    getContestsByUser,
    getLeaderboard
};