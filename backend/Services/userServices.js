const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { newSubmission } = require('../repository/usersRepository');

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

async function createSubmission({ title, teamID, contestID, submissionDate, points, picturePath }) {
  if (!title || !teamID || !contestID || !submissionDate || points == null || !picturePath) {
    throw new Error('All fields are required');
  }

  const contestSql = `
    SELECT maxSubs
    FROM Contests
    WHERE contestID = ?
  `;

  const contestRow = await new Promise((resolve, reject) => {
    db.get(contestSql, [contestID], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });

  const maxSubs = contestRow.maxSubs;

  if (maxSubs === null) {
    return newSubmission({ title, teamID, contestID, submissionDate, points, picturePath });
  }

  const countSubs = `
    SELECT COUNT(*) AS submissionCount
    FROM Submissions
    WHERE contestID = ? AND teamID = ? AND DATE(submissionDate) = DATE(?)
  `;

  const row = await new Promise((resolve, reject) => {
    db.get(countSubs, [contestID, teamID, submissionDate], (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });

  if (row && row.submissionCount >= maxSubs) {
    throw new Error(`This team has reached the contest limit of ${maxSubs} submissions for today.`);
  }

  return newSubmission({ title, teamID, contestID, submissionDate, points, picturePath });
}

module.exports = {
  createSubmission,
};
