import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderProducts(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="products-container">
      <div class="products-header">
        <h2>${getTranslation('products', lang)}</h2>
        <button id="add-product-btn" class="button">${getTranslation('addProduct', lang)}</button>
        <input type="text" id="search-product" placeholder="${getTranslation('search', lang)}..." />
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div id="products-table-wrapper"></div>
      <div id="product-modal" class="modal" style="display:none;"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderProducts(container);
  };
  document.getElementById('add-product-btn').onclick = () => showProductModal();
  document.getElementById('search-product').oninput = (e) => renderProductsTable(e.target.value);
  renderProductsTable();
}

async function renderProductsTable(search = '') {
  const lang = getCurrentLang();
  const res = await fetch('/api/products', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  let products = await res.json();
  if (search) {
    products = products.filter(p => (p.name_en + p.name_ar + p.sku).toLowerCase().includes(search.toLowerCase()));
  }
  const table = `
    <table class="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>${getTranslation('nameEn', lang)}</th>
          <th>${getTranslation('nameAr', lang)}</th>
          <th>${getTranslation('sku', lang)}</th>
          <th>${getTranslation('price', lang)}</th>
          <th>${getTranslation('taxRate', lang)}</th>
          <th>${getTranslation('actions', lang)}</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(p => `
          <tr>
            <td>${p.id}</td>
            <td>${p.name_en}</td>
            <td>${p.name_ar}</td>
            <td>${p.sku}</td>
            <td>${p.price}</td>
            <td>${p.tax_rate}</td>
            <td>
              <button onclick="window.editProduct(${p.id})">${getTranslation('edit', lang)}</button>
              <button onclick="window.deleteProduct(${p.id})">${getTranslation('delete', lang)}</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('products-table-wrapper').innerHTML = table;
  window.editProduct = showProductModal;
  window.deleteProduct = deleteProduct;
}

function showProductModal(id = null) {
  // سيتم لاحقًا جلب بيانات المنتج للتعديل
  const lang = getCurrentLang();
  const modal = document.getElementById('product-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>${id ? getTranslation('editProduct', lang) : getTranslation('addProduct', lang)}</h3>
      <form id="product-form">
        <input type="hidden" id="product-id" value="${id || ''}" />
        <div class="input-group">
          <label>${getTranslation('nameEn', lang)}</label>
          <input type="text" id="product-name-en" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('nameAr', lang)}</label>
          <input type="text" id="product-name-ar" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('sku', lang)}</label>
          <input type="text" id="product-sku" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('price', lang)}</label>
          <input type="number" id="product-price" step="0.01" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('taxRate', lang)}</label>
          <input type="number" id="product-tax-rate" step="0.01" required />
        </div>
        <button class="button" type="submit">${id ? getTranslation('update', lang) : getTranslation('add', lang)}</button>
      </form>
    </div>
  `;
  document.getElementById('close-modal').onclick = () => { modal.style.display = 'none'; };
  document.getElementById('product-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name_en: document.getElementById('product-name-en').value,
      name_ar: document.getElementById('product-name-ar').value,
      sku: document.getElementById('product-sku').value,
      price: document.getElementById('product-price').value,
      tax_rate: document.getElementById('product-tax-rate').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/products/${id}` : '/api/products';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      modal.style.display = 'none';
      renderProductsTable();
    }
  };
}

async function deleteProduct(id) {
  if (!confirm('Are you sure?')) return;
  const res = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  if (res.ok) renderProductsTable();
}
