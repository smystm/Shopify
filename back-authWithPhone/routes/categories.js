var express = require('express');
var router = express.Router();
var { getCategories } = require('../app/services/categories');

router.get('/', async (req, res, next) => {
  try {
    const categories = getCategories();
    res.json({ status: 'success', categories });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
