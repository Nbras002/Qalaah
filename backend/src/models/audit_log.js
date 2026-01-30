const pool = require('../config/db');

const AuditLog = {
  async log(user_id, action, entity, entity_id, details) {
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, entity, entity_id, details, created_at) VALUES ($1, $2, $3, $4, $5, NOW())',
      [user_id, action, entity, entity_id, details]
    );
  },
  async getAll() {
    const res = await pool.query('SELECT * FROM audit_logs ORDER BY created_at DESC');
    return res.rows;
  }
};

module.exports = AuditLog;
