const pool = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async findByUsername(username) {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return res.rows[0];
  },
  async create({ username, password, role_id }) {
    const hash = await bcrypt.hash(password, 10);
    const res = await pool.query(
      'INSERT INTO users (username, password_hash, role_id, is_active, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [username, hash, role_id, true]
    );
    return res.rows[0];
  },
  async validatePassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  }
};

module.exports = User;
