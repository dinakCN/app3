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

    user: {
      id: null,
      email: null,
      tarif: {
        type: 0,
        expir: null,
        count: 0
      },
      discount: 0
    },

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
