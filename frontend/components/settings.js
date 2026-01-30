import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderSettings(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="settings-container">
      <div class="settings-header">
        <h2>${getTranslation('settings', lang)}</h2>
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <form id="settings-form">
        <div class="input-group">
          <label>${getTranslation('organizationName', lang)}</label>
          <input type="text" id="org-name" required />
        </div>
        <div class="input-group">
          <label>${getTranslation('defaultLanguage', lang)}</label>
          <select id="default-lang">
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <div class="input-group">
          <label>${getTranslation('backup', lang)}</label>
          <button type="button" id="backup-btn">${getTranslation('downloadBackup', lang)}</button>
        </div>
        <button class="button" type="submit">${getTranslation('save', lang)}</button>
      </form>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderSettings(container);
  };
  document.getElementById('backup-btn').onclick = () => {
    // سيتم لاحقًا ربط النسخ الاحتياطي
    alert(getTranslation('backupDownloaded', lang));
  };
  document.getElementById('settings-form').onsubmit = (e) => {
    e.preventDefault();
    // سيتم لاحقًا حفظ الإعدادات في backend
    alert(getTranslation('settingsSaved', lang));
  };
}
