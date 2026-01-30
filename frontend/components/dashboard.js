import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderDashboard(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h2 id="dashboard-title">${getTranslation('dashboard', lang)}</h2>
        <button id="logout-btn" class="button">${getTranslation('logout', lang)}</button>
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div class="dashboard-content">
        <p>${getTranslation('welcome', lang)}</p>
        <!-- سيتم إضافة المزيد من المكونات لاحقًا -->
      </div>
    </div>
  `;
  document.getElementById('logout-btn').onclick = () => {
    localStorage.removeItem('token');
    window.location.href = '/index.html';
  };
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderDashboard(container);
  };
}
