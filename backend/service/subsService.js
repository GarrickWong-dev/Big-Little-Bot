const subsRepo = require('../repository/subsRepo');

function getSubmissionsByContest(contestID) {
    if (!contestID) {
        throw new Error('contestID is required');
    }

    return subsRepo.getSubmissionsByContest(contestID);
}

function getSubmissionsByUser(userID) {
    if (!userID) {
        throw new Error('userID is required');
    }

    return subsRepo.getSubmissionsByUser(userID);
}

module.exports = {
    getSubmissionsByContest,
    getSubmissionsByUser
};
