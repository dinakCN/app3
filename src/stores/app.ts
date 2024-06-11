// Utilities
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import axios from "axios";
import {useUserStore} from "./user";

export const useAppStore = defineStore('app', () => {

  /**
   * Version
   */
  const version = '3.0.0'

  /**
   * Loading
   */
  const loading = ref<Boolean>(false)

  const setLoading = (bool: Boolean = false) => {
    loading.value = bool
  }

  const userStore = useUserStore()

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

  const getTariffs = () => {
    return new Promise((resolve, reject) => {

      setLoading(true)

      axios.get('/tarifs')
        .then((r) => {
          r.data.success ? resolve(r.data.object) : reject(r.data.message)
        })
        .finally(() => setLoading(false))
    })
  }

    const getPaymentsList = () => {
        return new Promise((resolve) => {

            setLoading(true)

            axios.get('/payment')
                .then((r) => {
                    if (r.data.success) {
                        resolve(r.data.object)
                    }
                })
                .finally(() => setLoading(false))
        })
    }

    const postPayments = (obj) => {
        return new Promise((resolve) => {

            const params =  {
                user: userStore.user.id,
                types: obj.types,
                prods: obj.prods,
                optns: obj.optns,
                email: obj.email,
                company: obj.company,
                comment: obj.comment,
                version: version
            }

            setLoading(true)

            axios.post('/payment', params)
                .then((r) => {
                    if (r.data.success) resolve(r.data)
                })
                .finally(() => setLoading(false))
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
    showSuccess,
    getTariffs,
    postPayments,
    getPaymentsList,
  }
})
