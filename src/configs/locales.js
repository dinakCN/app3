// import en from '../translations/en'
// import ru from '../translations/ru'

// const supported = ['en', 'ru']
const supported = ['ru']
let locale = navigator.language.split('-') || 'ru'

try {
  // get browser default language
  const { 0: browserLang } = navigator.language.split('-')

  if (supported.includes(browserLang)) locale = browserLang
} catch (e) {
  console.log(e)
}

export default {
  // current locale
  locale,

  // when translation is not available fallback to that locale
  fallbackLocale: 'ru',

  /**
   *
   * {
    code: 'en',
    flag: 'us',
    label: 'English',
    messages: en
  },

   */

  // availabled locales for user selection
  availableLocales: [{
    code: 'ru',
    flag: 'ru',
    label: 'русский',
    messages: ru
  }]
}
