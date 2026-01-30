const express = require('express');
const Sale = require('../models/sale');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get all sales
router.get('/', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const sales = await Sale.getAll();
  res.json(sales);
});

// Get sale by id
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const sale = await Sale.getById(req.params.id);
  if (!sale) return res.status(404).json({ message: 'Sale not found' });
  res.json(sale);
});

// Create sale
router.post('/', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const { branch_id, pos_terminal_id, user_id, customer_id, total, tax, discount, status } = req.body;
  const sale = await Sale.create({ branch_id, pos_terminal_id, user_id, customer_id, total, tax, discount, status });
  res.status(201).json(sale);
});

// Update sale status
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const { status } = req.body;
  const sale = await Sale.update(req.params.id, { status });
  res.json(sale);
});

module.exports = router;
