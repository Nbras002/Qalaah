const LANG_KEY = 'qalaah_lang';
const DEFAULT_LANG = 'en';

export function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
}

export function setCurrentLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
}

export function getTranslation(key, lang) {
  try {
    const dict = require(`../i18n/${lang}.json`);
    return dict[key] || key;
  } catch {
    return key;
  }
}

export function switchLanguage() {
  const lang = getCurrentLang();
  setCurrentLang(lang === 'ar' ? 'en' : 'ar');
}
