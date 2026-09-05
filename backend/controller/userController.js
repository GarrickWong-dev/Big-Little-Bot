const fs = require('fs');
const path = require('path');
const userService = require('../service/userService');

const uploadDir = path.resolve(__dirname, '../../pics');

fs.mkdirSync(uploadDir, { recursive: true });

async function createSubmission(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Picture is required' });
    }

    const safeFileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, safeFileName);

    await fs.promises.writeFile(filePath, req.file.buffer);

    const savedPicturePath = `/pics/${safeFileName}`; //IMPORTANT FOR LATER: PATHS ARE RELATIVE

    const payload = {
      ...req.body,
      picturePath: savedPicturePath,
    };

    const submission = await userService.createSubmission(payload);

    return res.status(201).json({
      success: true,
      submission,
    });
  } catch (error) {
    const message = error.message || 'Something went wrong';

    if (message === 'All fields are required') {
      return res.status(400).json({ message });
    }

    if (message === 'This contest is not active.') {
      return res.status(403).json({ message });
    }

    if (message.includes('contest limit')) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
  }
}

async function getTeamName(req, res) {
  try {
    const teamName = await userService.getTeamName(req.params.userID);
    return res.status(200).json({
      success: true,
      teamName,
    });
  } catch (error) {
    const message = error.message || 'Something went wrong';

    if (message.includes('userID')) {
      return res.status(400).json({ message });
    }

    if (message.includes('not found')) {
      return res.status(404).json({ message });
    }

    return res.status(500).json({ message });
  }
}

module.exports = {
  createSubmission,
  getTeamName,
};
