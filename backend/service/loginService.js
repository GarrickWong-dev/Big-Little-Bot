const loginRepo = require('../repository/loginRepo');

function login(username, password) {
    return loginRepo.findUserByCredentials(username, password);
}

module.exports = {
    login
};
