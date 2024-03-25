// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from '../plugins/axios'
import { ProjectInterface } from '../interfaces/ProjectInterface'
import { reactive } from 'vue'

export const useProjectsStore = defineStore('projects', () => {

  const store = reactive({
    projects: [] as Array<ProjectInterface>
  })

  function getProjectsList() {
    return new Promise((resolve, reject) => {

      const appUser = useUserStore()

      const param =  {
        user: appUser.user.id,
        status: 1
      }

      store.projects = []

      axios.get('/project', { params: param })
        .then((r) => {

          // console.log('getProjectsList', r)

          if (r.data.success) {
            store.projects = [...r.data.object]
            resolve(null)
          } else {
            reject(r)
          }
        })
    })
  }

  return {
    store,
    getProjectsList
  }
})
