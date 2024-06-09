import { defineStore } from 'pinia'
import {useProjectStore} from "./project";
import {useUserStore} from "./user";
import {useAppStore} from "./app";
import {useCargoStore} from "./cargo";

export const useSceneStore = defineStore('scene', () => {

  const projectStore = useProjectStore()
  const userStore = useUserStore()
  const appStore = useAppStore()
  const cargoStore = useCargoStore()
  const getScene = (index = 0) => {
    return new Promise((resolve, reject) => {

      const param = {
        type: 'scene',
        id: projectStore.project.id,
        loads: state.loads[index],
        area: index,
        cargo: cargoStore.cargo,
        user: userStore.user.id,
        version: appStore.version
      }

      appStore.setLoading(true)

      axios.post('/project', param)
          .then((r) => {

            if (r.data.success) {
              resolve(JSON.parse(JSON.stringify(r.data.object)))

            } else {

              reject(r.data.message)

            }

          })
          .finally(() => appStore.setLoading(true))
    })
  }

  const setScene = (obj) => {
    return new Promise((resolve, reject) => {
      const { scene, area } = obj

      if (!scene) return
      appStore.setLoading(true)

      const param =  {
        type:  'sync',
        scene: scene,
        area:  area,
        id:    projectStore.project.id,
        user:  userStore.user.id
      }

      axios.post('/project', param)
          .then((r) => {
            if (r.data.success) {
              resolve()
            }  else {
              reject(r.data.message)
            }
          }).finally(() => appStore.setLoading(false))
    })
  }

  const getShare = (obj) => {
    return new Promise((resolve, reject) => {

      const { id, project } = obj

      const params =  {
        id,
        project
      }

      appStore.setLoading(true)

      axios.get('/share', { params: params })
          .then((r) => {
            r.data.success ? resolve(r.data.object) : reject(r.data.message)
          })
          .finally(() => appStore.setLoading(false)
          )
    })

  }

  const setShare = (obj) => {

    return new Promise((resolve, reject) => {

      const { scene, project } = obj

      const param =  {
        user: rootState.app.user.id,
        scene,
        project
      }
      appStore.setLoading(true)
      axios.post('/share', param)
          .then((r) => {
            r.data.success ? resolve(r.data.object) : reject(r.data.message)

          })
          .finally(() => appStore.setLoading(false))
    })
  }

  return {
    setShare,
    getShare,
    setScene,
    getScene,
  }
})
