// Utilities
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useAppStore } from './app'
import axios from 'axios'
import { User, Config  } from '../interfaces/UserInterface'
import {useProjectStore} from "./project";


export const useUserStore = defineStore('user', () => {

  const projectStore = useProjectStore()
  /**
   * User
   * 0 - free
   * 1 - PRO расчетный
   * 2 - PRO безлимитный
   */
  const user = reactive({
    id: null,
    name: '',
    email: '',
    tarif: {
      type: 0,
      expir: '',
      count: 0
    },
    discount: 0,
  } as User)

  function setConfigUser(arr: Config) {

    const { user:u } = arr

    user.id = u.id
    user.name = u.name
    user.email = u?.email ? u?.email : ''
    user.discount = u?.discount ? Number(u.discount) : 0
  }

  function setConfigLicense(arr: Config) {

    const { tarif } = arr

    if (!user?.tarif) return

    user.tarif.type = Object.freeze(tarif.type)
    user.tarif.expir = Object.freeze(tarif.expir)
    user.tarif.count = Object.freeze(tarif.count)
  }

  function setUserName(name: string) {
    user.name = Object.freeze(name)
  }

  /**
   * Config
   */
  const config = reactive({
    limit: {
      items: 7000,
      irows: 70,
      loads: 10,
      projects: 10,
      templates: 10
    },
    units: {
      cargo: {
        size: 0,
        wght: 1
      },
      loads: {
        size: 2,
        wght: 1
      }
    },
    stats: {
      count: 0,
      login: 0,
      projects: 0,
      templates: 0,
    },
    scene: {
      setting: {
        snap: true,
        hang: true
      }
    }
  })

  function postConfigUnits(obj) {
    return new Promise((resolve, reject) => {

      const params = {
        user: user.id,
        type: 'units',
        cargo: obj.cargo,
        loads: obj.loads
      }

      axios.post('/user_config', params)
        .then((r) => {
          if (r.data.success) {
            setConfigUnits(r.data.object)
            resolve(null)
          } else {
            reject(r.data.message)
          }
        })
    })
  }

  function setConfigUnits(arr) {
    const { units } = arr

    config.units.cargo.size = units.cargo.size ? Number(units.cargo.size) : 1
    config.units.cargo.wght = units.cargo.wght ? Number(units.cargo.wght) : 0
    config.units.loads.size = units.loads.size ? Number(units.loads.size) : 2
    config.units.loads.wght = units.loads.wght ? Number(units.loads.wght) : 1
  }

  function setConfigStats(arr) {
    const { stats } = arr

    config.stats.count = stats.count ? Number(stats.count) : 0
    config.stats.login = stats.login ? Number(stats.login) : 0
    config.stats.projects = stats.projects ? Number(stats.projects) : 0
    config.stats.templates = stats.templates ? Number(stats.templates) : 1
  }

  function setConfigLimits(arr) {
    const { limit } = arr

    config.limit.items = limit.items ? Object.freeze(limit.items) : Object.freeze(5000)
    config.limit.loads = limit.loads ? Object.freeze(limit.loads) : Object.freeze(10)
    config.limit.projects = limit.projects ? Object.freeze(limit.projects) : Object.freeze(100)
    config.limit.templates = limit.templates ? Object.freeze(limit.templates) : Object.freeze(50)
    config.limit.irows = limit.irows ? Object.freeze(limit.irows) : Object.freeze(70)
  }

  function setConfigSceneSetting(a) {
    a.includes('snap') ? config.scene.setting.snap = true : config.scene.setting.snap = false
    a.includes('hang') ? config.scene.setting.hang = true : config.scene.setting.hang = false
  }

  function getConfig() {
    return new Promise<Config>((resolve, reject) => {

      /**
       * Store
       */
      const storeApp = useAppStore()

      /**
       * Индикатор загрузки
       */
      storeApp.setLoading(true)

      /**
       * Request
       */
      axios.get('/user_config')
        .then((r) => {

          // console.log(r)

          if (r.data.success) {

            const config: Config = r.data.object

            setConfigUser(config)
            setConfigLicense(config)
            setConfigLimits(config)
            setConfigUnits(config)
            setConfigStats(config)
            projectStore.last_project = config.last_project
            resolve(config)
          }

          reject(null)
        })
        .finally(() => storeApp.setLoading(false))
    })
  }

  function postConfigProfile(obj) {
    return new Promise((resolve, reject) => {

      const params = {
        user: user.id,
        type: 'profile',
        name: obj?.name,
        pass: obj?.pass
      }

      /**
       * Store
       */
      const storeApp = useAppStore()

      /**
       * Индикатор загрузки
       */
      storeApp.setLoading(true)

      /**
       * Request
       */
      axios.post('/user_config', params)
        .then((r) => {
          if (r.data.success) {

            if (obj?.name) setUserName(obj.name)

            resolve(null)
          } else {
            reject(r.data.message)
          }
        })
        .finally(() => storeApp.setLoading(false))
    })
  }

  return {
    user,
    setConfigUser,
    setConfigLicense,
    config,
    postConfigUnits,
    setConfigUnits,
    setConfigLimits,
    setConfigSceneSetting,
    getConfig,
    postConfigProfile
  }
})
