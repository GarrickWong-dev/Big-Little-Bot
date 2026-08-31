const path = require('path'); 
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

function countDailySubs(contestID, teamID, submissionDate) {
    return new Promise((resolve, reject) => {
        const countSubs = `
            SELECT COUNT(*) AS submissionCount
            FROM Submissions
            WHERE contestID = ? AND teamID = ? AND DATE(submissionDate) = DATE(?)
        `;
        db.get(countSubs, [contestID, teamID, submissionDate], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row.submissionCount);
        });
    });
}

function getSubmission(submissionID) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT *
            FROM Submissions
            WHERE submissionID = ?
        `;
        db.get(query, [submissionID], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (!row) {
                reject(new Error('Submission not found'));
                return;
            }
            resolve(row);
        });
    });
}

module.exports = {
    countDailySubs,
    getSubmission
};