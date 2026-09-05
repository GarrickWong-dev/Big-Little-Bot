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

async function getContestsByUser(req, res) {
  try {
    const contests = await contestService.getContestsByUser(req.params.userID);
    return res.status(200).json({
      success: true,
      contests,
    });
  } catch (error) {
    const message = error.message || 'Something went wrong';

    if (message.includes('userID')) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
  }
}

async function getLeaderboard(req, res) {
  try {
    const leaderboard = await contestService.getLeaderboard(
      req.params.contestID
    );
    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    const message = error.message || 'Something went wrong';

    if (message.includes('contestID')) {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
  }
}

module.exports = {
  getContestName,
  getContestsByUser,
  getLeaderboard,
};
