const contestRepo = require('../repository/contestRepo');
const ctRepo = require('../repository/ctRepo');

async function getContestName(contestID) {
    if (!contestID) {
        throw new Error('contestID is required');
    }

    const name = await contestRepo.getContestName(contestID);
    return name;
}

async function getContestsByUser(userID) {
    if (!userID) {
        throw new Error('userID is required');
    }

    return ctRepo.getContestsByUser(userID);
}

async function getLeaderboard(contestID) {
    if (!contestID) {
        throw new Error('contestID is required');
    }

    return ctRepo.getLeaderboard(contestID);
}
module.exports ={
    getContestName,
    getContestsByUser,
    getLeaderboard
}