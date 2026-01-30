import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderRoles(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="roles-container">
      <div class="roles-header">
        <h2>${getTranslation('roles', lang)}</h2>
        <button id="add-role-btn" class="button">${getTranslation('addRole', lang)}</button>
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div id="roles-table-wrapper"></div>
      <div id="role-modal" class="modal" style="display:none;"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderRoles(container);
  };
  document.getElementById('add-role-btn').onclick = () => showRoleModal();
  renderRolesTable();
}

async function renderRolesTable() {
  const lang = getCurrentLang();
  const res = await fetch('/api/roles', { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
  const roles = await res.json();
  let html = `<table class="roles-table"><thead><tr><th>ID</th><th>${getTranslation('roleName', lang)}</th><th>${getTranslation('permissions', lang)}</th><th>${getTranslation('actions', lang)}</th></tr></thead><tbody>`;
  html += roles.map(r => `<tr><td>${r.id}</td><td>${r.name}</td><td>${JSON.stringify(r.permissions)}</td><td><button onclick="window.editRole(${r.id})">${getTranslation('edit', lang)}</button></td></tr>`).join('');
  html += '</tbody></table>';
  document.getElementById('roles-table-wrapper').innerHTML = html;
  window.editRole = showRoleModal;
}

function showRoleModal(id = null) {
  // سيتم لاحقًا جلب بيانات الدور للتعديل
  const lang = getCurrentLang();
  const modal = document.getElementById('role-modal');
  modal.style.display = 'block';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" id="close-modal">&times;</span>
      <h3>${id ? getTranslation('editRole', lang) : getTranslation('addRole', lang)}</h3>
      <form id="role-form">
        <input type="hidden" id="role-id" value="${id || ''}" />
        <div class="input-group">
          <label>${getTranslation('roleName', lang)}</label>
          <input type="text" id="role-name" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('permissions', lang)}</label>
          <input type="text" id="role-permissions" required placeholder='{"all":true}' />
        </div>
        <button class="button" type="submit">${id ? getTranslation('update', lang) : getTranslation('add', lang)}</button>
      </form>
    </div>
  `;
  document.getElementById('close-modal').onclick = () => { modal.style.display = 'none'; };
  document.getElementById('role-form').onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: document.getElementById('role-name').value,
      permissions: document.getElementById('role-permissions').value
    };
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/roles/${id}` : '/api/roles';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      modal.style.display = 'none';
      renderRolesTable();
    }
  };
}
