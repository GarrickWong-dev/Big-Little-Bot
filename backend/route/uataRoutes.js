const express = require('express');
const controller = require('../controller/uataController');

const router = express.Router();

router.get('/users/:adminID', controller.getUsersByAdmin);

module.exports = router;
