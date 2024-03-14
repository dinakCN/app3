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

<script>
import { mapActions, mapGetters } from 'vuex'
import { rt, ov } from '@/configs/items.js'
import { pallet } from '@/configs/templates/cargo.js'
import { getText } from '@/configs/functions/gettext.js'
import { getDigits } from '@/configs/functions/getDigits.js'
import { getWght } from '@/configs/functions/getunits.js'
import nameMixin from '@/mixins/name.js'

export default {
  name: 'CargoTemps',
  components: {
    TemplatesDataIteration: () => import(/* webpackPrefetch: true */'@/components/templates/Templates')
  },
  mixins: [nameMixin],
  data() {
    return {
      templates: [],
      // rt & ov default value
      start: {
        rt,
        ov
      },
      dialog: false
    }
  },
  computed: {    
    ...mapGetters('cargo', ['unitsCargo']),

    dataList() {
      if (!this.templates.length) return []

      // console.log(this.templates)

      return this.templates.reduce((o, i) => {
        // name
        i.nm = this.iname(i)

        if (!i.icon) i.icon = 'bx bxs-extension'

        // text
        i.text = this.text(i.data)

        // freeze
        for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

        o.push(i)

        return o
      }, [])
    }
  },
  methods: {
    ...mapActions('cargo', ['remTemplate', 'getTemplateList']),

    submit(arr) {
      const data = []

      for (const i of arr) {
        data.push({
          id: null,
          nm: this.iname(i),
          ln: i.ln,
          wd: i.wd,
          hg: i.hg, 
          wg: i.wg,
          cn: i.cn,
          pg: i.pg,
          st: i.st,
          lm: i.lm,
          rt: Object.prototype.hasOwnProperty.call(i, 'rt') ? Number(i.rt) : Number(this.start.rt.val),
          ov: Object.prototype.hasOwnProperty.call(i, 'ov') ? Number(i.ov) : Number(this.start.ov.val), 
          cr: i.cr,
          un: { size: String(this.unitsCargo.size), 'wght': String(this.unitsCargo.wght) },
          point: null
        })        
      }

      this.dialog = false
      this.resolve(data)
    },

    open() {
      this.dialog = true
      
      // null
      this.templates = []

      // default
      for (const i of [...pallet]) {
        for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
        this.templates.push(i)
      }

      // mine & shared
      this.getTemplateList('c')
        .then((r) => {
          if (r.length) {
            r.map((i, index) =>  {
              i.add_time = 50 + index
              for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
              
              return this.templates.push(i)
            })
          }
        })

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    
    close() {
      this.resolve(false)
      this.dialog = false
    },

    del(clid) {
      const index = this.templates.findIndex((i) => String(i.clid) === String(clid))

      this.templates.splice(index, 1)
      this.remTemplate({ type: 'c', clid })
    },

    text(data) {

      if (Number(data.length) === 1)  {
        return getText(
          data[0],
          this.$t('units.size.' + this.unitsCargo.size),
          this.$t('units.wght.' + this.unitsCargo.wght),
          this.unitsCargo) + ' ' + 
          Number(data[0].cn) + ' ' + this.$t('units.co')
      }

      const result = data.reduce((o, item) => {
        o['cn'] = Number(o['cn']) + Number(item.cn)
        o['wg'] = Number(o['wg']) + item.cn * item.wg

        return o
      }, { cn: 0, wg: 0 })      

      return Number(result.cn) + ' ' + this.$t('units.co') + ', ' +  
      getDigits(getWght(result.wg, this.unitsCargo.wght)) + ' ' + this.$t('units.wght.' + this.unitsCargo.wght)
    }
  }
}
</script>
// lang ok