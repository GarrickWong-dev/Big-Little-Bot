const contestService = require('../service/contestService');

async function getContestName(req, res) {
  try {
    const contestName = await contestService.getContestName(
      req.params.contestID
    );

    return res.status(200).json({
      success: true,
      contestName,
    });
  } catch (error) {
    const message = error.message || 'Something went wrong';

    if (message.includes('contestID')) {
      return res.status(400).json({ message });
    }

    if (message.includes('not found')) {
      return res.status(404).json({ message });
    }

    return res.status(500).json({ message });
  }
}

module.exports = {
  getContestName,
};
