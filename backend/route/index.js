const express = require('express');
const coRoutes = require('./coRoutes');
const contestRoutes = require('./contestRoutes');
const adminRoutes = require('./adminRoutes');
const loginRoutes = require('./loginRoutes');
const subsRoutes = require('./subsRoutes');
const uataRoutes = require('./uataRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/admin', adminRoutes);
router.use('/login', loginRoutes);
router.use('/co', coRoutes);
router.use('/contest', contestRoutes);
router.use('/subs', subsRoutes);
router.use('/uata', uataRoutes);
router.use('/user', userRoutes);

module.exports = router;
