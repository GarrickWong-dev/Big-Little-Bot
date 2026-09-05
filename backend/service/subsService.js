const subsRepo = require('../repository/subsRepo');

function getSubmissionsByContest(contestID) {
    if (!contestID) {
        throw new Error('contestID is required');
    }

    return subsRepo.getSubmissionsByContest(contestID);
}

module.exports = {
    getSubmissionsByContest
};
