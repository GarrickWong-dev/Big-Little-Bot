const subsService = require('../service/subsService');

async function getSubmissionsByContest(req, res) {
  try {
    const submissions = await subsService.getSubmissionsByContest(
      req.params.contestID
    );

    return res.status(200).json({
      success: true,
      submissions
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
  getSubmissionsByContest
};
