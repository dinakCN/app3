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
import { trucks, containers, pallet } from '@/configs/templates/loads.js'
import { getText } from '@/configs/functions/gettext.js'
import { getVolume } from '@/configs/functions/getvolume.js'
import { getLoadsIcon } from '@/configs/functions/geticon.js'

import nameMixin from '@/mixins/name.js'

export default {
  name: 'LoadsTemps',
  components: {
    TemplatesDataIteration: () => import(/* webpackPrefetch: true */'@/components/templates/Templates')
  },
  mixins: [nameMixin],
  data() {
    return {
      templates: [],
      dialog: false
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsLoads']),

    dataList() {
      if (!this.templates.length) return []

      return this.templates.reduce((o, i) => {
        // name
        i.nm = this.iname(i)
        //  icon
        i.icon = getLoadsIcon(i.data.tp)

        // standard
        i.text = this.$t('area.tp.' + i.data.tp)

        // size + vol
        i.size = getText(
          i.data.base,
          this.$t('units.size.' + this.unitsLoads.size),
          this.$t('units.wght.' + this.unitsLoads.wght),
          this.unitsLoads)

        // volume
        i.vol = Number(getVolume(i.data.base))

        // type text
        if (Number(i.data.tp) === 3 || Number(i.data.tp) === 4) {
          // extended
          i.text = ': ' + this.$t('area.ex.' + i.data.tpex).toLowerCase() 
          
          // size + vol
          i.size = i.size + ' * ' + 
            getText(
              i.data.adds,
              this.$t('units.size.' + this.unitsLoads.size),
              this.$t('units.wght.' + this.unitsLoads.wght),
              this.unitsLoads)

          // volume
          i.vol = i.vol + Number(getVolume(i.data.adds))
        }

        i.text = i.text + ' ' + i.size + ', ' + i.vol + ' ' + this.$t('units.m3')

        // freeze
        for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

        o.push(i)

        return o
      }, [])
    }
  },
  methods: {
    ...mapActions('cargo', ['remTemplate', 'getTemplateList']),

    submit(i) {
      const data =  {
        id: null,
        nm: this.iname(i),
        tp: Number(i.tp),
        un: i.un ? i.un : { size: String(this.unitsLoads.size), wght: String(this.unitsLoads.wght) },
        base: {
          ln: Number(i.base.ln),
          wd: Number(i.base.wd),
          hg: Number(i.base.hg),
          wg: Number(i.base.wg)
        },
        adds: {
          ln: i?.adds?.ln ? Number(i.adds.ln) : 0,
          wd: i?.adds?.wd ? Number(i.adds.wd) : 0,
          hg: i?.adds?.hg ? Number(i.adds.hg) : 0,
          wg: i?.adds?.wg ? Number(i.adds.wg) : 0
        },
        ax: i.ax ? true : false,
        ex: i.ex ? Number(i.ex) : 1,
        as: {
          base: {
            tt: {
              wg: i?.as?.base?.tt?.wg ? Number(i.as.base.tt.wg) : 0,
              a:  i?.as?.base?.tt?.a  ? Number(i.as.base.tt.a)  : 0,
              l:  i?.as?.base?.tt?.l  ? Number(i.as.base.tt.l)  : 0,
              l1: i?.as?.base?.tt?.l1 ? Number(i.as.base.tt.l1) : 0,
              n1: i?.as?.base?.tt?.n1 ? Number(i.as.base.tt.n1) : 0,
              n2: i?.as?.base?.tt?.n2 ? Number(i.as.base.tt.n2) : 0,
              n1max: i?.as?.base?.tt?.n1max ? Number(i.as.base.tt.n1max) : 0,
              n2max: i?.as?.base?.tt?.n2max ? Number(i.as.base.tt.n2max) : 0
            },
            pp: {
              wg: i?.as?.base?.pp?.wg ? Number(i.as.base.pp.wg) : 0,
              a:  i?.as?.base?.pp?.a  ? Number(i.as.base.pp.a)  : 0,
              l2: i?.as?.base?.pp?.l2 ? Number(i.as.base.pp.l2) : 0,
              l3: i?.as?.base?.pp?.l3 ? Number(i.as.base.pp.l3) : 0,
              n2: i?.as?.base?.pp?.n2 ? Number(i.as.base.pp.n2) : 0,
              n2max: i?.as?.base?.pp?.n2max ? Number(i.as.base.pp.n2max) : 0
            }
          }
        }
      }

      this.dialog = false
      this.resolve(data)
    },

    open() {
      this.dialog = true

      // null
      this.templates = []

      for (const i of [...trucks, ...containers, ...pallet]) {
        for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
        this.templates.push(i)
      }

      this.getTemplateList('l')
        .then((r) => {          
          if (r.length) r.map((i, index) => {
            i.add_time = 50 + index
            for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
            
            return this.templates.push(i)
          })
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
      this.remTemplate({ type: 'l', clid })
    }

  }
}
</script>
// lang ok