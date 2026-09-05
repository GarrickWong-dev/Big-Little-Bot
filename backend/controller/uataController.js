const uataService = require('../service/uataService');

async function getUsersByAdmin(req, res) {
  try {
    const users = await uataService.getUsersByAdmin(req.params.adminID);

    return res.status(200).json({
      success: true,
      users
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
  getUsersByAdmin
};
