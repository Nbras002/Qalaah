const pool = require('../config/db');

const Product = {
  async getAll() {
    const res = await pool.query('SELECT * FROM products ORDER BY id');
    return res.rows;
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return res.rows[0];
  },
  async create({ name_en, name_ar, sku, price, tax_rate }) {
    const res = await pool.query(
      'INSERT INTO products (name_en, name_ar, sku, price, tax_rate, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
      [name_en, name_ar, sku, price, tax_rate]
    );
    return res.rows[0];
  },
  async update(id, { name_en, name_ar, sku, price, tax_rate }) {
    const res = await pool.query(
      'UPDATE products SET name_en = $1, name_ar = $2, sku = $3, price = $4, tax_rate = $5 WHERE id = $6 RETURNING *',
      [name_en, name_ar, sku, price, tax_rate, id]
    );
    return res.rows[0];
  },
  async remove(id) {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Product;
