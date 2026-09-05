const contestRepo = require('../repository/contestRepo');

async function getContestName(contestID) {
    if (!contestID) {
        throw new Error('contestID is required');
    }

    const name = await contestRepo.getContestName(contestID);
    return name;
}
module.exports ={
    getContestName
}