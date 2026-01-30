import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderReports(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="reports-container">
      <div class="reports-header">
        <h2>${getTranslation('reports', lang)}</h2>
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div class="reports-tabs">
        <button class="tab-btn" id="tab-sales">${getTranslation('salesReport', lang)}</button>
        <button class="tab-btn" id="tab-inventory">${getTranslation('inventoryReport', lang)}</button>
        <button class="tab-btn" id="tab-financial">${getTranslation('financialReport', lang)}</button>
      </div>
      <div id="report-content"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderReports(container);
  };
  document.getElementById('tab-sales').onclick = () => renderSalesReport();
  document.getElementById('tab-inventory').onclick = () => renderInventoryReport();
  document.getElementById('tab-financial').onclick = () => renderFinancialReport();
  renderSalesReport();
}

async function renderSalesReport() {
  const lang = getCurrentLang();
  const res = await fetch('/api/reports/sales', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  const data = await res.json();
  let html = `<h3>${getTranslation('salesReport', lang)}</h3>`;
  html += `<table class="report-table"><thead><tr><th>${getTranslation('date', lang)}</th><th>${getTranslation('total', lang)}</th><th>${getTranslation('tax', lang)}</th></tr></thead><tbody>`;
  html += data.map(r => `<tr><td>${r.date}</td><td>${r.total}</td><td>${r.tax}</td></tr>`).join('');
  html += '</tbody></table>';
  document.getElementById('report-content').innerHTML = html;
}

async function renderInventoryReport() {
  const lang = getCurrentLang();
  const res = await fetch('/api/reports/inventory', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  const data = await res.json();
  let html = `<h3>${getTranslation('inventoryReport', lang)}</h3>`;
  html += `<table class="report-table"><thead><tr><th>${getTranslation('product', lang)}</th><th>${getTranslation('quantity', lang)}</th></tr></thead><tbody>`;
  html += data.map(r => `<tr><td>${r.product}</td><td>${r.quantity}</td></tr>`).join('');
  html += '</tbody></table>';
  document.getElementById('report-content').innerHTML = html;
}

async function renderFinancialReport() {
  const lang = getCurrentLang();
  const res = await fetch('/api/reports/financial', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  const data = await res.json();
  let html = `<h3>${getTranslation('financialReport', lang)}</h3>`;
  html += `<table class="report-table"><thead><tr><th>${getTranslation('date', lang)}</th><th>${getTranslation('revenue', lang)}</th></tr></thead><tbody>`;
  html += data.map(r => `<tr><td>${r.date}</td><td>${r.revenue}</td></tr>`).join('');
  html += '</tbody></table>';
  document.getElementById('report-content').innerHTML = html;
}
