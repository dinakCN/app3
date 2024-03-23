// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({

    /**
     * типы тарифов
     * 0 - free
     * 1 - PRO расчетный
     * 2 - PRO безлимитный
     */
    version: 3.00,

    toast: {
      show: false,
      color: 'black',
      message: '',
      right: false,
      rounded: 'xl',
      timeout: 3000
    },

    loading: false

  }),
})
