const express = require('express');
const multer = require('multer');
const controller = require('../controller/userController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/submissions', upload.single('picture'), controller.createSubmission);
router.get('/:userID/team-name', controller.getTeamName);

module.exports = router;
