const express = require('express');
const Product = require('../models/product');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get all products
router.get('/', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const products = await Product.getAll();
  res.json(products);
});

// Get product by id
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const product = await Product.getById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Create product
router.post('/', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const { name_en, name_ar, sku, price, tax_rate } = req.body;
  const product = await Product.create({ name_en, name_ar, sku, price, tax_rate });
  res.status(201).json(product);
});

// Update product
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const { name_en, name_ar, sku, price, tax_rate } = req.body;
  const product = await Product.update(req.params.id, { name_en, name_ar, sku, price, tax_rate });
  res.json(product);
});

// Delete product
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  await Product.remove(req.params.id);
  res.status(204).end();
});

module.exports = router;
