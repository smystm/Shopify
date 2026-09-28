var express = require('express');
var router = express.Router();
var authMiddleware = require('./middlewares/auth');
var productRepo = require('../app/db/repos/product');

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const products = await productRepo.all();
    res.json({ status: 'success', products });
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { productNumber, title } = req.body;

    if (!productNumber || !title) {
      return res.status(400).json({ status: 'fail', message: 'productNumber and title are required' });
    }

    const result = await productRepo.create({ productNumber, title });
    const product = await productRepo.findBy('id', result.id);

    res.status(201).json({ status: 'success', product });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productNumber, title } = req.body;

    if (!productNumber || !title) {
      return res.status(400).json({ status: 'fail', message: 'productNumber and title are required' });
    }

    const existing = await productRepo.findBy('id', id);
    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    await productRepo.update(id, { productNumber, title });
    const product = await productRepo.findBy('id', id);

    res.json({ status: 'success', product });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await productRepo.findBy('id', id);
    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    await productRepo.delete(id);

    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
