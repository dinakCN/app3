// Utilities
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import axios from '../plugins/axios'
import { ProjectInterface } from '../interfaces/ProjectInterface'

export const useProjectStore = defineStore('project', {
  state: (): ProjectInterface => {
    return {
      id: 0,
      add_time: '',
      status: 1,
      user_id: 0,
      name: '',
      json_data: '',
      last_modified: ''
    }
  },
  getters: {},
  actions: {

    setProject(arr) {

      const { id, name, add_time, last_modified, cargo, loads } = arr

      if (cargo.point) for (const p of cargo.point) cargo.point[p] = Object.freeze(cargo.point[p])
      if (cargo.items) for (const p of cargo.items) cargo.items[p] = Object.freeze(cargo.items[p])
      if (loads) for (const p of loads) loads[p] = Object.freeze(loads[p])

      // this = Object.assign({}, { id, name, add_time, last_modified })

      this.last_modified = new Date(last_modified).getTime()

      cargo.point?.length ? this.cargo.point = cargo.point : this.cargo.point = []
      cargo.items?.length ? this.cargo.items = cargo.items : this.cargo.items = []
      loads.length ? this.loads = loads : this.loads = []

    },

    setProjectLastModified(time) {
      this.last_modified = new Date(time).getTime()
    },

    delProject2 () {
      // this = Object.assign({}, { id: null, name: null, add_time: null, last_modified: null })
    },

    changeProjectName(name: string = '') {
      if (name) this.name = name
    },

    addProject(name: string) {
      return new Promise((resolve, reject) => {

        const appUser = useUserStore()

        const params = {
          user: appUser.user,
          name: name
        }

        axios.post('/project', params)
          .then((r) => {

            // console.log(r)

            if (r.data.success) {

              this.setProjectLastModified()

              resolve(r.data.object)
            } else {
              reject(r.data.message)
            }
          })
      })
    },

    copyProject(id: number) {
      return new Promise((resolve, reject) => {

        const appUser = useUserStore()

        const param =  {
          type: 'copy',
          user: appUser.user,
          id: id
        }

        axios.post('/project', param)
          .then((r) => {
            if (r.data.success) {
              resolve(r.data.object)
            } else {
              reject(r.data.message)
            }
          })
      })
    },

    delProject(id: number) {
      return new Promise((resolve, reject) => {

        const appUser = useUserStore()

        const param =  {
          type: 'rem',
          user: appUser.user,
          id: id,
          status: 1
        }

        axios.post('/project', param)
          .then((r) => {

            // console.log(r, param)

            if (r.data.success) {

              if (String(this.id) === String(id)) this.delProject2()

              resolve(r)
            } else {
              reject(r)
            }
          })
      })
    },

    putProject(arr) {
      return new Promise((resolve, reject) => {

        const appUser = useUserStore()

        const param =  {
          type: 'put',
          id: arr?.id ? arr.id : this.id,
          name: arr?.name ? arr.name : '',
          // data: arr?.alias ? state[arr.alias] : '',
          alias: arr?.alias ? arr.alias : '',
          user: appUser.user,
          status: 1
        }

        /**
         * sync false
         *
         */

        // ('setSync', false)

        axios.post('/project', param)
          .then((r) => {

            // console.log(r)

            if (r.data.success) {
              this.setProjectLastModified(r.data.object)
              resolve(r)
            } else {
              reject(r)
            }
          })
      })
    },

    getProject(id: number) {

      // console.log('getProject', id)

      if (!id) return false

      return new Promise((resolve, reject) => {

        const appUser = useUserStore()

        const param =  {
          user: appUser.user,
          id: id,
          status: 1
        }

        axios.get('/project', {
          params: param
        })
          .then((r) => {

            // console.log(param)

            if (r.data.success) {

              this.setProject(r.data.object)

              resolve(r)
            } else {
              reject(r)
            }
          })
      })
    },

    getProjectsList() {

      return new Promise((resolve, reject) => {

        const appUser = useUserStore()

        const param =  {
          user: appUser.user.id,
          status: 1
        }

        axios.get('/project', { params: param })
          .then((r) => {

            console.log('getProjectsList', r)

            if (r.data.success) {
              resolve(r.data.object)
            } else {
              reject(r)
            }
          })
      })
    },

  },
})
