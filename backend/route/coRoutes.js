const express = require('express');
const controller = require('../controller/coController');

const router = express.Router();

router.get('/contests/:adminID', controller.getContests);

module.exports = router;
