const pool = require('../config/db');

const Sale = {
  async getAll() {
    const res = await pool.query('SELECT * FROM sales ORDER BY id DESC');
    return res.rows;
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM sales WHERE id = $1', [id]);
    return res.rows[0];
  },
  async create({ branch_id, pos_terminal_id, user_id, customer_id, total, tax, discount, status }) {
    const res = await pool.query(
      'INSERT INTO sales (branch_id, pos_terminal_id, user_id, customer_id, total, tax, discount, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING *',
      [branch_id, pos_terminal_id, user_id, customer_id, total, tax, discount, status]
    );
    return res.rows[0];
  },
  async update(id, { status }) {
    const res = await pool.query(
      'UPDATE sales SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return res.rows[0];
  }
};

module.exports = Sale;
