var express = require('express');
var router = express.Router();
var authMiddleware = require('./middlewares/auth');
var userRepo = require('../app/db/repos/user');

/* GET users listing (admin only - requires valid token). */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const users = await userRepo.all();
    res.json({ status: 'success', users });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
