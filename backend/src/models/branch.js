const pool = require('../config/db');

const Branch = {
  async getAll() {
    const res = await pool.query('SELECT * FROM branches ORDER BY id');
    return res.rows;
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM branches WHERE id = $1', [id]);
    return res.rows[0];
  },
  async create({ name, location }) {
    const res = await pool.query(
      'INSERT INTO branches (name, location, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, location]
    );
    return res.rows[0];
  },
  async update(id, { name, location }) {
    const res = await pool.query(
      'UPDATE branches SET name = $1, location = $2 WHERE id = $3 RETURNING *',
      [name, location, id]
    );
    return res.rows[0];
  },
  async remove(id) {
    await pool.query('DELETE FROM branches WHERE id = $1', [id]);
    return true;
  }
};

module.exports = Branch;
