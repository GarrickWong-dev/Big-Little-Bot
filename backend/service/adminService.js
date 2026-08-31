const adminRepo = require('../repository/adminRepository');

function createContest({ contestName, maxSubs }) {
    return adminRepo.createContest({ contestName, maxSubs });
}

function createUser({ username, password, role }) {
    return adminRepo.createUser({ username, password, role });
}

function changeMaxSubs(contestID, newMaxSubs) {
    return adminRepo.changeMaxSubs(contestID, newMaxSubs);
}

function deleteSubmission(submissionID) {
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
    makeInactive
};
