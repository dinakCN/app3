<template>
  <div class="text-center">
    <v-btn
      text
      rounded
      color="primary"
      class="font-weight-bold text-caption text-uppercase my-2 mx-1"
      :loading="loading"
      @click="$emit('pdf')"
    >
      {{ $t('scene.export.head') }} 
      <v-icon small right>bx bxs-file-pdf</v-icon> 
    </v-btn>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import '@/fonts/Roboto/Roboto-Regular-normal.js'

import { mapGetters, mapState, mapActions } from 'vuex'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setVolume, getVolume } from '@/configs/functions/getvolume.js'
import { getText } from '@/configs/functions/gettext.js'
import { getDigits } from '@/configs/functions/getDigits.js'

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
  w: 0
}
const margin = {
  l: 15,
  r: 15,
  t: 15,
  b: 8
}

export default {
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsCargo', 'unitsLoads']),
    ...mapState('cargo', ['project']),

    area() {
      if (!data?.size?.base?.wg) return {}

      const i = {}

      i.base = Object.assign({}, data.size.base)
      i.adds = Object.assign({}, data.size.adds)
      i.tp = data.tp
      i.ex = data.ex
      i.nm = data.nm
      
      if (Number(i.tp) === 3 || Number(i.tp) === 4) {

        // extended
        i.tt = this.$t('area.tp.' + i.tp) + ': ' + this.$t('area.ex.' + i.ex).toLowerCase() 

        // size + vol
        i.sz = getText(
          i.base,
          this.$t('units.size.' + this.unitsLoads.size),
          this.$t('units.wght.' + this.unitsLoads.wght),
          this.unitsLoads) + ' * ' + 
          getText(
            i.adds,
            this.$t('units.size.' + this.unitsLoads.size),
            this.$t('units.wght.' + this.unitsLoads.wght),
            this.unitsLoads)

        // volume
        i.vl = Number(getVolume(i.base)) + Number(getVolume(i.adds))
        i.wf = Number(getWght(Number(i.base.wg) + Number(i.adds.wg), this.unitsLoads.wght))

      } else {

        // standard
        i.tt = this.$t('area.tp.' + i.tp)

        // size + vol
        i.sz = getText(
          i.base,
          this.$t('units.size.' + this.unitsLoads.size),
          this.$t('units.wght.' + this.unitsLoads.wght),
          this.unitsLoads)

        // volume
        i.vl = Number(getVolume(i.base))
        i.wf = Number(getWght(i.base.wg, this.unitsLoads.wght))
      }

      i.sz = i.sz + ', ' + i.vl + ' ' + this.$t('units.m3')

      for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

      return Object.freeze(i)
    }
  },

  methods: {
    ...mapActions('app', ['showSuccess']),

    generateReport(i, a, d, p) {
      return new Promise((resolve) => {
        this.loading = true

        images = i
        aspect = a
        data = d
        page = p

        if (!data?.step[page]) resolve(this.loading = false)

        setTimeout(() => {

          this.init()
          this.makePDFData()
          pdf.save(this.$t('scene.export.filename') + '.pdf')

          this.loading = false
          this.exportMessage()
        }, 450)
        
        resolve(this.$metrika.reachGoal('get.pdf'))
      })
    },

    init() {
      /* 210 mm 297 mm	8.27 in x 11.69 in	595 pt x 842 pt*/ /* Pixel↔Point 1 Point = 1.3333333333333 Pixel. */
      pdf = null
      pdf = new jsPDF('p', 'mm', 'a4', true)
      pdf.setFont('Roboto-Regular')
      img.w = img.h * aspect
    },

    setLayout() {

      /* logo  */
      const Brand = 'JetLoader'

      this.textnormalize()

      pdf.setFontSize(18)      
      pdf.text(Brand, margin.l, margin.t)

      /* logo description */
      this.textsubstyle()
      pdf.text('jload.me', margin.l + 8.5, margin.t + 5)

      pdf.setFillColor('#6c757d')
      pdf.line(margin.l + 35, margin.t - 6, margin.l + 35, margin.t + 6, 'F')

      this.textnormalize()

      /* header */
      const offset = margin.l + 45

      if (this.project?.name) {
        // Для scene page
        this.textsubstyle()
        pdf.text(this.$t('project.nm.label'), offset, margin.t - 6)

        this.textnormalize()

        pdf.setFontSize(16)
        pdf.text(this.project?.name ? this.project.name : 'Без наименования', offset, margin.t)

        this.textsubstyle()
        pdf.text(this.$t('scene.export.header_text'), offset, margin.t + 5)

      } else {
        // Для share page
        pdf.setFontSize(16)
        pdf.text(this.$t('scene.export.header_text'), offset, margin.t)
      }

      this.textnormalize()
    },

    setFooter() {
      const h = pdf.internal.pageSize.height - margin.b

      this.textsubstyle()
      pdf.text('jload.me', margin.l, h, { align: 'left' })
      pdf.text(`${pdf.internal.getNumberOfPages()}`, pdf.internal.pageSize.width - margin.r, h, { align: 'right' })
      this.textnormalize()
    },

    makePDFData() {
      const points = data.step[page].base?.item

      if (!points) return false

      points_c = data.step[page].base.item.length

      const l = points.length
      
      let finalY

      points.forEach((i, index) => {
        if (index !== 0) pdf.addPage('a4')
        this.setHeaders(i, l - index)
        finalY = this.insertImage(images[index], 50)
        this.autoTable_Data(i, finalY + 5)
        this.foor_DataPage(i.plus)
      })

      pdf.addPage('a4')
      this.setLayout()
      this.setFooter()

      this.textsubstyle()
      pdf.text(this.$t('scene.total.total_group'), pdf.internal.pageSize.width - margin.r, 30, { align: 'right' })
      this.textnormalize()

      finalY = this.insertImage(images[images.length - 2], 30)
      
      this.result(finalY + 5)

      return false
    },

    // UTIL
    
    textnormalize() {
      pdf.setFontSize(FontSizeDefault)
      pdf.setTextColor(FontColorDefault)
    },

    textsubstyle() {
      pdf.setFontSize(10)
      pdf.setTextColor('#6c757d')
    },

    insertImage(imgURL, offset) {
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

      const startX = (pdf.internal.pageSize.width / 2) - (img.w / 2)
      const startY = offset + 3

      pdf.addImage(imgURL, 'png', startX, startY, img.w, img.h , '', 'FAST')

      return img.h + startY
    },

    // ITEMS

    setHeaders(i, index = 0) {
      return new Promise((resolve) => {
        const offs = 35

        pdf.setFontSize(11)
        pdf.text(data.nm, margin.l, offs, { align: 'left' })

        this.textsubstyle()
        pdf.text(this.area.tt + ' ' + this.area.sz, margin.l, offs + 5, { align: 'left' })

        pdf.text(this.$t('cargolist.header') + ' №' + index + ' "' + i.name + '"', pdf.internal.pageSize.width - margin.r, offs + 15, { align: 'right' })
        
        this.textnormalize()
        resolve()
      })
    },

    body_DataPage(data) {

      const body = []

      if (!data.length) return body

      data.forEach((i) => {

        body.push([
          i.id < 10000 ? i.id : i.subling,
          '',
          i.name,
          getSize(Math.round(i.length), this.unitsCargo.size) + ' x ' + 
          getSize(Math.round(i.width),  this.unitsCargo.size) + ' x ' + 
          getSize(Math.round(i.height), this.unitsCargo.size) + ' ' +
          this.$t('units.size.' + this.unitsCargo.size),
          getWght(i.weight, this.unitsCargo.wght) + ' ' + 
          this.$t('units.wght.' + this.unitsCargo.wght),
          i.count + ' ' + this.$t('units.co')
        ])
      })

      reciev_c ++

      return body
    },

    autoTable_Data(i, y) {

      return new Promise((resolve) => {
        pdf.autoTable({
          styles: { 
            halign: 'center',
            font: 'Roboto-Regular',
            fontStyle: 'normal',
            valign: 'middle'
          },
          bodyStyles: { 2: { halign: 'left' }, minCellHeight: 15 },
          margin: { bottom: 30, top: 35 },
          startY: y,
          rowPageBreak: 'avoid',
          head: [[
            '№',
            this.$t('item.color'),
            this.$t('item.nm.label'),
            this.$t('common.dimensions'),
            this.$t('item.wg.label'),
            this.$t('item.cn.label')
          ]],
          body: this.body_DataPage(i.list),
          didDrawPage: () => {
            // Вставка указателя страницы при превышении таблицей
            this.setLayout()
            this.setFooter()
          },
          didDrawCell: (data) => {         
            if (data.section === 'body' && data.column.index === 1) {

              pdf.setFillColor(i.list[data.row.index].color)
              pdf.roundedRect(data.cell.x + ((data.cell.width / 2) - 5), data.cell.y + ((data.cell.height / 2) - 2.5), 10, 5, 0, 0, 'F')
            }
          }
        })
        resolve()
      })
    },

    // TOTALS

    result(mt) {
      const total = data.step[page].base

      const body = [
        [
          this.$t('scene.total.weight') + ' / ' + 
          this.$t('scene.total.count') + ' / ' + 
          this.$t('scene.total.volume'), 
          getDigits(getWght(total.plus.wg, this.unitsCargo.wght)) + ' ' + this.$t('units.wght.' + this.unitsCargo.wght) + ' / ' + 
          total.plus.cn + ' ' + this.$t('units.co') + ' / '  + 
          setVolume(total.plus.vl) + ' ' + this.$t('units.m3')
        ],
        [
          this.$t('scene.total.height'), 
          getSize(total.results.max.h, this.unitsCargo.size) + ' ' + this.$t('units.size.' + this.unitsCargo.size)
        ]
      ]

      if (data.tp === 0 || data.tp === 1) {
        if (total.results?.max?.l) body.push([this.$t('scene.results.max.head') + ' (' + this.$t('scene.results.max.help') + ')', getSize(total.results.max.l, this.unitsCargo.size) + ' ' + this.$t('units.size.' + this.unitsCargo.size)])
        if (total.results?.ldm?.res) body.push([this.$t('scene.results.opt.head') + ' (' + this.$t('scene.results.opt.help') + ')', getSize(total.results.ldm.res, this.unitsCargo.size) + ' ' + this.$t('units.size.' + this.unitsCargo.size)])
      }

      /**
       * axies
       * 
       */

      const w = this.$t('units.wght.' + this.unitsLoads.wght)

      /**
       * 
       * tt
       * 
       */

      if (total.results?.axies?.tt) {

        const tt = Object.values(total.results.axies.tt)

        if (tt.length) {
          
          tt.forEach((t, index) => {
            
            const num = index + 1

            const head = `${this.$t('scene.results.axies.label')} ${num} ${this.$t('scene.results.axies.from.tt_' + data.ex)}`
            const text = getWght(t.val, this.unitsLoads.wght) + ' / ' + getWght(t.max, this.unitsLoads.wght) + ' ' + w

            body.push([head, text])

          })
        }
      }

      /**
       * 
       * pp
       * 
       */

      if (total.results?.axies?.pp) {

        const pp = Object.values(total.results.axies.pp)

        if (pp.length) {
          
          pp.forEach((p, index) => {
            
            const num = index + 1

            const head = `${this.$t('scene.results.axies.label')} ${num} ${this.$t('scene.results.axies.from.pp')}`
            const text = getWght(p.val, this.unitsLoads.wght) + ' / ' + getWght(p.max, this.unitsLoads.wght) + ' ' + w
            
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
          fontStyle: 'normal'
        },
        columnStyles: { 1: { halign: 'right' } },
        body: body,
        showHead: false
      })
      this.textnormalize()
    },

    foor_DataPage(i) {

      const t = getDigits(getWght(i.wg, this.unitsCargo.wght)) + ' ' +
        this.$t('units.wght.' + this.unitsCargo.wght) + ', ' + 
        setVolume(i.vl) + ' ' + this.$t('units.m3') + ', ' +
        i.cn + ' ' + this.$t('units.co')

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
          valign: 'middle'
        },
        body: [
          [
            { content: (this.$t('scene.export.subresult')).toUpperCase() + ':', colSpan: 2, styles: { halign: 'left' } },
            { content: t, colSpan: 4, styles: { halign: 'right' } }
          ]
        ]        
      })
    },

    exportMessage() {
      this.showSuccess(this.$t('scene.export.message'))
    }

  }
}
</script>