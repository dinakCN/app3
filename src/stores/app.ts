// Utilities
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useAppStore = defineStore('app', () => {

  /**
   * Version
   */
  const version = '3.0.0'

  /**
   * Loading
   */
  const loading = reactive({
    data: false as Boolean
  })

  function setLoading(bool: Boolean = false) {
    loading.data = bool
  }

  /**
   * Toast
   */
  interface Toast {
    show: boolean,
    color: string,
    message: string,
    tile: boolean,
    rounded: string | boolean,
    timeout: number
  }

  const defaultToast: Toast = {
    show: false,
    color: 'black',
    message: 'test',
    tile: false,
    rounded: 'xl',
    timeout: 3000
  }

  const toast: Toast = reactive({
    show: defaultToast.show,
    color: defaultToast.color,
    message: defaultToast.message,
    tile: defaultToast.tile,
    rounded: defaultToast.rounded,
    timeout: defaultToast.timeout
  })

  const showToast = (t: Toast) => {
    hideToast()

    const { color, timeout, message, tile, rounded } = t

    toast.show = true,
    toast.color = color,
    toast.message = message,
    toast.tile = tile,
    toast.rounded = rounded,
    toast.timeout = timeout
  }

  const hideToast = () => {
    if (toast.show) toast.show = false
  }

  const resetToast = () => {
    toast.show = defaultToast.show,
    toast.color = defaultToast.color,
    toast.message = defaultToast.message,
    toast.tile = defaultToast.tile,
    toast.rounded = defaultToast.rounded,
    toast.timeout = defaultToast.timeout
  }

  const showError = (message: string) => {
    hideToast()

    setTimeout(() => {
      showToast({
        show: true,
        color: 'red lighten-2',
        message: message,
        tile: defaultToast.tile,
        rounded: defaultToast.rounded,
        timeout: 10000
      })
    })
  }

  const showSuccess = (message: string) => {
    hideToast()

    setTimeout(() => {
      showToast({
        show: true,
        color: 'teal',
        message: message,
        tile: defaultToast.tile,
        rounded: defaultToast.rounded,
        timeout: 5000
      })
    })
  }

  const showInfo = (message: string) => {
    hideToast()

    setTimeout(() => {
      showToast({
        show: true,
        color: 'primary lighten-1',
        message: message,
        tile: defaultToast.tile,
        rounded: defaultToast.rounded,
        timeout: 2000
      })
    })
  }

  const showErrorSmall = (message: string) => {
    hideToast()

    setTimeout(() => {
      showToast({
        show: true,
        color: 'red lighten-2',
        message: message,
        tile: true,
        rounded: false,
        timeout: 7000
      })
    })
  }

  const showInfoSmall = (message: string) => {
    hideToast()

    setTimeout(() => {
      showToast({
        show: true,
        color: 'primary lighten-1',
        message: message,
        tile: true,
        rounded: false,
        timeout: 4000
      })
    })

  }

  return {
    version,
    loading,
    setLoading,
    toast,
    showToast,
    hideToast,
    resetToast,
    showError,
    showErrorSmall,
    showInfo,
    showInfoSmall,
    showSuccess
  }
})
