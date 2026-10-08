const express = require('express');
const router = express.Router();

const authMiddleware = require('./middlewares/auth')

const authRouter = require('./auth');
const usersRouter = require('./users');
const productsRouter = require('./products');
const categoriesRouter = require('./categories');


/* GET home page. */
router.get('/', (req, res, next) => {
  res.json({ success : 'node shop api'});
});

/* GET home page. */
router.get('/user', authMiddleware , (req, res, next) => {
  res.json({ status : 'success' , user : req.user });
});

router.use('/auth' , authRouter);
router.use('/users' , usersRouter);
router.use('/products' , productsRouter);
router.use('/categories' , categoriesRouter);

module.exports = router;
