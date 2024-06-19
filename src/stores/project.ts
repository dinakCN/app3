// Utilities
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useUserStore } from './user'
import { useAppStore } from './app'
import axios from '../plugins/axios'
import { ProjectInterface } from '../interfaces/ProjectInterface'
import { AxiosAddProjectObject } from '../interfaces/AxiosInterface'
import {useProjectsStore} from "./projects";

export const useProjectStore = defineStore('project', () => {

  const userStore = useUserStore()
  const appStore = useAppStore()
  const projectsStore = useProjectsStore()
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

  const setProject = (obj: ProjectInterface) => {

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

  const getProject = (id: number = 0) => {
    return new Promise<ProjectInterface>((resolve, reject) => {
      /**
       * Индикатор загрузки
       */
      appStore.setLoading(true)

      const params = {
        user: userStore.user.id,
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
        .finally(() => appStore.setLoading(false))
    })
  }

  const setProjectLastModified = (time?: string) => {
    project.last_modified = time ? new Date(time) : new Date()
  }

  const clearProject = () => {
    // this = Object.assign({}, { id: null, name: null, add_time: null, last_modified: null })
  }

  const changeProjectName = (name: string = '') => {
    if (name) project.name = name
  }

  const addProject = (name: string) => {
    return new Promise<AxiosAddProjectObject | string>((resolve, reject) => {
      /**
       * Индикатор загрузки
       */
      //storeApp.setLoading(true)

      const params = {
        user: userStore.user.id,
        name: name
      }

      axios.post('/project', params)
        .then((r) => {
          if (r?.data.success) {
            // setProjectLastModified(r.data.object.last_modified)
            projectsStore.addProject({
              name,
              user_id: userStore.user.id,
              status: 1,
              add_time: r.data.object.last_modified,
              id: r.data.object.id,
              json_data:"",
              last_modified: r.data.object.last_modified,
            })
            resolve(r.data.object)
          } else {
            reject(r?.data.message)
          }
        })
        // .finally(() => storeApp.setLoading(false))
    })
  }

  const copyProject = (id: number) => {
    return new Promise((resolve, reject) => {

      const param = {
        type: 'copy',
        user: userStore.user.id,
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

  const delProject = (id: number) => {
    return new Promise((resolve, reject) => {

      const param = {
        type: 'rem',
        user: userStore.user.id,
        id: id,
        status: 1
      }

      axios.post('/project', param)
        .then((r) => {

          if (r?.data.success) {
            if (String(id) === String(id)) clearProject()
            projectsStore.removeProject(id)
            resolve(r)
          } else {
            reject(r)
          }
        })
    })
  }

  const putProject = (arr: {name?: string, id?: number, alias?: any}) => {
    return new Promise((resolve, reject) => {

      const param = {
        type: 'put',
        id: arr?.id ? arr.id : project.id,
        name: arr?.name ? arr.name : '',
        alias: arr?.alias ? arr.alias : '',
        user: userStore.user.id,
        status: 1
      }

      axios.post('/project', param)
        .then((r) => {
          if (r?.data.success) {
            setProjectLastModified(r.data.object)
            resolve(r)
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
