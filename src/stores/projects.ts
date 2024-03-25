// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from '../plugins/axios'
import { ProjectInterface } from '../interfaces/ProjectInterface'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [

    ] as Array<ProjectInterface>
  }),
  actions: {

    getProjectsList() {

      return new Promise((resolve, reject) => {

        const appUser = useUserStore()

        const param =  {
          user: appUser.user.id,
          status: 1
        }

        this.projects = []

        axios.get('/project', { params: param })
          .then((r) => {

            console.log('getProjectsList', r)

            if (r.data.success) {

              this.projects = [...r.data.object]

              console.log(this.projects)

              resolve(true)
            } else {
              reject(r)
            }
          })
      })
    },

  },
})
