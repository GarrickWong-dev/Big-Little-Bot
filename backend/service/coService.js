const coRepo = require('../repository/coRepo');

async function getContests(adminID) {
    if (!adminID) {
        throw new Error('adminID is required');
    }

    const response = await coRepo.getcontest(adminID);
    const contests = response.map(row => row.contestID);
    return contests;
}

module.exports ={
    getContests
}