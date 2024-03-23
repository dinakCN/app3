// Utilities
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    
    /**
     * Типы тарифов
     * 0 - free
     * 1 - PRO расчетный
     * 2 - PRO безлимитный
     */
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

  }),
})
