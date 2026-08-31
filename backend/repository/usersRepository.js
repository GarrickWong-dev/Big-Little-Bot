const path = require('path'); //Imports path module, this is a default module in nodeJS
const sqlite3 = require('sqlite3').verbose(); //Imports SQLite module

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db'); // gives dbPath the relative path to the "bigLittle.db" data base
const db = new sqlite3.Database(dbPath); //Create a connection to the database and stores it in the variable db

function newSubmission({title, teamID, contestID, submissionDate, points, picturePath}){
  return new Promise((resolve, reject) => {
    if (!title || !teamID || !contestID || !submissionDate || points == null || !picturePath){
      reject(new Error("All fields are required"));
      return;
    }
    const insert = `
    INSERT INTO Submissions (title, teamID, contestID, submissionDate, points, picturePath) 
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(insert, [title, teamID, contestID, submissionDate, points, picturePath], function(err){
      if (err){
        reject(err);
        return;
      }
      resolve({
        submissionID: this.lastID,
        title,
        teamID,
        contestID,
        submissionDate,
        points,
        picturePath
      });
    })
  })
}

module.exports = {
  newSubmission
}