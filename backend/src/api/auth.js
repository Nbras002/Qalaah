const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByUsername(username);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await User.validatePassword(user, password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const role = await Role.getById(user.role_id);
  const token = jwt.sign({ id: user.id, role: role.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, username: user.username, role: role.name } });
});

module.exports = router;
