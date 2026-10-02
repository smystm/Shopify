var express = require('express');
var router = express.Router();
var authMiddleware = require('./middlewares/auth');
var productRepo = require('../app/db/repos/product');
const { canViewProducts, canCreateProducts, canModifyProduct } = require('../app/services/permissions');

router.get('/', authMiddleware, async (req, res, next) => {
  try {
    // Only users with some product access can list products.
    if (!canViewProducts(req.user.permission)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to view products' });
    }

    const products = await productRepo.all();
    res.json({ status: 'success', products });
  } catch (err) {
    next(err);
  }
});

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Only FullAcc and WriteDeleteEditSelfAdds users can add products.
    if (!canCreateProducts(req.user.permission)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to create products' });
    }

    const { productNumber, title, desc, category, price } = req.body;

    if (!productNumber || !title) {
      return res.status(400).json({ status: 'fail', message: 'productNumber and title are required' });
    }

    // Store the creator so self-add users can edit/delete their own products later.
    const result = await productRepo.create({ productNumber, title, desc, category, price, created_by: req.user.id });
    const product = await productRepo.findBy('id', result.id);

    res.status(201).json({ status: 'success', product });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { productNumber, title, desc, category, price } = req.body;

    if (!productNumber || !title) {
      return res.status(400).json({ status: 'fail', message: 'productNumber and title are required' });
    }

    const existing = await productRepo.findBy('id', id);
    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    if (!canModifyProduct(req.user.permission, req.user, existing)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to edit this product' });
    }

    await productRepo.update(id, { productNumber, title, desc, category, price });
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

    if (!canModifyProduct(req.user.permission, req.user, existing)) {
      return res.status(403).json({ status: 'fail', message: 'You do not have permission to delete this product' });
    }

    await productRepo.delete(id);

    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
