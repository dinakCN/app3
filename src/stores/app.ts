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
  const toast = reactive({
    data: {
      show: false,
      color: 'black',
      message: '',
      right: false,
      rounded: 'xl',
      timeout: 3000
    }
  })

  return {
    version,
    loading,
    setLoading,
    toast
  }
})
