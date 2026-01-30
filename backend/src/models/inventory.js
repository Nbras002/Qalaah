const pool = require('../config/db');

const Inventory = {
  async getAll() {
    const res = await pool.query('SELECT * FROM inventory ORDER BY id');
    return res.rows;
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM inventory WHERE id = $1', [id]);
    return res.rows[0];
  },
  async update(id, { quantity, min_stock }) {
    const res = await pool.query(
      'UPDATE inventory SET quantity = $1, min_stock = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [quantity, min_stock, id]
    );
    return res.rows[0];
  },
  async set(product_id, branch_id, quantity, min_stock) {
    const res = await pool.query(
      'INSERT INTO inventory (product_id, branch_id, quantity, min_stock, updated_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (product_id, branch_id) DO UPDATE SET quantity = $3, min_stock = $4, updated_at = NOW() RETURNING *',
      [product_id, branch_id, quantity, min_stock]
    );
    return res.rows[0];
  }
};

module.exports = Inventory;
