import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderSales(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="sales-container">
      <div class="sales-header">
        <h2>${getTranslation('sales', lang)}</h2>
        <button id="add-sale-btn" class="button">${getTranslation('addSale', lang)}</button>
        <input type="text" id="search-sale" placeholder="${getTranslation('search', lang)}..." />
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div id="sales-table-wrapper"></div>
      <div id="sale-modal" class="modal" style="display:none;"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderSales(container);
  };
  document.getElementById('add-sale-btn').onclick = () => showSaleModal();
  document.getElementById('search-sale').oninput = (e) => renderSalesTable(e.target.value);
  renderSalesTable();
}

async function renderSalesTable(search = '') {
  const lang = getCurrentLang();
  const res = await fetch('/api/sales', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  let sales = await res.json();
  if (search) {
    sales = sales.filter(s => (s.id + '' + s.status).toLowerCase().includes(search.toLowerCase()));
  }
  const table = `
    <table class="sales-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>${getTranslation('branch', lang)}</th>
          <th>${getTranslation('customer', lang)}</th>
          <th>${getTranslation('total', lang)}</th>
          <th>${getTranslation('tax', lang)}</th>
          <th>${getTranslation('discount', lang)}</th>
          <th>${getTranslation('status', lang)}</th>
          <th>${getTranslation('actions', lang)}</th>
        </tr>
      </thead>
      <tbody>
        ${sales.map(s => `
          <tr>
            <td>${s.id}</td>
            <td>${s.branch_id}</td>
            <td>${s.customer_id}</td>
            <td>${s.total}</td>
            <td>${s.tax}</td>
            <td>${s.discount}</td>
            <td>${s.status}</td>
            <td>
              <button onclick="window.editSale(${s.id})">${getTranslation('edit', lang)}</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('sales-table-wrapper').innerHTML = table;
  window.editSale = showSaleModal;
}

function showSaleModal(id = null) {
  // سيتم لاحقًا جلب بيانات البيع للتعديل أو إضافة بيع جديد
  const lang = getCurrentLang();
  const modal = document.getElementById('sale-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>${id ? getTranslation('editSale', lang) : getTranslation('addSale', lang)}</h3>
      <form id="sale-form">
        <input type="hidden" id="sale-id" value="${id || ''}" />
        <div class="input-group">
          <label>${getTranslation('branch', lang)}</label>
          <input type="number" id="sale-branch-id" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('customer', lang)}</label>
          <input type="number" id="sale-customer-id" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('total', lang)}</label>
          <input type="number" id="sale-total" step="0.01" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('tax', lang)}</label>
          <input type="number" id="sale-tax" step="0.01" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('discount', lang)}</label>
          <input type="number" id="sale-discount" step="0.01" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('status', lang)}</label>
          <input type="text" id="sale-status" required />
        </div>
        <button class="button" type="submit">${id ? getTranslation('update', lang) : getTranslation('add', lang)}</button>
      </form>
    </div>
  `;
  document.getElementById('close-modal').onclick = () => { modal.style.display = 'none'; };
  document.getElementById('sale-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      branch_id: document.getElementById('sale-branch-id').value,
      customer_id: document.getElementById('sale-customer-id').value,
      total: document.getElementById('sale-total').value,
      tax: document.getElementById('sale-tax').value,
      discount: document.getElementById('sale-discount').value,
      status: document.getElementById('sale-status').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/sales/${id}` : '/api/sales';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      modal.style.display = 'none';
      renderSalesTable();
    }
  };
}
