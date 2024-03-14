<template>
  <div></div>
</template>
<script>
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import '@/fonts/Roboto/Roboto-Regular-normal.js'
// import psimage from '@/assets/images/docs/ps.png'

let pdf
  
const FontSizeDefault = 12
const FontColorDefault = '#000000'

const margin = {
  l: 15, 
  r: 15,
  t: 15,
  b: 8
}

const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'

  // https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

const dateFromString = (str) => {
  return (new Date(str * 1000)).toLocaleDateString('ru-RU')
}

export default {
  methods: {

    generateReport(data) {

      // console.log(data)
      
      this.init()
      this.makePDFData(data)

      // pdf.output('dataurlnewwindow')
      pdf.save(this.$t('documents.order.invoice') + ' №' + String(data.order.number).replace('/', '-') + '.pdf')
    },

    init() {

      /* 210 mm 297 mm	8.27 in x 11.69 in	595 pt x 842 pt*/ /* Pixel↔Point 1 Point = 1.3333333333333 Pixel. */
      
      pdf = null
      pdf = new jsPDF('p', 'mm', 'a4', true)
      pdf.setFont('Roboto-Regular')
    },

    makePDFData(data) {

      const $cost = formatter.format(data.order.cost)
      const $date = dateFromString(data.order.date)

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

      /* description */

      this.textsubstyle()
      pdf.text(this.$t('documents.legal.text'), pdf.internal.pageSize.width - margin.r, margin.t, { align: 'right' })
      pdf.text('https://app.jload.me/offer', pdf.internal.pageSize.width - margin.r, margin.t + 5, { align: 'right' })

      this.textnormalize()

      /** comment */

      pdf.autoTable({
        startY: 35,
        theme: 'plain',
        styles: {
          halign: 'center',
          font: 'Roboto-Regular',
          fontSize: 10,
          cellPadding: 0.7,
          textColor: '#333333'
        },
        body: [
          [{ 
            content: 'Срок действия данного счета 5 рабочих дней от момента получения'
          }],
          [{ 
            content: `${data.payData?.comment}`
          }]
        ],
        showHead: false
      })

      /** payment data */

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY,
        theme: 'grid',
        styles: {
          halign: 'left',
          font: 'Roboto-Regular',
          cellPadding: 1
        },
        body: [
          [
            { 
              content: `${this.$t('documents.payData.inn')} ${data.payData.inn}`,
              styles: { cellWidth: 58 } 
            },
            { 
              content: data.payData.kpp && `${this.$t('documents.payData.kpp')} ${data.payData.kpp}`,
              styles: { cellWidth: 58 }
            },
            { 
              content: this.$t('documents.payData.rs'),
              rowSpan: 3,
              styles: { cellWidth: 12, valign: 'middle', halign: 'center' }
            },
            { 
              content: data.payData.rs,
              rowSpan: 3,
              styles: { valign: 'middle' }
            }
          ],
          [
            { 
              content: this.$t('documents.payData.name'), 
              colSpan: 2, 
              styles: { 
                fontSize: 7, 
                lineWidth: { bottom: 0, left: 0.01, right: 0.01, top: 0.01 }
              } 
            }
          ],
          [
            { 
              content: data.payData.name,
              colSpan: 2, 
              styles: {
                lineWidth: { bottom: 0.01, left: 0.01, right: 0.01, top: 0 }
              }
            }
          ],
          [
            { 
              content: this.$t('documents.payData.bank'), 
              colSpan: 2, 
              styles: { 
                fontSize: 7, 
                lineWidth: { bottom: 0, left: 0.01, right: 0.01, top: 0.01 }
              } 
            },
            { 
              content: this.$t('documents.payData.bik'),
              styles: { valign: 'middle', halign: 'center' }
            },
            { 
              content: data.payData.bik,
              styles: { valign: 'middle' }
            }
          ],
          [
            { 
              content: data.payData.bank,
              colSpan: 2,
              styles: { 
                lineWidth: { bottom: 0.01, left: 0.01, right: 0.01, top: 0 }
              }
            },
            { 
              content: this.$t('documents.payData.ks'),
              styles: { valign: 'middle', halign: 'center' }
            },
            { 
              content: data.payData.ks,
              styles: { valign: 'middle' }
            }
          ]
        ],
        showHead: false
      })

      /** num & dated */

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 10,
        theme: 'plain',
        styles: {
          halign: 'center',
          font: 'Roboto-Regular',
          fontStyle: 'bold',
          fontSize: 16
        },
        body: [
          { content: `${this.$t('documents.order.invoice')} № ${data.order.number} ${this.$t('documents.order.dated')} ${$date}` }
        ],
        showHead: false
      })

      /** customer data */

      let customer = `${data.customer.name}`

      /**
       * add details if received
       * 
       */
        
      if (data.customer.regn) customer = `${customer}, ${this.$t('documents.payData.inn')} ${data.customer.regn}`

      /**
       * add address
       * 
       */

      customer = `${customer}, ${data.customer.address}`

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 5,
        theme: 'plain',
        styles: {
          halign: 'left',
          font: 'Roboto-Regular',
          textColor: '#333333',
          cellPadding: 1
        },
        body: [
          [
            {
              content: this.$t('documents.order.customer') + ':',
              styles: { cellWidth: 27, textColor: '#000000' }
            },        
            { 
              content: customer
            }
          ],
          [
            {
              content: this.$t('documents.executor') + ':',
              styles: { cellWidth: 27, textColor: '#000000' }
            },        
            { 
              content: data.payData.name
            }
          ]
        ],
        showHead: false
      })

      /** goods data */

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 1,
        theme: 'grid',
        styles: {
          halign: 'center',
          font: 'Roboto-Regular',
          fontSize: 9.5,
          fontStyle: 'normal',
          valign: 'middle',
          cellPadding: 1
        },
        headStyles: { 1: { halign: 'left'  } },
        columnStyles: { 1: { halign: 'left' }, 3: { cellWidth: 25 }, 5: { cellWidth: 25 } },
        footStyles: { minCellHeight: 9, fillColor: [255, 255, 255], textColor: '#333333' },
        head: [
          [
            '№',
            this.$t('documents.cart.sv'),
            this.$t('documents.cart.pc'),
            this.$t('documents.cart.pr'),
            this.$t('documents.cart.cn'),
            this.$t('documents.cart.am')
          ]
        ],
        body: this.cart(data.order),
        foot: [
          [
            { content: `${this.$t('common.totally')}:`, colSpan: 5, styles: { halign: 'right' } },
            { content: $cost, styles: { halign: 'center' } }
          ]
        ]
      })

      /** total amount */

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY,
        theme: 'plain',
        styles: {
          halign: 'left',
          font: 'Roboto-Regular',
          fontSize: 10,
          cellPadding: 1,
          textColor: '#333333'
        },
        body: [
          [{ 
            content: `${this.$tc('documents.result', data.order.cart.length, { n: data.order.cart.length })} ${$cost} (${this.$t('documents.currency')}). ${this.$t('documents.fine')}`
          }],
          [{ 
            content: `${this.$tc('documents.paytext.label')}:`
          }],
          [{ 
            content: `${this.$t('documents.paytext.descp', { n: data.order.number, d: $date })}`
          }]
        ],
        showHead: false
      })

      /** executor */

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 5,
        theme: 'plain',
        styles: {
          halign: 'left',
          font: 'Roboto-Regular',
          cellPadding: 1,
          textColor: '#333333'
        },
        body: [
          [{ 
            content: this.$t('documents.executor') + ':'
          }],
          [{ 
            content: data.payData.sign
          }]
        ],
        showHead: false
      })

      /** sign */

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 9,
        theme: 'plain',
        styles: {
          halign: 'left',
          valign: 'bottom',
          font: 'Roboto-Regular',
          cellPadding: 1,
          textColor: '#333333'
        },
        body: [
          [
            { 
              content: '___________________', 
              styles: { cellWidth: 32 }
            },
            { 
              content: data.payData.dirr
            }
          ]
        ],
        showHead: false
      })

      /** signature */

      // pdf.addImage(psimage, 'png', margin.l + 5,  pdf.lastAutoTable.finalY - 15, 30, 15, '',   'FAST')

      /** post message */

      pdf.autoTable({
        startY: pdf.lastAutoTable.finalY + 14,
        theme: 'grid',
        styles: {
          halign: 'center',
          valign: 'middle',
          font: 'Roboto-Regular',
          textColor: '#6c757d',
          cellPadding: 2,
          fontSize: 9.5
        },
        body: [
          [
            { 
              content: `${this.$t('documents.post')}: ${data.payData?.email}`
            }
          ]
        ],
        showHead: false
      })

    },

    cart(data) {

      if (!data.cart.length) return [['-', '-', '-', '-', '-', '-']]

      return data.cart.map((i, x) => {
        const a = []

        a.push({ content: x + 1 })
        a.push({ content: this.service(i.article, i.period, data.comment) })
        a.push({ content: this.$t('units.co') + '.' })
        a.push({ content: formatter.format(i.price) })
        a.push({ content: i.count })
        a.push({ content: formatter.format(i.cost) })

        return a
      })
    },

    service(article, period, comment) {

      if (!article) return ''
      
      let r

      switch (article) {
      case 'year':
      case 'month':
      case 'days':
        r = `${this.$t('documents.cart.services.tarif')} - ${period} ${this.$tc('documents.cart.services.article.' + article, period)}`
        break
      case 'count':      
      case 'param':
        r = `${period} ${this.$tc('documents.cart.services.article.' + article, period)}`
        break
      case 'users':
        r = `${period} ${this.$tc('documents.cart.services.article.' + article, period)}`
        break
      }

      return r
    },

    // UTIL
    
    textnormalize() {
      pdf.setFontSize(FontSizeDefault)
      pdf.setTextColor(FontColorDefault)
    },

    textsubstyle() {
      pdf.setFontSize(10)
      pdf.setTextColor('#6c757d')
    }    

  }
}
</script>