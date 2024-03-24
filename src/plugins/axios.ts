// import i18n from './vue-i18n'
import axios from 'axios'

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://app.jload.me/app/'
} else {
  axios.defaults.baseURL = 'https://app.jload.me/dev/'
}

axios.defaults.withCredentials = true

/**
 * обработка запроса перед отправкой
 */

axios.interceptors.request.use((config) => {

  // console.log(config)

  /**
   * get
   */

  if (config.method === 'get' && config.params) {
    config.params.version = 3
  }

  /**
   * post
   */

  if (config.method === 'post' && config.data) {
    // config.data.version = store.getters['app/getVers']
  }

  return config
})

/**
 * обработка запрос перед получением ответа
 *
 */

axios.interceptors.response.use((r: any) => {
  // if (r?.data?.message === 'no_auth') return window.location.href = 'https://app.jload.me'

  return r
}, (e) => {

  // console.log(e)

  // Любые коды состояния, выходящие за пределы диапазона 2xx, вызывают срабатывание этой функции
  // Здесь можете сделать что-то с ошибкой ответа

  if (e.response) {
    // client received an error response (5xx, 4xx)

    // store.dispatch('app/showError', i18n.t('common.validation.no_server'))
  } else if (e.request) {
    // client never received a response, or request never left

    // store.dispatch('app/showError', i18n.t('common.validation.no_connect'))
  } else {
    // anything else

    // store.dispatch('app/showError', i18n.t('common.validation.no_connect'))
  }
})

export default axios
