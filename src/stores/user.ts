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

    /**
     * Config
     */
    config: {
      limit: {
        items: 7000,
        irows: 70,
        loads: 10,
        projects: 10,
        templates: 10
      },
      units: {
        cargo: {
          size: 2,
          wght: 1
        },
        loads: {
          size: 2,
          wght: 1
        }
      },
      scene : {
        setting: {
          snap: true,
          hang: true
        }
      }
    },

  }),
})
