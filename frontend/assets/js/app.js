import { renderLogin } from '../../components/login.js';
import '../utils/i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  renderLogin(document.getElementById('app'));
});