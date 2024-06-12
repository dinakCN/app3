<template>
  <div class="text-center">
    <v-btn
      variant="text"
      rounded
      color="primary"
      class="font-weight-bold text-caption text-uppercase my-2 mx-1"
      :loading="loading"
      @click="$emit('pdf')"
    >
      {{ t('scene.export.head') }}
      <v-icon small right>bx bxs-file-pdf</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useCargoStore } from '@/stores/cargo'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import '@/fonts/Roboto/Roboto-Regular-normal.js'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setVolume, getVolume } from '@/configs/functions/getvolume.js'
import { getText } from '@/configs/functions/gettext.js'
import { getDigits } from '@/configs/functions/getDigits.js'
import {useUserStore} from "../../stores/user";
import {useProjectStore} from "../../stores/project";

const { t } = useI18n()
const appStore = useAppStore()
const cargoStore = useCargoStore()
const userStore = useUserStore()
const projectStore = useProjectStore()


const loading = ref(false)
let pdf
let data = {}
let page = 0
let aspect = 1
let images = []
let points_c = 0
let reciev_c = 0

const FontSizeDefault = 12
const FontColorDefault = '#000000'
const img = {
  h: 105,
  w: 0,
}
const margin = {
  l: 15,
  r: 15,
  t: 15,
  b: 8,
}

const unitsLoads = computed(() => userStore.config.units.loads)
const unitsCargo = computed(() => userStore.config.units.cargo)

const area = computed(() => {
  if (!data?.size?.base?.wg) return {}

  const i: any = {}

  i.base = { ...data.size.base }
  i.adds = { ...data.size.adds }
  i.tp = data.tp
  i.ex = data.ex
  i.nm = data.nm

  if (Number(i.tp) === 3 || Number(i.tp) === 4) {
    i.tt = t('area.tp.' + i.tp) + ': ' + t('area.ex.' + i.ex).toLowerCase()
    i.sz =
      getText(
        i.base,
        t('units.size.' + unitsLoads.value.size),
        t('units.wght.' + unitsLoads.value.wght),
        unitsLoads.value
      ) +
      ' * ' +
      getText(
        i.adds,
        t('units.size.' + unitsLoads.value.size),
        t('units.wght.' + unitsLoads.value.wght),
        unitsLoads.value
      )
    i.vl = Number(getVolume(i.base)) + Number(getVolume(i.adds))
    i.wf = Number(getWght(Number(i.base.wg) + Number(i.adds.wg), unitsLoads.value.wght))
  } else {
    i.tt = t('area.tp.' + i.tp)
    i.sz = getText(
      i.base,
      t('units.size.' + unitsLoads.value.size),
      t('units.wght.' + unitsLoads.value.wght),
      unitsLoads.value
    )
    i.vl = Number(getVolume(i.base))
    i.wf = Number(getWght(i.base.wg, unitsLoads.value.wght))
  }

  i.sz = i.sz + ', ' + i.vl + ' ' + t('units.m3')

  return Object.freeze(i)
})

const generateReport = (i, a, d, p) => {
  return new Promise((resolve) => {
    loading.value = true

    images = i
    aspect = a
    data = d
    page = p

    if (!data?.step[page]) resolve((loading.value = false))

    setTimeout(() => {
      init()
      makePDFData()
      pdf.save(t('scene.export.filename') + '.pdf')

      loading.value = false
      exportMessage()
    }, 450)

    resolve(appStore.showSuccess(t('scene.export.message')))
  })
}

const init = () => {
  pdf = new jsPDF('p', 'mm', 'a4', true)
  pdf.setFont('Roboto-Regular')
  img.w = img.h * aspect
}

const setLayout = () => {
  const Brand = 'JetLoader'
  textnormalize()

  pdf.setFontSize(18)
  pdf.text(Brand, margin.l, margin.t)

  textsubstyle()
  pdf.text('jload.me', margin.l + 8.5, margin.t + 5)

  pdf.setFillColor('#6c757d')
  pdf.line(margin.l + 35, margin.t - 6, margin.l + 35, margin.t + 6, 'F')

  textnormalize()

  const offset = margin.l + 45

  if (projectStore.project?.name) {
    textsubstyle()
    pdf.text(t('project.nm.label'), offset, margin.t - 6)
    textnormalize()
    pdf.setFontSize(16)
    pdf.text(projectStore.project?.name ? projectStore.project.name : 'Без наименования', offset, margin.t)
    textsubstyle()
    pdf.text(t('scene.export.header_text'), offset, margin.t + 5)
  } else {
    pdf.setFontSize(16)
    pdf.text(t('scene.export.header_text'), offset, margin.t)
  }

  textnormalize()
}

