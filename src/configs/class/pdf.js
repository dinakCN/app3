import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import '@/fonts/Roboto/Roboto-Regular-normal.js'

import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setVolume } from '@/configs/functions/getvolume.js'
import { getDigits } from '@/configs/functions/getDigits.js'

import i18n from '@/plugins/vue-i18n.js'

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

class ScenePDF {

  pdf = null
  data = null
  area = null

  cwght = null
  csize = null
  name = null

  lwght = null

  page = 0

  aspect = 1

  images = []

  points_c = 0

  init() {

    /*
     * 210 mm 297 mm	8.27 in x 11.69 in	595 pt x 842 pt
     * 1 Point = 1.3333333333333 Pixel
     *
     */

    this.pdf = null
    this.pdf = new jsPDF('p', 'mm', 'a4', true)
    this.pdf.setFont('Roboto-Regular')

    img.w = img.h * this.aspect
  }

  setLayout() {

    /* logo  */
    const Brand = 'JetLoader'

    this.textnormalize()

    this.pdf.setFontSize(18)
    this.pdf.text(Brand, margin.l, margin.t)

    /* logo description */
    this.textsubstyle()
    this.pdf.text('jload.me', margin.l + 8.5, margin.t + 5)

    this.pdf.setFillColor('#6c757d')
    this.pdf.line(margin.l + 35, margin.t - 6, margin.l + 35, margin.t + 6, 'F')

    this.textnormalize()

    /* header */
    const offset = margin.l + 45

    if (this.name) {

      // Для scene page

      this.textsubstyle()
      this.pdf.text(i18n.t('project.nm.label'), offset, margin.t - 6)

      this.textnormalize()

      this.pdf.setFontSize(16)
      this.pdf.text(this.name ? this.name : '', offset, margin.t)

      this.textsubstyle()
      this.pdf.text(i18n.t('scene.export.header_text'), offset, margin.t + 5)

    } else {

      // Для share page

      this.pdf.setFontSize(16)
      this.pdf.text(i18n.t('scene.export.header_text'), offset, margin.t)
    }

    this.textnormalize()
  }

  setFooter() {
    const h = this.pdf.internal.pageSize.height - margin.b

    this.textsubstyle()
    this.pdf.text('jload.me', margin.l, h, { align: 'left' })
    this.pdf.text(`${this.pdf.internal.getNumberOfPages()}`, this.pdf.internal.pageSize.width - margin.r, h, { align: 'right' })
    this.textnormalize()
  }

  makePDFData() {

    this.init()

    const points = this.data.step[this.page].base?.item

    if (!points) return false

    this.points_c = this.data.step[this.page].base.item.length

    const l = points.length

    let finalY

    points.forEach((i, index) => {

      // console.log(i)

      if (index !== 0) this.pdf.addPage('a4')

      this.setHeaders(i, l - index)

      finalY = this.insertImage(this.images[index], 50)

      this.autoTable_Data(i, finalY + 5)
      this.foor_DataPage(i)

    })

    this.pdf.addPage('a4')
    this.setLayout()
    this.setFooter()

    this.textsubstyle()
    this.pdf.text(i18n.t('scene.total.total_group'), this.pdf.internal.pageSize.width - margin.r, 30, { align: 'right' })
    this.textnormalize()

    finalY = this.insertImage(this.images[this.images.length - 2], 30)

    this.result(finalY + 5)

    return this.pdf.save(i18n.t('scene.export.filename') + '.pdf')
  }

  // UTIL

  textnormalize() {
    this.pdf.setFontSize(FontSizeDefault)
    this.pdf.setTextColor(FontColorDefault)
  }

  textsubstyle() {
    this.pdf.setFontSize(10)
    this.pdf.setTextColor('#6c757d')
  }

  insertImage(imgURL, offset) {

    const MaxOffset = 10
    const maxHeight = 105
    const maxWidth = this.pdf.internal.pageSize.width - margin.l - margin.r

    if (img.h > maxHeight) {
      img.h = maxHeight - MaxOffset
      img.w = img.h * this.aspect
    }

    if (img.w > maxWidth) {
      img.w = maxWidth
      img.h = img.w / this.aspect
    }

    const startX = (this.pdf.internal.pageSize.width / 2) - (img.w / 2)
    const startY = offset + 3

    this.pdf.addImage(imgURL, 'png', startX, startY, img.w, img.h , '', 'FAST')

    return img.h + startY
  }

  // ITEMS

  setHeaders(i, index = 0) {
    return new Promise((resolve) => {
      const offs = 35

      this.pdf.setFontSize(11)
      this.pdf.text(this.data.nm, margin.l, offs, { align: 'left' })

      this.textsubstyle()
      this.pdf.text(this.area.tt + ' ' + this.area.sz, margin.l, offs + 5, { align: 'left' })

      this.pdf.text(i18n.t('cargolist.header') + ' №' + index + ' "' + i.name + '"', this.pdf.internal.pageSize.width - margin.r, offs + 15, { align: 'right' })

      this.textnormalize()
      resolve()
    })
  }

