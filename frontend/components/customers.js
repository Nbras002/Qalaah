import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderCustomers(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="customers-container">
      <div class="customers-header">
        <h2>${getTranslation('customers', lang)}</h2>
        <button id="add-customer-btn" class="button">${getTranslation('addCustomer', lang)}</button>
        <input type="text" id="search-customer" placeholder="${getTranslation('search', lang)}..." />
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div id="customers-table-wrapper"></div>
      <div id="customer-modal" class="modal" style="display:none;"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderCustomers(container);
  };
  document.getElementById('add-customer-btn').onclick = () => showCustomerModal();
  document.getElementById('search-customer').oninput = (e) => renderCustomersTable(e.target.value);
  renderCustomersTable();
}

async function renderCustomersTable(search = '') {
  const lang = getCurrentLang();
  const res = await fetch('/api/customers', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  let customers = await res.json();
  if (search) {
    customers = customers.filter(c => (c.name + c.phone + c.email).toLowerCase().includes(search.toLowerCase()));
  }
  const table = `
    <table class="customers-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>${getTranslation('name', lang)}</th>
          <th>${getTranslation('phone', lang)}</th>
          <th>${getTranslation('email', lang)}</th>
          <th>${getTranslation('actions', lang)}</th>
        </tr>
      </thead>
      <tbody>
        ${customers.map(c => `
          <tr>
            <td>${c.id}</td>
            <td>${c.name}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>
              <button onclick="window.editCustomer(${c.id})">${getTranslation('edit', lang)}</button>
              <button onclick="window.deleteCustomer(${c.id})">${getTranslation('delete', lang)}</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('customers-table-wrapper').innerHTML = table;
  window.editCustomer = showCustomerModal;
  window.deleteCustomer = deleteCustomer;
}

function showCustomerModal(id = null) {
  // سيتم لاحقًا جلب بيانات العميل للتعديل
  const lang = getCurrentLang();
  const modal = document.getElementById('customer-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>${id ? getTranslation('editCustomer', lang) : getTranslation('addCustomer', lang)}</h3>
      <form id="customer-form">
        <input type="hidden" id="customer-id" value="${id || ''}" />
        <div class="input-group">
          <label>${getTranslation('name', lang)}</label>
          <input type="text" id="customer-name" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('phone', lang)}</label>
          <input type="text" id="customer-phone" />
        </div>
        <div class="input-group">
          <label>${getTranslation('email', lang)}</label>
          <input type="email" id="customer-email" />
        </div>
        <button class="button" type="submit">${id ? getTranslation('update', lang) : getTranslation('add', lang)}</button>
      </form>
    </div>
  `;
  document.getElementById('close-modal').onclick = () => { modal.style.display = 'none'; };
  document.getElementById('customer-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('customer-name').value,
      phone: document.getElementById('customer-phone').value,
      email: document.getElementById('customer-email').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/customers/${id}` : '/api/customers';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      modal.style.display = 'none';
      renderCustomersTable();
    }
  };
}

async function deleteCustomer(id) {
  if (!confirm('Are you sure?')) return;
  const res = await fetch(`/api/customers/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  if (res.ok) renderCustomersTable();
}