const setFooter = () => {
  const h = pdf.internal.pageSize.height - margin.b
  textsubstyle()
  pdf.text('jload.me', margin.l, h, { align: 'left' })
  pdf.text(`${pdf.internal.getNumberOfPages()}`, pdf.internal.pageSize.width - margin.r, h, { align: 'right' })
  textnormalize()
}

const makePDFData = () => {
  const points = data.step[page].base?.item

  if (!points) return false

  points_c = data.step[page].base.item.length

  const l = points.length

  let finalY

  points.forEach((i, index) => {
    if (index !== 0) pdf.addPage('a4')
    setHeaders(i, l - index)
    finalY = insertImage(images[index], 50)
    autoTable_Data(i, finalY + 5)
    foor_DataPage(i.plus)
  })

  pdf.addPage('a4')
  setLayout()
  setFooter()

  textsubstyle()
  pdf.text(t('scene.total.total_group'), pdf.internal.pageSize.width - margin.r, 30, { align: 'right' })
  textnormalize()

  finalY = insertImage(images[images.length - 2], 30)

  result(finalY + 5)

  return false
}

const textnormalize = () => {
  pdf.setFontSize(FontSizeDefault)
  pdf.setTextColor(FontColorDefault)
}

const textsubstyle = () => {
  pdf.setFontSize(10)
  pdf.setTextColor('#6c757d')
}

const insertImage = (imgURL, offset) => {
  const MaxOffset = 10
  const maxHeight = 105
  const maxWidth = pdf.internal.pageSize.width - margin.l - margin.r

  if (img.h > maxHeight) {
    img.h = maxHeight - MaxOffset
    img.w = img.h * aspect
  }

  if (img.w > maxWidth) {
    img.w = maxWidth
    img.h = img.w / aspect
  }

  const startX = pdf.internal.pageSize.width / 2 - img.w / 2
  const startY = offset + 3

  pdf.addImage(imgURL, 'png', startX, startY, img.w, img.h, '', 'FAST')

  return img.h + startY
}

const setHeaders = async (i, index = 0) => {
  const offs = 35

  pdf.setFontSize(11)
  pdf.text(data.nm, margin.l, offs, { align: 'left' })

  textsubstyle()
  pdf.text(area.value.tt + ' ' + area.value.sz, margin.l, offs + 5, { align: 'left' })

  pdf.text(t('cargolist.header') + ' №' + index + ' "' + i.name + '"', pdf.internal.pageSize.width - margin.r, offs + 15, { align: 'right' })

  textnormalize()
}

const body_DataPage = (data) => {
  const body = []

  if (!data.length) return body

  data.forEach((i) => {
    body.push([
      i.id < 10000 ? i.id : i.subling,
      '',
      i.name,
      getSize(Math.round(i.length), unitsCargo.value.size) +
      ' x ' +
      getSize(Math.round(i.width), unitsCargo.value.size) +
      ' x ' +
      getSize(Math.round(i.height), unitsCargo.value.size) +
      ' ' +
      t('units.size.' + unitsCargo.value.size),
      getWght(i.weight, unitsCargo.value.wght) +
      ' ' +
      t('units.wght.' + unitsCargo.value.wght),
      i.count + ' ' + t('units.co'),
    ])
  })

  reciev_c++

  return body
}

const autoTable_Data = async (i, y) => {
  pdf.autoTable({
    styles: {
      halign: 'center',
      font: 'Roboto-Regular',
      fontStyle: 'normal',
      valign: 'middle',
    },
    bodyStyles: { 2: { halign: 'left' }, minCellHeight: 15 },
    margin: { bottom: 30, top: 35 },
    startY: y,
    rowPageBreak: 'avoid',
    head: [[
      '№',
      t('item.color'),
      t('item.nm.label'),
      t('common.dimensions'),
      t('item.wg.label'),
      t('item.cn.label'),
    ]],
    body: body_DataPage(i.list),
    didDrawPage: () => {
      setLayout()
      setFooter()
    },
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        pdf.setFillColor(i.list[data.row.index].color)
        pdf.roundedRect(
          data.cell.x + data.cell.width / 2 - 5,
          data.cell.y + data.cell.height / 2 - 2.5,
          10,
          5,
          0,
          0,
          'F'
        )
      }
    },
  })
}

