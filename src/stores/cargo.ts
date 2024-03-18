// Utilities
import { defineStore } from 'pinia'

export const useCargoStore = defineStore('cargo', {
  state: () => ({

    /**
     * Project
     */
    project: {
      id: null,
      name: null,
      add_time: 0,
      last_modified: 0
    },

    /**
     * Config
     */
    config: {
      limit: {
        items: 7000,
        irows: 70,
        loads: 10,
        projects: 1,
        templates: 0
      },
      units: {
        cargo: {
          size: '2',
          wght: '1'
        },
        loads: {
          size: '2',
          wght: '1'
        }
      },
      scene : {
        setting: {
          snap: true,
          hang: true
        }
      }
    },

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
