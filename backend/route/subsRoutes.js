const express = require('express');
const controller = require('../controller/subsController');

const router = express.Router();

router.get('/contest/:contestID', controller.getSubmissionsByContest);
router.get('/user/:userID', controller.getSubmissionsByUser);

module.exports = router;
