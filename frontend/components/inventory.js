import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderInventory(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="inventory-container">
      <div class="inventory-header">
        <h2>${getTranslation('inventory', lang)}</h2>
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div id="inventory-table-wrapper"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderInventory(container);
  };
  renderInventoryTable();
}

async function renderInventoryTable() {
  const lang = getCurrentLang();
  const res = await fetch('/api/inventory', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  const inventory = await res.json();
  let html = `<table class="inventory-table"><thead><tr><th>ID</th><th>${getTranslation('product', lang)}</th><th>${getTranslation('branch', lang)}</th><th>${getTranslation('quantity', lang)}</th><th>${getTranslation('minStock', lang)}</th><th>${getTranslation('actions', lang)}</th></tr></thead><tbody>`;
  html += inventory.map(i => `<tr><td>${i.id}</td><td>${i.product_id}</td><td>${i.branch_id}</td><td>${i.quantity}</td><td>${i.min_stock}</td><td><button onclick="window.editInventory(${i.id})">${getTranslation('edit', lang)}</button></td></tr>`).join('');
  html += '</tbody></table>';
  document.getElementById('inventory-table-wrapper').innerHTML = html;
  window.editInventory = showInventoryModal;
}

function showInventoryModal(id) {
  // سيتم لاحقًا جلب بيانات المخزون للتعديل
  const lang = getCurrentLang();
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>${getTranslation('editInventory', lang)}</h3>
      <form id="inventory-form">
        <input type="hidden" id="inventory-id" value="${id}" />
        <div class="input-group">
          <label>${getTranslation('quantity', lang)}</label>
          <input type="number" id="inventory-quantity" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('minStock', lang)}</label>
          <input type="number" id="inventory-min-stock" required />
        </div>
        <button class="button" type="submit">${getTranslation('update', lang)}</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('close-modal').onclick = () => { modal.remove(); };
  document.getElementById('inventory-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      quantity: document.getElementById('inventory-quantity').value,
      min_stock: document.getElementById('inventory-min-stock').value
    };
    const res = await fetch(`/api/inventory/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      modal.remove();
      renderInventoryTable();
    }
  };
}
