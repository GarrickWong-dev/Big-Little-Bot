const express = require('express');
const controller = require('../controller/adminController');
    
const router = express.Router();

router.post('/contests', controller.createContest);
router.post('/users', controller.createUser);
router.put('/contests/:contestID/maxsubs', controller.changeMaxSubs);
router.delete('/submissions/:submissionID', controller.deleteSubmission);
router.put('/contests/:contestID/activate', controller.makeActive);
router.put('/contests/:contestID/deactivate', controller.makeInactive);

module.exports = router;
