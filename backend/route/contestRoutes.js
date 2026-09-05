const express = require('express');
const controller = require('../controller/contestController');

const router = express.Router();

router.get('/user/:userID', controller.getContestsByUser);
router.get('/:contestID/leaderboard', controller.getLeaderboard);
router.get('/:contestID/name', controller.getContestName);

module.exports = router;
