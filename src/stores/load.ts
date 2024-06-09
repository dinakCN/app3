import { defineStore } from 'pinia'
import {useUserStore} from "./user";

import { getLoadsIcon } from '@/configs/functions/geticon.js'
import { getWght } from '@/configs/functions/getunits.js'
import { getText } from '@/configs/functions/gettext.js'
import { getVolume } from '@/configs/functions/getvolume.js'

import {useI18n} from "vue-i18n";
import {computed} from "vue";
import {LoadInterface} from "../interfaces/ProjectInterface";
import {useProjectStore} from "./project";

export const useLoadsStore = defineStore('loads', () => {

  const userStore = useUserStore()
  const projectStore = useProjectStore()

  const config = computed(() => userStore.config)

  const i18n = useI18n()

  const loads: Ref<LoadInterface[]> = ref([])

  const unitsLoads = computed(() => {
    return config.value.units.loads
  })

  const getLoadsById = computed(() => {
    return loads.value.reduce((out, item) => {

      // copy of item
      const i = Object.assign({}, item)
      const area: any = {}

      i.icon = getLoadsIcon(i.tp)

      // type text
      if (Number(i.tp) === 3 || Number(i.tp) === 4) {

        // extended
        i.tt = i18n.t('area.tp.' + i.tp) + ': ' + i18n.t('area.ex.' + i.ex).toLowerCase()

        // size + vol
        area.size = getText(
                i.base,
                i18n.t('units.size.' + config.value.units.loads.size),
                i18n.t('units.wght.' + config.value.units.loads.wght),
                config.value.units.loads) + ' * ' +
            getText(
                i.adds,
                i18n.t('units.size.' + config.value.units.loads.size),
                i18n.t('units.wght.' + config.value.units.loads.wght),
                config.value.units.loads)

        // volume
        i.vl = Number(getVolume(i.base)) + Number(getVolume(i.adds))
        i.wf = Number(getWght(Number(i.base.wg) + Number(i.adds.wg), config.value.units.loads.wght))

      } else {

        // standard
        i.tt = i18n.t('area.tp.' + i.tp)

        // size + vol
        area.size = getText(
            i.base,
            i18n.t('units.size.' + config.value.units.loads.size),
            i18n.t('units.wght.' + config.value.units.loads.wght),
            config.value.units.loads)

        // volume
        i.vl = Number(getVolume(i.base))
        i.wf = Number(getWght(i.base.wg, config.value.units.loads.wght))
      }

      i.sz = area.size + ', ' + i.vl + ' ' + i18n.t('units.m3')

      for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

      out[i.id] = i

      return out
    }, {})
  })

  const checkID = (id: number, arr: LoadInterface[]) => {
    return arr.find((i) => String(i.id) === String(id));
  };

  const getLoadsCount = computed(() => {
    return loads.value.length
  })

  const checkCountLoads = computed(() => {
    return Number(loads.value.length + 1) <= userStore.config.limit.loads;
  })

  const addLoad = (item: LoadInterface) => {

    for (const p of Object.keys(item)) item[p] = Object.freeze(item[p])

    if (!item.id) {

      item.id = Object.freeze(Date.now())

      while (checkID(item.id, loads.value)) item.id = Number(item.id) + 1

      loads.value.push(item)

    } else {
      const index = loads.value.findIndex((i) => String(i.id) === String(item.id))

      loads.value.splice(index, 1, item)
    }

    projectStore.setProjectLastModified()
  }

  const removeLoad = (id: number) => {
    const index = loads.value.findIndex((i) => String(i.id) === String(id))

    loads.value.splice(index, 1)

    projectStore.setProjectLastModified()
  }

  const copyLoad = (id: number) => {
    const e = loads.value.filter((i) => String(i.id) === String(id))
    const i = loads.value.findIndex((i) => String(i.id) === String(id))

    if (e.length && i !== -1) {

      const data = Object.assign({}, e[0])

      data.id = Date.now()

      while (checkID(data.id, loads.value)) data.id = Number(data.id) + 1

      for (const p of Object.keys(data)) data[p] = Object.freeze(data[p])

      loads.value.splice(i + 1, 0, data)

      projectStore.setProjectLastModified()
    }
  }

  return {
    loads,
    unitsLoads,
    getLoadsCount,
    getLoadsById,
    copyLoad,
    removeLoad,
    addLoad,
    checkCountLoads,
  }
})