const result = (mt) => {
  const total = data.step[page].base

  const body = [
    [
      t('scene.total.weight') +
      ' / ' +
      t('scene.total.count') +
      ' / ' +
      t('scene.total.volume'),
      getDigits(getWght(total.plus.wg, cunitsCargo.value.wght)) +
      ' ' +
      t('units.wght.' + unitsCargo.value.wght) +
      ' / ' +
      total.plus.cn +
      ' ' +
      t('units.co') +
      ' / ' +
      setVolume(total.plus.vl) +
      ' ' +
      t('units.m3'),
    ],
    [
      t('scene.total.height'),
      getSize(total.results.max.h, unitsCargo.value.size) +
      ' ' +
      t('units.size.' + unitsCargo.value.size),
    ],
  ]

  if (data.tp === 0 || data.tp === 1) {
    if (total.results?.max?.l)
      body.push([
        t('scene.results.max.head') + ' (' + t('scene.results.max.help') + ')',
        getSize(total.results.max.l, unitsCargo.value.size) +
        ' ' +
        t('units.size.' + unitsCargo.value.size),
      ])
    if (total.results?.ldm?.res)
      body.push([
        t('scene.results.opt.head') + ' (' + t('scene.results.opt.help') + ')',
        getSize(total.results.ldm.res, unitsCargo.value.size) +
        ' ' +
        t('units.size.' + unitsCargo.value.size),
      ])
  }

  const w = t('units.wght.' + unitsLoads.value.wght)

  if (total.results?.axies?.tt) {
    const tt = Object.values(total.results.axies.tt)
    if (tt.length) {
      tt.forEach((t, index) => {
        const num = index + 1
        const head = `${t('scene.results.axies.label')} ${num} ${t('scene.results.axies.from.tt_' + data.ex)}`
        const text = getWght(t.val, unitsLoads.value.wght) +
          ' / ' +
          getWght(t.max, unitsLoads.value.wght) +
          ' ' +
          w
        body.push([head, text])
      })
    }
  }

  if (total.results?.axies?.pp) {
    const pp = Object.values(total.results.axies.pp)
    if (pp.length) {
      pp.forEach((p, index) => {
        const num = index + 1
        const head = `${t('scene.results.axies.label')} ${num} ${t('scene.results.axies.from.pp')}`
        const text = getWght(p.val, unitsLoads.value.wght) +
          ' / ' +
          getWght(p.max, unitsLoads.value.wght) +
          ' ' +
          w
        body.push([head, text])
      })
    }
  }

  pdf.setFontSize(10)
  pdf.autoTable({
    startY: mt,
    styles: {
      halign: 'left',
      font: 'Roboto-Regular',
      fontStyle: 'normal',
    },
    columnStyles: { 1: { halign: 'right' } },
    body: body,
    showHead: false,
  })
  textnormalize()
}

const foor_DataPage = (i) => {
  const str =
    getDigits(getWght(i.wg, unitsCargo.value.wght)) +
    ' ' +
    t('units.wght.' + unitsCargo.value.wght) +
    ', ' +
    setVolume(i.vl) +
    ' ' +
    t('units.m3') +
    ', ' +
    i.cn +
    ' ' +
    t('units.co')

  pdf.autoTable({
    startY: pdf.lastAutoTable.finalY + 5,
    theme: 'plain',
    showHead: false,
    styles: {
      halign: 'left',
      font: 'Roboto-Regular',
      cellPadding: 1,
      minCellHeight: 15,
      textColor: '#333333',
      valign: 'middle',
    },
    body: [
      [
        { content: t('scene.export.subresult').toUpperCase() + ':', colSpan: 2, styles: { halign: 'left' } },
        { content: str, colSpan: 4, styles: { halign: 'right' } },
      ],
    ],
  })
}

const exportMessage = () => {
  appStore.showSuccess(t('scene.export.message'))
}
</script>
