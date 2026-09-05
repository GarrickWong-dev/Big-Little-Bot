const fs = require('fs');
const path = require('path');
const adminRepo = require('../repository/adminRepository');
const uataRepo = require('../repository/uataRepo');
const ctRepo = require('../repository/ctRepo');
const subsRepo = require('../repository/subsRepo');

const picsDir = path.resolve(__dirname, '../../pics');

async function createContest({ contestName, maxSubs, adminID }) {
    const response =  await adminRepo.createContest({ contestName, maxSubs });
    await adminRepo.addOwner(response.contestID, adminID);
    return response;
}

async function createUser({ username, password, role, adminID }) {
    const newUser = await adminRepo.createUser({ username, password, role });
    const userID = newUser.userID;
    await uataRepo.addUserAndAdmin(userID, adminID);
    return newUser;
}

function addToContest({ contestID, userID }) {
    return adminRepo.addToContest(contestID, userID);
}

function changeMaxSubs(contestID, newMaxSubs) {
    return adminRepo.changeMaxSubs(contestID, newMaxSubs);
}

async function deleteSubmission(submissionID) {
    const submission = await subsRepo.getSubmission(submissionID);

    if (!submission) {
        throw new Error('Submission not found');
    }

    await ctRepo.removePoints(submissionID, submission.userID, submission.contestID);

    if (submission.picturePath) {
        const relativePath = submission.picturePath.replace(/^\/pics\//, '');
        const filePath = path.join(picsDir, relativePath);

        try {
            await fs.promises.unlink(filePath);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
    }

    return adminRepo.deleteSubmission(submissionID);
}

function makeActive(contestID) {
    return adminRepo.makeActive(contestID);
}

function makeInactive(contestID) {
    return adminRepo.makeInactive(contestID);
}

module.exports = {
    createContest,
    createUser,
    changeMaxSubs,
    deleteSubmission,
    makeActive,
    makeInactive,
    addToContest
};
