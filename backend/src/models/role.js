const pool = require('../config/db');

const Role = {
  async findByName(name) {
    const res = await pool.query('SELECT * FROM roles WHERE name = $1', [name]);
    return res.rows[0];
  },
  async getById(id) {
    const res = await pool.query('SELECT * FROM roles WHERE id = $1', [id]);
    return res.rows[0];
  }
};

module.exports = Role;
