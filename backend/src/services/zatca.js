const crypto = require('crypto');
const QRCode = require('qrcode');

function generateUUID() {
  return crypto.randomUUID();
}

function generateInvoiceXML(invoice) {
  // بناء XML مبسط متوافق مع ZATCA (للتجربة فقط)
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <UUID>${invoice.uuid}</UUID>
  <Date>${invoice.date}</Date>
  <Seller>${invoice.seller}</Seller>
  <Buyer>${invoice.buyer}</Buyer>
  <Total>${invoice.total}</Total>
  <Tax>${invoice.tax}</Tax>
</Invoice>`;
}

function signInvoice(xml, privateKey) {
  // توقيع رقمي مبسط (للتجربة فقط)
  const sign = crypto.createSign('SHA256');
  sign.update(xml);
  sign.end();
  return sign.sign(privateKey, 'base64');
}

async function generateQRCode(data) {
  return await QRCode.toDataURL(data);
}

module.exports = {
  generateUUID,
  generateInvoiceXML,
  signInvoice,
  generateQRCode
};
