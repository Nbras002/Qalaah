import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderBranches(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="branches-container">
      <div class="branches-header">
        <h2>${getTranslation('branches', lang)}</h2>
        <button id="add-branch-btn" class="button">${getTranslation('addBranch', lang)}</button>
        <input type="text" id="search-branch" placeholder="${getTranslation('search', lang)}..." />
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div id="branches-table-wrapper"></div>
      <div id="branch-modal" class="modal" style="display:none;"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderBranches(container);
  };
  document.getElementById('add-branch-btn').onclick = () => showBranchModal();
  document.getElementById('search-branch').oninput = (e) => renderBranchesTable(e.target.value);
  renderBranchesTable();
}

async function renderBranchesTable(search = '') {
  const lang = getCurrentLang();
  const res = await fetch('/api/branches', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  let branches = await res.json();
  if (search) {
    branches = branches.filter(b => (b.name + b.location).toLowerCase().includes(search.toLowerCase()));
  }
  const table = `
    <table class="branches-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>${getTranslation('name', lang)}</th>
          <th>${getTranslation('location', lang)}</th>
          <th>${getTranslation('actions', lang)}</th>
        </tr>
      </thead>
      <tbody>
        ${branches.map(b => `
          <tr>
            <td>${b.id}</td>
            <td>${b.name}</td>
            <td>${b.location}</td>
            <td>
              <button onclick="window.editBranch(${b.id})">${getTranslation('edit', lang)}</button>
              <button onclick="window.deleteBranch(${b.id})">${getTranslation('delete', lang)}</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('branches-table-wrapper').innerHTML = table;
  window.editBranch = showBranchModal;
  window.deleteBranch = deleteBranch;
}

function showBranchModal(id = null) {
  // سيتم لاحقًا جلب بيانات الفرع للتعديل
  const lang = getCurrentLang();
  const modal = document.getElementById('branch-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>${id ? getTranslation('editBranch', lang) : getTranslation('addBranch', lang)}</h3>
      <form id="branch-form">
        <input type="hidden" id="branch-id" value="${id || ''}" />
        <div class="input-group">
          <label>${getTranslation('name', lang)}</label>
          <input type="text" id="branch-name" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('location', lang)}</label>
          <input type="text" id="branch-location" />
        </div>
        <button class="button" type="submit">${id ? getTranslation('update', lang) : getTranslation('add', lang)}</button>
      </form>
    </div>
  `;
  document.getElementById('close-modal').onclick = () => { modal.style.display = 'none'; };
  document.getElementById('branch-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('branch-name').value,
      location: document.getElementById('branch-location').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/branches/${id}` : '/api/branches';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      modal.style.display = 'none';
      renderBranchesTable();
    }
  };
}

async function deleteBranch(id) {
  if (!confirm('Are you sure?')) return;
  const res = await fetch(`/api/branches/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  if (res.ok) renderBranchesTable();
}
