<template>
  <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
  >
    <TemplatesDataIteration
        :data="dataList"
        @close="close"
        @del="del"
        @submit="submit"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { trucks, containers, pallet } from '@/configs/templates/loads.js'
import { getText } from '@/configs/functions/gettext.js'
import { getVolume } from '@/configs/functions/getvolume.js'
import { getLoadsIcon } from '@/configs/functions/geticon.js'
import TemplatesDataIteration from '@/components/templates/Templates.vue'
import useTemplateName from '@/hooks/useTemplateName'
import { useCargoStore } from '@/stores/cargo'

const { getName } = useTemplateName()
const cargoStore = useCargoStore()

const dialog = ref(false)
const templates = ref<any[]>([])

const state = reactive({
  resolve: null as any,
  reject: null as any,
})

const unitsLoads = computed(() => cargoStore.unitsLoads)

const dataList = computed(() => {
  if (!templates.value.length) return []

  return templates.value.reduce((o, i) => {
    // name
    i.nm = getName(i)
    // icon
    i.icon = getLoadsIcon(i.data.tp)

    // standard
    i.text = getName('area.tp.' + i.data.tp)

    // size + vol
    i.size = getText(
        i.data.base,
        getName('units.size.' + unitsLoads.value.size),
        getName('units.wght.' + unitsLoads.value.wght),
        unitsLoads.value
    )

    // volume
    i.vol = Number(getVolume(i.data.base))

    // type text
    if (Number(i.data.tp) === 3 || Number(i.data.tp) === 4) {
      // extended
      i.text += ': ' + getName('area.ex.' + i.data.tpex).toLowerCase()

      // size + vol
      i.size += ' * ' +
          getText(
              i.data.adds,
              getName('units.size.' + unitsLoads.value.size),
              getName('units.wght.' + unitsLoads.value.wght),
              unitsLoads.value
          )

      // volume
      i.vol += Number(getVolume(i.data.adds))
    }

    i.text += ' ' + i.size + ', ' + i.vol + ' ' + getName('units.m3')

    // freeze
    for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

    o.push(i)
    return o
  }, [] as any[])
})

const submit = (i: any) => {
  const data = {
    id: null,
    nm: getName(i),
    tp: Number(i.tp),
    un: i.un ? i.un : { size: String(unitsLoads.value.size), wght: String(unitsLoads.value.wght) },
    base: {
      ln: Number(i.base.ln),
      wd: Number(i.base.wd),
      hg: Number(i.base.hg),
      wg: Number(i.base.wg),
    },
    adds: {
      ln: i?.adds?.ln ? Number(i.adds.ln) : 0,
      wd: i?.adds?.wd ? Number(i.adds.wd) : 0,
      hg: i?.adds?.hg ? Number(i.adds.hg) : 0,
      wg: i?.adds?.wg ? Number(i.adds.wg) : 0,
    },
    ax: i.ax ? true : false,
    ex: i.ex ? Number(i.ex) : 1,
    as: {
      base: {
        tt: {
          wg: i?.as?.base?.tt?.wg ? Number(i.as.base.tt.wg) : 0,
          a: i?.as?.base?.tt?.a ? Number(i.as.base.tt.a) : 0,
          l: i?.as?.base?.tt?.l ? Number(i.as.base.tt.l) : 0,
          l1: i?.as?.base?.tt?.l1 ? Number(i.as.base.tt.l1) : 0,
          n1: i?.as?.base?.tt?.n1 ? Number(i.as.base.tt.n1) : 0,
          n2: i?.as?.base?.tt?.n2 ? Number(i.as.base.tt.n2) : 0,
          n1max: i?.as?.base?.tt?.n1max ? Number(i.as.base.tt.n1max) : 0,
          n2max: i?.as?.base?.tt?.n2max ? Number(i.as.base.tt.n2max) : 0,
        },
        pp: {
          wg: i?.as?.base?.pp?.wg ? Number(i.as.base.pp.wg) : 0,
          a: i?.as?.base?.pp?.a ? Number(i.as.base.pp.a) : 0,
          l2: i?.as?.base?.pp?.l2 ? Number(i.as.base.pp.l2) : 0,
          l3: i?.as?.base?.pp?.l3 ? Number(i.as.base.pp.l3) : 0,
          n2: i?.as?.base?.pp?.n2 ? Number(i.as.base.pp.n2) : 0,
          n2max: i?.as?.base?.pp?.n2max ? Number(i.as.base.pp.n2max) : 0,
        },
      },
    },
  }

  dialog.value = false
  state.resolve(data)
}

const open = () => {
  dialog.value = true
  templates.value = []

  for (const i of [...trucks, ...containers, ...pallet]) {
    for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
    templates.value.push(i)
  }

  cargoStore.getTemplateList('l').then((r: any) => {
    if (r.length) {
      r.forEach((i: any, index: number) => {
        i.add_time = 50 + index
        for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
        templates.value.push(i)
      })
    }
  })

  return new Promise((resolve, reject) => {
    state.resolve = resolve
    state.reject = reject
  })
}

const close = () => {
  state.resolve(false)
  dialog.value = false
}

const del = (clid: any) => {
  const index = templates.value.findIndex((i) => String(i.clid) === String(clid))
  templates.value.splice(index, 1)
  cargoStore.remTemplate({ type: 'l', clid })
}
</script>
