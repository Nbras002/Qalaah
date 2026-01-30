import { getTranslation, switchLanguage, getCurrentLang } from '../utils/i18n.js';

export function renderLogin(container) {
  const lang = getCurrentLang();
  container.innerHTML = `
    <div class="login-container" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
      <h2 id="login-title">${getTranslation('login', lang)}</h2>
      <form id="login-form">
        <div class="input-group">
          <label for="username" id="label-username">${getTranslation('username', lang)}</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div class="input-group">
          <label for="password" id="label-password">${getTranslation('password', lang)}</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button class="button" type="submit" id="login-btn">${getTranslation('loginBtn', lang)}</button>
      </form>
      <div class="lang-switch">
        <button type="button" id="switch-lang">${lang === 'ar' ? 'English' : 'العربية'}</button>
      </div>
      <div id="login-error" style="color:red; margin-top:10px;"></div>
    </div>
  `;

  document.getElementById('switch-lang').onclick = () => {
    switchLanguage();
    renderLogin(container);
  };
  document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('login-btn');
    btn.disabled = true;
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    btn.disabled = false;
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      window.location.href = '/views/dashboard.html';
    } else {
      document.getElementById('login-error').textContent = getTranslation('invalidCredentials', lang);
    }
  };
}
