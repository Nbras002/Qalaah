import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderPOS(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="pos-container">
      <div class="pos-header">
        <h2>${getTranslation('pos', lang)}</h2>
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div class="pos-main">
        <div class="pos-products">
          <input type="text" id="search-product" placeholder="${getTranslation('search', lang)}..." />
          <div id="products-list"></div>
        </div>
        <div class="pos-cart">
          <h3>${getTranslation('cart', lang)}</h3>
          <div id="cart-list"></div>
          <div id="cart-summary"></div>
          <button id="checkout-btn" class="button">${getTranslation('checkout', lang)}</button>
        </div>
      </div>
      <div id="checkout-modal" class="modal" style="display:none;"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderPOS(container);
  };
  document.getElementById('search-product').oninput = (e) => renderProductsList(e.target.value);
  document.getElementById('checkout-btn').onclick = () => showCheckoutModal();
  renderProductsList();
  renderCart();
}

let cart = [];

async function renderProductsList(search = '') {
  const lang = getCurrentLang();
  const res = await fetch('/api/products', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  let products = await res.json();
  if (search) {
    products = products.filter(p => (p.name_en + p.name_ar + p.sku).toLowerCase().includes(search.toLowerCase()));
  }
  const list = products.map(p => `
    <div class="product-item">
      <span>${lang === 'ar' ? p.name_ar : p.name_en} (${p.sku})</span>
      <span>${p.price} ${getTranslation('currency', lang)}</span>
      <button onclick="window.addToCart(${p.id})">${getTranslation('add', lang)}</button>
    </div>
  `).join('');
  document.getElementById('products-list').innerHTML = list;
  window.addToCart = addToCart;
}

function addToCart(productId) {
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ productId, qty: 1 });
  }
  renderCart();
}

async function renderCart() {
  const lang = getCurrentLang();
  if (cart.length === 0) {
    document.getElementById('cart-list').innerHTML = `<p>${getTranslation('cartEmpty', lang)}</p>`;
    document.getElementById('cart-summary').innerHTML = '';
    return;
  }
  const res = await fetch('/api/products', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  const products = await res.json();
  let total = 0, tax = 0;
  const rows = cart.map(item => {
    const p = products.find(pr => pr.id === item.productId);
    const line = p.price * item.qty;
    const lineTax = (p.tax_rate || 0) * item.qty;
    total += line;
    tax += lineTax;
    return `<div class="cart-item">
      <span>${lang === 'ar' ? p.name_ar : p.name_en}</span>
      <span>${item.qty} x ${p.price}</span>
      <span>${line} ${getTranslation('currency', lang)}</span>
      <button onclick="window.removeFromCart(${p.id})">${getTranslation('remove', lang)}</button>
    </div>`;
  }).join('');
  document.getElementById('cart-list').innerHTML = rows;
  document.getElementById('cart-summary').innerHTML = `
    <div>${getTranslation('total', lang)}: ${total} ${getTranslation('currency', lang)}</div>
    <div>${getTranslation('tax', lang)}: ${tax} ${getTranslation('currency', lang)}</div>
  `;
  window.removeFromCart = removeFromCart;
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.productId !== productId);
  renderCart();
}

function showCheckoutModal() {
  const lang = getCurrentLang();
  const modal = document.getElementById('checkout-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>${getTranslation('checkout', lang)}</h3>
      <form id="checkout-form">
        <div class="input-group">
          <label>${getTranslation('customer', lang)}</label>
          <input type="number" id="checkout-customer-id" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('paymentMethod', lang)}</label>
          <select id="checkout-payment-method">
            <option value="cash">${getTranslation('cash', lang)}</option>
            <option value="card">${getTranslation('card', lang)}</option>
            <option value="wallet">${getTranslation('wallet', lang)}</option>
          </select>
        </div>
        <button class="button" type="submit">${getTranslation('confirm', lang)}</button>
      </form>
    </div>
  `;
  document.getElementById('close-modal').onclick = () => { modal.style.display = 'none'; };
  document.getElementById('checkout-form').onsubmit = async (e) => {
    e.preventDefault();
    // سيتم لاحقًا إرسال الطلب للـ backend وإنشاء الفاتورة
    modal.style.display = 'none';
    cart = [];
    renderCart();
    alert(getTranslation('saleCompleted', lang));
  };
}
