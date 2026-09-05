const fs = require('fs');
const path = require('path');
const heicConvert = require('heic-convert');
const userService = require('../service/userService');

const uploadDir = path.resolve(__dirname, '../../pics');

fs.mkdirSync(uploadDir, { recursive: true });

async function createSubmission(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Picture is required' });
    }

    let fileBuffer = req.file.buffer;

    const originalExtension = path
      .extname(req.file.originalname)
      .toLowerCase();

    const baseName = path
      .parse(req.file.originalname)
      .name
      .replace(/\s+/g, '_');

    let fileExtension = originalExtension;

    if (originalExtension === '.heic') {
      fileBuffer = await heicConvert({
        buffer: fileBuffer,
        format: 'JPEG',
        quality: 0.9,
      });

      fileExtension = '.jpg';
    }

    const safeFileName =
      `${Date.now()}-${baseName}${fileExtension}`;

    const filePath = path.join(uploadDir, safeFileName);

    await fs.promises.writeFile(filePath, fileBuffer);

    const savedPicturePath = `/pics/${safeFileName}`;

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