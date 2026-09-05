const path = require('path'); //Imports path module, this is a default module in nodeJS
const sqlite3 = require('sqlite3').verbose(); //Imports SQLite module

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db'); // gives dbPath the relative path to the "bigLittle.db" data base
const db = new sqlite3.Database(dbPath); //Create a connection to the database and stores it in the variable db

function newSubmission({title, userID, contestID, submissionDate, points, picturePath}){
  return new Promise((resolve, reject) => {
    if (!title || !userID || !contestID || !submissionDate || points == null || !picturePath){
      reject(new Error("All fields are required"));
      return;
    }
    const insert = `
    INSERT INTO Submissions (title, userID, contestID, submissionDate, points, picturePath)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(insert, [title, userID, contestID, submissionDate, points, picturePath], function(err){
      if (err){
        reject(err);
        return;
      }
      resolve({
        submissionID: this.lastID,
        title,
        userID,
        contestID,
        submissionDate,
        points,
        picturePath
      });
    })
  })
}

function getTeamName(userID){
  return new Promise((resolve, reject) => {
    const query = `
      SELECT username AS teamName
      FROM Users
      WHERE userID = ?
    `;
    db.get(query, [userID], (err, row) => {
      if (err){
        reject(err);
        return;
      }
      if (!row){
        reject(new Error('User not found'));
        return;
      }
      resolve(row.teamName);
    });
  });
}

module.exports = {
  newSubmission,
  getTeamName
}