  body_DataPage(data) {

    const body = []

    if (!data.length) return body

    data.forEach((i) => {

      body.push([
        i.id < 10000 ? i.id : i.subling,
        '',
        i.name,
        getSize(Math.round(i.length), this.csize) + ' x ' +
        getSize(Math.round(i.width),  this.csize) + ' x ' +
        getSize(Math.round(i.height), this.csize) + ' ' +
        i18n.t('units.size.' + this.csize),
        getWght(i.weight, this.cwght) + ' ' +
        i18n.t('units.wght.' + this.cwght),
        i.count + ' ' + i18n.t('units.co')
      ])
    })

    return body
  }

  autoTable_Data(i, y) {

    return new Promise((resolve) => {
      this.pdf.autoTable({
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
          i18n.t('item.color'),
          i18n.t('item.nm.label'),
          i18n.t('common.dimensions'),
          i18n.t('item.wg.label'),
          i18n.t('item.cn.label')
        ]],
        body: this.body_DataPage(i.list),
        didDrawPage: () => {
          // Вставка указателя страницы при превышении таблицей
          this.setLayout()
          this.setFooter()
        },
        didDrawCell: (data) => {
          if (data.section === 'body' && data.column.index === 1) {

            this.pdf.setFillColor(i.list[data.row.index].color)
            this.pdf.roundedRect(data.cell.x + ((data.cell.width / 2) - 5), data.cell.y + ((data.cell.height / 2) - 2.5), 10, 5, 0, 0, 'F')
          }
        }
      })
      resolve()
    })
  }

  // TOTALS

  result(mt) {

    const total = this.data.step[this.page].base

    const body = [
      [
        i18n.t('scene.total.weight') + ' / ' +
        i18n.t('scene.total.count') + ' / ' +
        i18n.t('scene.total.volume'),
        getDigits(getWght(total.plus.wg, this.cwght)) + ' ' + i18n.t('units.wght.' + this.cwght) + ' / ' +
        total.plus.cn + ' ' + i18n.t('units.co') + ' / '  +
        setVolume(total.plus.vl) + ' ' + i18n.t('units.m3')
      ],
      [
        i18n.t('scene.total.height'),
        getSize(total.results.max.h, this.csize) + ' ' + i18n.t('units.size.' + this.csize)
      ]
    ]

    if (this.data.tp === 0 || this.data.tp === 1) {
      if (total.results?.max?.l) body.push([i18n.t('scene.results.max.head') + ' (' + i18n.t('scene.results.max.help') + ')', getSize(total.results.max.l, this.csize) + ' ' + i18n.t('units.size.' + this.csize)])
      if (total.results?.ldm?.res) body.push([i18n.t('scene.results.opt.head') + ' (' + i18n.t('scene.results.opt.help') + ')', getSize(total.results.ldm.res, this.csize) + ' ' + i18n.t('units.size.' + this.csize)])
    }

    /**
     * axies
     *
     */

    const w = i18n.t('units.wght.' + this.lwght)

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

          const head = `${i18n.t('scene.results.axies.label')} ${num} ${i18n.t('scene.results.axies.from.tt_' + this.data.ex)}`
          const text = getWght(t.val, this.lwght) + ' / ' + getWght(t.max, this.lwght) + ' ' + w

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

          const head = `${i18n.t('scene.results.axies.label')} ${num} ${i18n.t('scene.results.axies.from.pp')}`
          const text = getWght(p.val, this.lwght) + ' / ' + getWght(p.max, this.lwght) + ' ' + w

          body.push([head, text])

        })
      }
    }

    this.pdf.setFontSize(10)
    this.pdf.autoTable({
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
  }

  foor_DataPage(i) {

    // console.log(i)

    let wg = 0, cn = 0, vl = 0

    i.list.forEach((list) => {

      wg += Number(list.weight) * Number(list.count)
      cn += list.count
      vl += Number(list.length) * Number(list.width) * Number(list.height) * Number(list.count)

    })

    const t = getDigits(getWght(wg, this.cwght)) + ' ' +
      i18n.t('units.wght.' + this.cwght) + ', ' +
      setVolume(vl) + ' ' + i18n.t('units.m3') + ', ' +
      cn + ' ' + i18n.t('units.co')

    this.pdf.autoTable({
      startY: this.pdf.lastAutoTable.finalY + 5,
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
          { content: (i18n.t('scene.export.subresult')).toUpperCase() + ':', colSpan: 2, styles: { halign: 'left' } },
          { content: t, colSpan: 4, styles: { halign: 'right' } }
        ]
      ]
    })

    return
  }

}

export { ScenePDF }
