const uataRepo = require('../repository/uataRepo');

function getUsersByAdmin(adminID) {
    if (!adminID) {
        throw new Error('adminID is required');
    }

    return uataRepo.getUsersByAdmin(adminID);
}

module.exports = {
    getUsersByAdmin
};
