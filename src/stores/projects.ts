// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from '../plugins/axios'
import { ProjectInterface } from '../interfaces/ProjectInterface'

export const useProjectsStore = defineStore('projects', {
  state: () => {
    return {
      projects: [
        {
          id: 1,
          add_time: '1',
          status: 1,
          user_id: 1,
          name: 'name',
          json_data: 'json',
          last_modified: 'date'
        }
      ] as Array<ProjectInterface>
    }
  },
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

            if (r.data.success) {

              console.log('getProjectsList', r)

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
