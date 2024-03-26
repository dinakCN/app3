// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useAppStore } from './app'
import { ProjectInterface } from '../interfaces/ProjectInterface'
import { reactive } from 'vue'
import axios from 'axios'

export const useProjectsStore = defineStore('projects', () => {

  const store = reactive({
    projects: [] as Array<ProjectInterface>
  })

  function getProjectsList() {
    return new Promise((resolve, reject) => {

      const storeUser = useUserStore()
      const storeApp = useAppStore()

      /**
       * Очистить все проекты
       */
      store.projects = []

      /**
       * Индикатор загрузки
       */
      storeApp.setLoading(true)

      axios.get('/project', {
        params: {
          user: storeUser.user.id,
          status: 1
        }
      })
        .then((r) => {
          if (r.data.success) {

            store.projects = [...r.data.object]
            resolve(null)

          } else {

            reject(r)

          }
        })
        .finally(() => storeApp.setLoading(false))
    })
  }

  return {
    store,
    getProjectsList
  }
})
