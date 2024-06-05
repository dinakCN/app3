// Utilities
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useUserStore } from './user'
import { useAppStore } from './app'
import axios from '../plugins/axios'
import { ProjectInterface } from '../interfaces/ProjectInterface'
import { AxiosObjectReturn, AxiosAddProject, AxiosAddProjectObject } from '../interfaces/AxiosInterface'

export const useProjectStore = defineStore('project', () => {

  const userStore = useUserStore()
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

  const last_project = ref(null)

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
      const storeApp = useAppStore()

      /**
       * Индикатор загрузки
       */
      storeApp.setLoading(true)

      const params = {
        user: appUser.user.id,
        id: id,
        status: 1
      }

      axios.get('/project', {
        params
      })
        .then((r) => {
          if (r.data.success) {
            // console.log(r.data.object)
            setProject(r.data.object)
            resolve(r.data.object)
          } else {
            reject(null)
          }
        })
        .finally(() => storeApp.setLoading(false))
    })
  }

  function setProjectLastModified(time: string) {
    project.last_modified = new Date(time)
  }

  function clearProject() {
    // this = Object.assign({}, { id: null, name: null, add_time: null, last_modified: null })
  }

  function changeProjectName(name: string = '') {
    if (name) project.name = name
  }

  function addProject(name: string) {
    return new Promise<AxiosAddProjectObject | string>((resolve, reject) => {

      const appUser = useUserStore()
      const storeApp = useAppStore()

      /**
       * Индикатор загрузки
       */
      storeApp.setLoading(true)

      const params = {
        user: appUser.user,
        name: name
      }

      axios.post('/project', params)
        .then((r) => {
          console.log(r)
          if (r?.data.success) {
            // setProjectLastModified(r.data.object.last_modified)
            resolve(r.data.object)
          } else {
            reject(r?.data.message)
          }
        })
        .finally(() => storeApp.setLoading(false))
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
          if (r?.data.success) {
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

          if (r?.data.success) {

            if (String(id) === String(id)) clearProject()

            resolve(r)
          } else {
            reject(r)
          }
        })
    })
  }

  function putProject(arr: {name?: string, id?: number, alias?: any}) {
    return new Promise((resolve, reject) => {

      const appUser = useUserStore()

      const param = {
        type: 'put',
        id: arr?.id ? arr.id : project.id,
        name: arr?.name ? arr.name : '',
        alias: arr?.alias ? arr.alias : '',
        user: appUser.user.id,
        status: 1
      }

      axios.post('/project', param)
        .then((r) => {
          console.log(r)
          if (r?.data.success) {
            //setProjectLastModified(r.data.object)
            //resolve(r)
          } else {
            reject(r)
          }
        })
    })
  }

  const addTemplate = (obj) => {
    return new Promise((resolve, reject) => {
      const param =  {
        type:  'new',
        alias: obj.type,
        name:  obj.name,
        user:  userStore.user.id,
        data:  obj.data
      }

      // console.log(param)

      axios.post('/templates', param)
          .then((r) => {
            // console.log(r)
            r.data.success ? resolve(r.data.object) : reject(r.data.message)
          })
    })
  }

  const remTemplate = (obj) => {
    return new Promise((resolve, reject) => {
      const param =  {
        type: 'rem',
        alias: obj.type,
        clid:  obj.clid,
        user: userStore.user.id
      }

      axios.post('/templates', param)
          .then((r) => {
            if (r.data.success) {
              resolve(r)
            } else {
              reject(r)
            }
          })
    })
  }

  const getTemplateList = (alias) => {
    return new Promise((resolve, reject) => {
      const param =  {
        user: userStore.user.id,
        alias: alias,
        status: 1
      }

      axios.get('/templates', {
        params: param
      })
          .then((r) => {
            // console.log(r)

            if (r.data.success) {
              resolve(r.data.object)
            } else {
              reject(r)
            }
          })
    })
  }

  return {
    project,
    sync,
    last_project,
    setProject,
    setProjectLastModified,
    changeProjectName,
    clearProject,
    addTemplate,
    delProject,
    addProject,
    copyProject,
    putProject,
    getProject,
    remTemplate,
    getTemplateList
  }
})
