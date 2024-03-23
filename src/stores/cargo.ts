// Utilities
import { defineStore } from 'pinia'

export const useCargoStore = defineStore('cargo', {
  state: () => ({

    /**
     * Cargo
     */
    cargo: {
      point: [],
      items: []
    },

    /**
     * Loads
     */
    loads: [],

    /**
     * Sync
     */
    sync: false

  }),
})
