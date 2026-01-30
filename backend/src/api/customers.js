const express = require('express');
const Customer = require('../models/customer');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get all customers
router.get('/', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const customers = await Customer.getAll();
  res.json(customers);
});

// Get customer by id
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const customer = await Customer.getById(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
});

// Create customer
router.post('/', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const { name, phone, email } = req.body;
  const customer = await Customer.create({ name, phone, email });
  res.status(201).json(customer);
});

// Update customer
router.put('/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const { name, phone, email } = req.body;
  const customer = await Customer.update(req.params.id, { name, phone, email });
  res.json(customer);
});

// Delete customer
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  await Customer.remove(req.params.id);
  res.status(204).end();
});

module.exports = router;
