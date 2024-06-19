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

  const addProject = (pr: ProjectInterface) => {
    store.projects.push(pr)
  }

  const removeProject = (id: number) => {
    const index = store.projects.findIndex((i) => String(i.id) === String(id))
    if (index !== -1) {
      store.projects.splice(index, 1)
    }
  }

  const getProjectsList = () => {
    return new Promise((resolve, reject) => {

      const storeUser = useUserStore()
      const storeApp = useAppStore()

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

            store.projects = r.data.object
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
    getProjectsList,
    addProject,
    removeProject
  }
})
