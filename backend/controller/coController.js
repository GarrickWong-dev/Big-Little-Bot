const coService = require('../service/coService');

async function getContests(req, res) {
  try {
    const contests = await coService.getContests(req.params.adminID);
    return res.status(200).json({
      success: true,
      contests,
    });
  } catch (error) {
    const message = error.message || 'Something went wrong';

    if (message.includes('adminID')) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
  }
}

module.exports = {
  getContests,
};
