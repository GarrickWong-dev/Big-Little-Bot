const adminService = require('../service/adminService');

async function createContest(req, res) {
  try {
    const contest = await adminService.createContest(req.body);
    return res.status(201).json({ success: true, contest });
  } catch (error) {
    const message = error.message || 'Something went wrong';
    if (message.includes('contestName')) {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message });
  }
}

async function createUser(req, res) {
  try {
    const user = await adminService.createUser(req.body);
    return res.status(201).json({ success: true, user });
  } catch (error) {
    const message = error.message || 'Something went wrong';
    if (message.includes('All fields are required') || message.includes('role must')) {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message });
  }
}

async function addToContest(req, res) {
  try {
    const result = await adminService.addToContest(req.body);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    const message = error.message || 'Something went wrong';
    if (message.includes('contestID') || message.includes('teamID')) {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message });
  }
}

async function changeMaxSubs(req, res) {
  try {
    const contestID = req.params.contestID;
    const maxSubs = req.body.maxSubs;
    const result = await adminService.changeMaxSubs(
      contestID,
      maxSubs
    );
    return res.status(200).json({
      success: true,
      result
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

async function deleteSubmission(req, res) {
  try {
    const submissionID = req.params.submissionID;
    const result = await adminService.deleteSubmission(submissionID);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    const message = error.message || 'Something went wrong';
    if (message.includes('submissionID')) {
      return res.status(400).json({ message });
    }
    if (message.includes('not found')) {
      return res.status(404).json({ message });
    }
    return res.status(500).json({ message });
  }
}

async function makeActive(req, res) {
  try {
    const contestID = req.params.contestID;
    const result = await adminService.makeActive(contestID);
    return res.status(200).json({ success: true, result });
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

async function makeInactive(req, res) {
  try {
    const contestID = req.params.contestID;
    const result = await adminService.makeInactive(contestID);
    return res.status(200).json({ success: true, result });
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
  createContest,
  createUser,
  changeMaxSubs,
  deleteSubmission,
  makeActive,
  makeInactive,
  addToContest
};
