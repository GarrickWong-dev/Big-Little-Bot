const express = require('express');
const controller = require('../controller/contestController');

const router = express.Router();

router.get('/:contestID/name', controller.getContestName);

module.exports = router;
