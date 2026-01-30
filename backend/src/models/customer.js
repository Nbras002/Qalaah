const pool = require('../config/db');

const Customer = {
  async getAll() {
    const res = await pool.query('SELECT * FROM customers ORDER BY id');
    return res.rows;
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    return res.rows[0];
  },
  async create({ name, phone, email }) {
    const res = await pool.query(
      'INSERT INTO customers (name, phone, email, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [name, phone, email]
    );
    return res.rows[0];
  },
  async update(id, { name, phone, email }) {
    const res = await pool.query(
      'UPDATE customers SET name = $1, phone = $2, email = $3 WHERE id = $4 RETURNING *',
      [name, phone, email, id]
    );
    return res.rows[0];
  },
  async remove(id) {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Customer;
