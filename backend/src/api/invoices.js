const express = require('express');
const { generateUUID, generateInvoiceXML, signInvoice, generateQRCode } = require('../services/zatca');
const pool = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// توليد فاتورة ZATCA
router.post('/generate', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const { sale_id } = req.body;
  const saleRes = await pool.query('SELECT * FROM sales WHERE id = $1', [sale_id]);
  const sale = saleRes.rows[0];
  if (!sale) return res.status(404).json({ message: 'Sale not found' });
  const uuid = generateUUID();
  const invoice = {
    uuid,
    date: sale.created_at,
    seller: 'Qalaah POS',
    buyer: sale.customer_id,
    total: sale.total,
    tax: sale.tax
  };
  const xml = generateInvoiceXML(invoice);
  // مفتاح خاص تجريبي (في الإنتاج يجب أن يكون آمنًا)
  const privateKey = require('fs').readFileSync('zatca_private.pem');
  const signature = signInvoice(xml, privateKey);
  const qr = await generateQRCode(`${uuid}|${sale.total}|${sale.tax}`);
  // تخزين الفاتورة
  await pool.query('INSERT INTO invoices (sale_id, uuid, xml_data, qr_code, digital_signature, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())', [sale_id, uuid, xml, qr, signature, 'generated']);
  res.json({ uuid, xml, qr, signature });
});

// عرض فاتورة
router.get('/:id', authenticateToken, authorizeRoles('Admin', 'Manager', 'Cashier'), async (req, res) => {
  const resDb = await pool.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
  if (!resDb.rows[0]) return res.status(404).json({ message: 'Invoice not found' });
  res.json(resDb.rows[0]);
});

module.exports = router;
