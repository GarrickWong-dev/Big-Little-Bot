const path = require('path'); 
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

function createContest({contestName, maxSubs}){
    return new Promise((resolve, reject) => {
        if (!contestName){ 
            reject(new Error("contestName is required"));
            return;
        }
        const insert = `
        INSERT INTO Contests (contestName, maxSubs) 
        VALUES (?, ?)
        `;
        
        db.run(insert, [contestName, maxSubs], function (err){
            if (err){
                reject(err);
                return;
            }
            const contestID = this.lastID;
            resolve({
                contestName,
                contestID,
                maxSubs
            })
        })
    })
}

function createUser({username, password, role}){
    return new Promise((resolve, reject) => {
        if (!username || !password || !role){
            reject(new Error("All fields are required"));
            return;
        }
        if (role !== 'admin' && role !== 'user' && role !== 'garrick'){
            reject(new Error("role must be either 'admin', 'user', or 'garrick'"));
            return;
        }
        const insert = `
        INSERT INTO Users (username, password, role)
        VALUES (?, ?, ?)
        `;
        db.run(insert, [username, password, role], function(err){
            if (err){
                reject(err);
                return;
            }
            const userID = this.lastID;
            resolve({
                username,
                role,
                userID
            });
        })
    })
}

function addToContest(contestID, userID){
    return new Promise((resolve, reject) => {
        if (!contestID || !userID){
            reject(new Error("contestID and userID are required"));
            return;
        }
        const insert = `
        INSERT INTO ContestTeams (contestID, userID)
        VALUES (?, ?)
        `;
        db.run(insert, [contestID, userID], function(err){
            if (err){
                reject(err);
                return;
            }
            resolve({
                contestID,
                userID
            });
        })
    })
}

function changeMaxSubs(contestID, maxSubs){
    return new Promise((resolve, reject) => {
        if (!contestID){
            reject(new Error("contestID is required"));
            return;
        }
        const update = `
        UPDATE Contests
        SET maxSubs = ?
        WHERE contestID = ?
        `;
        db.run(update, [maxSubs, contestID], function(err){
            if (err){
                reject(err);
                return;
            }
            if (this.changes === 0) {
                reject(new Error("Contest not found"));
                return;
            }
            resolve({
                contestID,
                maxSubs
            });
        })
    })
}

function deleteSubmission(submissionID){
    return new Promise((resolve, reject) => {
        if (!submissionID){
            reject(new Error("submissionID is required"));
            return;
        }
        const del = `
        DELETE FROM Submissions
        WHERE submissionID = ?
        `;
        db.run(del, [submissionID], function(err){
            if (err){
                reject(err);
                return;
            }
            if (this.changes === 0) {
                reject(new Error("Submission not found"));
                return;
            }
            resolve({
                submissionID
            });
        })
    })
}

function makeActive(contestID){
    return new Promise((resolve, reject) => {
        if (!contestID){
            reject(new Error("contestID is required"));
            return;
        }
        const update = `
        UPDATE Contests
        SET active = TRUE
        WHERE contestID = ?
        `;
        db.run(update, [contestID], function(err){
            if (err){
                reject(err);
                return;
            }
            if (this.changes === 0) {
                reject(new Error("Contest not found"));
                return;
            }
            resolve({
                contestID,
                active: true
            });
        }
    )
    })
}

function makeInactive(contestID){
    return new Promise((resolve, reject) => {
        if (!contestID){
            reject(new Error("contestID is required"));
            return;
        }
        const update = `
        UPDATE Contests
        SET active = FALSE
        WHERE contestID = ?
        `;
        db.run(update, [contestID], function(err){
            if (err){
                reject(err);
                return;
            }
            if (this.changes === 0) {
                reject(new Error("Contest not found"));
                return;
            }
            resolve({
                contestID,
                active: false
            });
        }
    )
    })
}

module.exports = {
    createContest,
    changeMaxSubs,
    createUser,
    deleteSubmission,
    makeActive,
    makeInactive,
    addToContest
};
