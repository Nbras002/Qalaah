import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderBackup(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="backup-container">
      <div class="backup-header">
        <h2>${getTranslation('backup', lang)}</h2>
        <button id="switch-lang" class="button">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div class="backup-actions">
        <button id="download-backup-btn" class="button">${getTranslation('downloadBackup', lang)}</button>
      </div>
      <div id="backup-status"></div>
    </div>
  `;
  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderBackup(container);
  };
  document.getElementById('download-backup-btn').onclick = () => {
    // سيتم لاحقًا ربط زر النسخ الاحتياطي مع backend
    document.getElementById('backup-status').textContent = getTranslation('backupDownloaded', lang);
  };
}
