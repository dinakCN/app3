// Utilities
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useUserStore } from './user'
import axios from '../plugins/axios'
import { ProjectInterface } from '../interfaces/ProjectInterface'

export const useProjectStore = defineStore('project', () => {

  /**
   * Project
   */
  const project: ProjectInterface = reactive({
    id: 0,
    add_time: new Date(),
    status: 1,
    user_id: 0,
    name: '',
    json_data: '',
    last_modified: new Date(),
    cargo: {
      point: [],
      items: []
    },
    loads: []
  })

  /**
   * Sync projects
   */
  const sync = ref(false)

  /**
   * Methods
   */

  function setProject(obj: ProjectInterface) {

    const { id, name, add_time, last_modified, cargo, loads } = obj
    const { point, items } = cargo

    /**
     * Project data
     * ID
     * name
     * add_time
     * last_modified
     */
    project.id = id
    project.name = name
    project.add_time = new Date(add_time)
    project.last_modified = new Date(last_modified)

    /**
     * Point
     */
    if (point?.length) {
      project.cargo.point = point
    }

    /**
     * Items
     */
    if (items?.length) {
      project.cargo.items = items
    }

    /**
     * Loads
     */
    if (loads?.length) {
      project.loads = loads
    }
  }

  function getProject(id: number = 0) {
    return new Promise<ProjectInterface>((resolve, reject) => {

      const appUser = useUserStore()

      const params = {
        user: appUser.user,
        id: id,
        status: 1
      }

      axios.get('/project', {
        params
      })
        .then((r) => {
          if (r.data.success) {
            setProject(r.data.object)
            resolve(r.data.object)
          } else {
            reject(null)
          }
        })
    })
  }

  function setProjectLastModified(time) {
    project.last_modified = new Date(time)
  }

  function clearProject() {
    // this = Object.assign({}, { id: null, name: null, add_time: null, last_modified: null })
  }

  function changeProjectName(name: string = '') {
    if (name) name = name
  }

  function addProject(name: string) {
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

            setProjectLastModified()

            resolve(r.data.object)
          } else {
            reject(r.data.message)
          }
        })
    })
  }

  function copyProject(id: number) {
    return new Promise((resolve, reject) => {

      const appUser = useUserStore()

      const param = {
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
  }

  function delProject(id: number) {
    return new Promise((resolve, reject) => {

      const appUser = useUserStore()

      const param = {
        type: 'rem',
        user: appUser.user,
        id: id,
        status: 1
      }

      axios.post('/project', param)
        .then((r) => {

          if (r.data.success) {

            if (String(id) === String(id)) clearProject()

            resolve(r)
          } else {
            reject(r)
          }
        })
    })
  }

  function putProject(arr) {
    return new Promise((resolve, reject) => {

      const appUser = useUserStore()

      const param = {
        type: 'put',
        id: arr?.id ? arr.id : id,
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
            setProjectLastModified(r.data.object)
            resolve(r)
          } else {
            reject(r)
          }
        })
    })
  }

  return {
    project,
    sync,
    setProject,
    setProjectLastModified,
    changeProjectName,
    clearProject,
    delProject,
    addProject,
    copyProject,
    putProject,
    getProject,
  }
})
