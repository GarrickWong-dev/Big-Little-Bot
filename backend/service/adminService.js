const adminRepo = require('../repository/adminRepository');
const ctRepo = require('../repository/ctRepoHelper');
const subsRepo = require('../repository/subsRepoHelper');

function createContest({ contestName, maxSubs }) {
    return adminRepo.createContest({ contestName, maxSubs });
}

function createUser({ username, password, role }) {
    return adminRepo.createUser({ username, password, role });
}

function addToContest({ contestID, teamID }) {
    return adminRepo.addToContest(contestID, teamID);
}

function changeMaxSubs(contestID, newMaxSubs) {
    return adminRepo.changeMaxSubs(contestID, newMaxSubs);
}

async function deleteSubmission(submissionID) {
    const submission = await subsRepo.getSubmission(submissionID);

    if (!submission) {
        throw new Error('Submission not found');
    }

    await ctRepo.removePoints(submissionID, submission.teamID, submission.contestID);
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
