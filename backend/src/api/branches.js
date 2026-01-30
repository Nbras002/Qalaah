const express = require('express');
const Branch = require('../models/branch');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Get all branches
router.get('/', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const branches = await Branch.getAll();
  res.json(branches);
});

// Get branch by id
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  const branch = await Branch.getById(req.params.id);
  if (!branch) return res.status(404).json({ message: 'Branch not found' });
  res.json(branch);
});

// Create branch
router.post('/', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  const { name, location } = req.body;
  const branch = await Branch.create({ name, location });
  res.status(201).json(branch);
});

// Update branch
router.put('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  const { name, location } = req.body;
  const branch = await Branch.update(req.params.id, { name, location });
  res.json(branch);
});

// Delete branch
router.delete('/:id', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  await Branch.remove(req.params.id);
  res.status(204).end();
});

module.exports = router;
