const express = require('express');
const Inventory = require('../models/inventory');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get all inventory
router.get('/', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const inventory = await Inventory.getAll();
  res.json(inventory);
});

// Get inventory by id
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const item = await Inventory.getById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Inventory not found' });
  res.json(item);
});

// Update inventory
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const { quantity, min_stock } = req.body;
  const item = await Inventory.update(req.params.id, { quantity, min_stock });
  res.json(item);
});

// Set inventory for product/branch
router.post('/set', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const { product_id, branch_id, quantity, min_stock } = req.body;
  const item = await Inventory.set(product_id, branch_id, quantity, min_stock);
  res.status(201).json(item);
});

module.exports = router;
