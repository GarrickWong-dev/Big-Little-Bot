const loginService = require('../service/loginService');

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await loginService.login(username, password);

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    const message = error.message || 'Something went wrong';

    if (message.includes('required') || message.includes('Invalid')) {
      return res.status(401).json({ message });
    }

    return res.status(500).json({ message });
  }
}

module.exports = {
  login
};
