const path = require('path'); 
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, '../../database/bigLittle.db');
const db = new sqlite3.Database(dbPath);

function addUserAndAdmin(userID, adminID){
    return new Promise((resolve, reject) => {
        if (!userID || !adminID){
            reject(new Error("userID and adminID are required"));
            return;
        }
        const insert = `
        insert into usersAndTheirAdmin (userID, adminID)
        values (?, ?)
        `;
        db.run(insert, [userID, adminID], function(err){
            if (err){
                reject(err);
                return;
            }
            resolve({
                userID,
                adminID
            });
        })
    })  
}

function getUsersByAdmin(adminID){
    return new Promise((resolve, reject) => {
        if (!adminID){
            reject(new Error("adminID is required"));
            return;
        }
        const query = `
        select *
        from usersAndTheirAdmin
        where adminID = ?
        `;
        db.all(query, [adminID], function(err, rows){
            if (err){
                reject(err);
                return;
            }
            resolve(rows);
        })
    })  
}

module.exports = {
    addUserAndAdmin,
    getUsersByAdmin
};