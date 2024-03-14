<template>
  <div style="width:100%;">

    <!-- LOADS -->
    <v-card
      flat
      rounded="lg"
      class="ml-1 px-1 mb-1"
    >
      <div class="d-flex align-center" style="min-height:48px">

        <div v-if="areaMaxPage > 1" class="mr-1">
          <v-btn
            :disabled="areaPage <= 1"
            icon
            color="primary"
            @click="prevArea()"
          >
            <v-icon>bx bxs-chevron-left</v-icon>
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <div class="text-caption text-center py-1">
          <div class="text-uppercase font-weight-bold">
            {{ area?.nm }}
          </div>          
          <div>
            {{ area?.sz }}
          </div>
          <div class="grey--text text--darken-3">
            {{ area?.tt }}: {{ scenePageMax }} {{ $t('units.co') }}
          </div>
        </div>

        <v-spacer></v-spacer>

        <div v-if="areaMaxPage > 1" class="ml-1" >
          <v-btn
            :disabled="areaPage >= areaMaxPage"
            icon
            color="primary"
            @click="nextArea()"
          >
            <v-icon>bx bxs-chevron-right</v-icon>
          </v-btn>
        </div>

      </div>
    </v-card>

    <!-- SCENE -->
    <v-card
      flat
      rounded="lg"
      class="mx-1 mb-1 mr-0"
    >
      <div class="d-flex align-center" style="min-height:48px">
        <div v-show="scenePageMax > 1">
          <v-btn
            :disabled="scenePage <= 1"
            icon
            color="primary"
            class="mx-1"
            @click="prevPage()"
          >
            <v-icon>bx bxs-chevron-left</v-icon>
          </v-btn>
        </div>            
        
        <v-spacer></v-spacer>

        <div v-show="scenePageMax" class="text-caption text-center py-1">
          
          <div class="text-uppercase font-weight-bold">
            {{ area?.tt }} {{ scenePage }} / {{ scenePageMax }}
          </div>

          <div class="red--text text--darken-2">
            {{ $t('common.totally') }} {{ pageResult['brutto'] }} {{ $t('units.wght.' + unitsLoads.wght) }}, {{ pageResult['volume'] }} {{ $t('units.m3') }}, {{ pageResult['count'] }} {{ $t('units.co') }}
          </div>

          <div class="teal--text text--darken-2">
            {{ $t('scene.total.free') }} {{ pageFree?.wg }} {{ $t('units.wght.' + unitsLoads.wght) }}, {{ pageFree?.vl }}  {{ $t('units.m3') }}
          </div>

        </div>

        <v-spacer></v-spacer>
        
        <div v-show="scenePageMax > 1">
          <v-btn
            :disabled="scenePage >= scenePageMax"
            icon
            color="primary"
            class="mx-1"
            @click="nextPage()"
          >
            <v-icon>bx bxs-chevron-right</v-icon>
          </v-btn> 
        </div>            
      </div>
    </v-card>

    <!-- PANEL PAGE RESULT -->
    <v-card
      v-if="pageResult.count"
      flat
      rounded="lg"
      class="ml-1 mb-1"
      style="font-size: 100%"
    >
      
      <v-expansion-panels
        flat
        accordion
      >
        <v-expansion-panel>
          <v-expansion-panel-header class="text-caption font-weight-bold text-uppercase py-0">
            {{ $t('scene.results.head') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content class="text-truncate">

            <v-subheader class="pl-0" style="margin-top:-15px;">Максимальные размеры</v-subheader>

            <v-simple-table dense style="margin-left:-15px; margin-right:-15px;">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left font-weight-regular pr-1">
                      Стороны                    
                    </th>
                    <th class="text-center font-weight-regular px-1">
                      Итого
                    </th>
                    <th class="text-center font-weight-regular px-1">
                      Макс.
                    </th>
                    <th class="text-center font-weight-regular px-1">
                      Остаток
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(i, x) in options.max"
                    :key="x"
                  >
                    <td class="caption text-left " :class="!i.valid && 'red--text text--darken-2'">{{ i.head }}</td>
                    <td class="caption text-center" :class="!i.valid && 'red--text text--darken-2'">{{ i.reslt }}</td>
                    <td class="caption grey--text text--darken-3 text-center">{{ i.maxmm }}</td>
                    <td class="caption text-center" :class="!i.valid && 'red--text text--darken-2'">{{ i.offst }}</td>
                  </tr>
                  <tr
                    v-for="(i, x) in options.ldm"
                    :key="x + 10"
                  >
                    <td class="caption text-left">{{ i.head }}</td>
                    <td class="caption grey--text text--darken-3 text-center">{{ i.reslt }}</td>
                    <td class="caption grey--text text--darken-3 text-center">{{ i.maxmm }}</td>
                    <td class="caption grey--text text--darken-3 text-center">{{ i.offst }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel v-if="options.tt.length">
          <v-expansion-panel-header class="text-caption font-weight-bold text-uppercase py-0">
            Нагрузка на оси
          </v-expansion-panel-header>
          <v-expansion-panel-content class="text-truncate">

            <v-subheader class="pl-0" style="margin-top:-15px;">Оси {{ $t('scene.results.axies.from.tt_' + area.ex) }}</v-subheader>

            <v-simple-table dense style="margin-left:-15px; margin-right:-15px;">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left font-weight-regular pr-1">
                      Ось
                    </th>
                    <th class="text-center font-weight-regular px-1">
                      Итого
                    </th>
                    <th class="text-center font-weight-regular px-1">
                      Макс.
                    </th>
                    <th class="text-center font-weight-regular px-1">
                      Превыш.
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(i, x) in options.tt"
                    :key="x + 20"
                  >
                    <td class="caption text-left" :class="!i.vald ? 'red--text text--darken-2' : 'success--text text--darken-1'" >{{ i.head }}</td>
                    <td class="caption text-center">
                      {{ i.text }}
                    </td>
                    <td class="caption text-center">{{ i.maxn }}</td>
                    <td 
                      class="caption text-center"
                      :class="!i.vald ? 'red--text text--darken-2' : 'success--text text--darken-1'"
                    >
                      <span v-show="!i.vald">+ </span>
                      {{ i.offs }}                    
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <span v-if="options.pp.length">

              <v-subheader class="pl-0 mt-1">Оси {{ $t('scene.results.axies.from.pp') }}</v-subheader>

              <v-simple-table dense  style="margin-left:-15px; margin-right:-15px;" >
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left font-weight-regular pr-1">
                        Ось 
                      </th>
                      <th class="text-center font-weight-regular px-1">
                        Итого
                      </th>
                      <th class="text-center font-weight-regular px-1">
                        Макс.
                      </th>
                      <th class="text-center font-weight-regular px-1">
                        Превыш.
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(i, x) in options.pp"
                      :key="x + 30"
                    >
                      <td class="caption text-left" :class="!i.vald ? 'red--text text--darken-2' : 'success--text text--darken-1'" >{{ i.head }}</td>
                      <td class="caption text-center">
                        {{ i.text }}
                      </td>
                      <td class="caption text-center">{{ i.maxn }}</td>
                      <td 
                        class="caption text-center"
                        :class="!i.vald ? 'red--text text--darken-2' : 'success--text text--darken-1'"
                      >
                        <span v-show="!i.vald">+ </span>
                        {{ i.offs }}
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>

            </span>

          </v-expansion-panel-content>
        </v-expansion-panel>

      </v-expansion-panels>

    </v-card>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setVolume } from '@/configs/functions/getvolume.js'
import { getDigits } from '@/configs/functions/getDigits.js'

export default {
  name: 'SceneDrawerTop',
  props: {
    area: {
      type: Object,
      default: () => {}
    },
    scenePage: {
      type: Number,
      default: 0
    },
    scenePageMax: {
      type: Number,
      default: 0
    },
    areaPage: {
      type: Number,
      default: 0
    },
    areaMaxPage: {
      type: Number,
      default: 0
    },
    plus: {
      type: Object,
      default: () => {}
    },
    maxn: {
      type: Object,
      default: () => {}
    },
    axis: {
      type: Object,
      default: () => {}
    },
    ldms: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsCargo', 'unitsLoads']),

    pageResult() {

      if (!this.plus?.cn && !this.plus?.quanty) return Object.freeze({ brutto: 0, count: 0, volume: 0 })

      const i = this.plus
      const vl = i?.vl ? i.vl : 0
      const wg = i?.wg ? i.wg : 0
      
      const volume = setVolume(vl)
      const brutto = getDigits(getWght(wg, this.unitsLoads.wght))

      return Object.freeze({
        brutto,
        count: i?.cn ? i.cn : 0,
        volume
      })
    },

    pageFree() {

      let vl = getDigits(Number(this.area?.vl) - Number(this.pageResult['volume']))
      let wg = getDigits(Number(this.area?.wf) - Number(this.pageResult['brutto']))

      if (wg < 0) wg = this.area.vl
      if (vl < 0) vl = this.area.wf

      return Object.freeze({ vl, wg })
    },

    options() {

      const o = {
        max: [],
        ldm: [],
        tt: [],
        pp: []
      }

      if (!this.pageResult['count']) return o

      const ln = this.area?.base?.ln ? getSize(this.area.base.ln, this.unitsCargo.size) : 0
      const hg = this.area?.base?.hg ? getSize(this.area.base.hg, this.unitsCargo.size) : 0
      const wd = this.area?.base?.wd ? getSize(this.area.base.wd, this.unitsCargo.size) : 0

      const u = this.$t('units.size.' + this.unitsCargo.size)
      const w = this.$t('units.wght.' + this.unitsLoads.wght) 

      /**
       * max sizes
       * 
       */

      if (this.maxn?.l && ln) {

        const o_ln = getSize(this.area.base.ln - this.maxn.l, this.unitsCargo.size)

        o.max.push({ 
          head: this.$t('scene.results.max.length'),
          reslt: getSize(this.maxn.l, this.unitsCargo.size) + ' ' + u,
          maxmm: ln + ' ' + u,
          offst: o_ln  + ' ' + u,
          valid: o_ln < 0 ? false : true
        })
      }

      if (this.maxn?.w && wd) {

        const o_wd =  getSize(this.area.base.wd - this.maxn.w, this.unitsCargo.size)

        o.max.push({ 
          head: this.$t('scene.results.max.width'),
          reslt: getSize(this.maxn.w, this.unitsCargo.size) + ' ' + u,
          maxmm: wd + ' ' + u,
          offst: o_wd  + ' ' + u,
          valid: o_wd < 0 ? false : true
        })
      }

      if (this.maxn?.h && hg) {

        const o_hg =  getSize(this.area.base.hg - this.maxn.h, this.unitsCargo.size)

        o.max.push({ 
          head: this.$t('scene.results.max.height'),
          reslt: getSize(this.maxn.h, this.unitsCargo.size) + ' ' + u,
          maxmm: hg + ' ' + u,
          offst: o_hg + ' ' + u,
          valid: o_hg < 0 ? false : true
        })
      }

      /**
       * 
       * ldm
       * 
       */

      if (this.ldms) {
        o.ldm.push({
          head: this.$t('scene.results.opt.head'),
          reslt: getSize(this.ldms, this.unitsCargo.size) + ' ' + u,
          maxmm: ln + ' ' + u,
          offst: getSize(this.maxn.l - this.ldms, this.unitsCargo.size) + ' ' + u
        })
      }

      /**
       * 
       * tt
       * 
       */

      if (this.axis?.tt) {

        const tt = Object.values(this.axis.tt)

        if (tt.length) {
          
          tt.forEach((t, x) => {

            const head = `${this.$t('scene.results.axies.label')} ${x + 1} `
            const text = getWght(t.val, this.unitsLoads.wght) + ' ' + w
            const maxn = getWght(t.max, this.unitsLoads.wght) + ' ' + w
            const offs = getWght(t.val - t.max, this.unitsLoads.wght) + ' ' + w
            const vald = t.val > t.max ? false : true

            o.tt.push({ head, text, maxn, offs, vald })

          })
        }
      }

      /**
       * 
       * pp
       * 
       */

      if (this.axis?.pp) {

        const pp = Object.values(this.axis.pp)

        if (pp.length) {
          
          pp.forEach((p, x) => {

            const head = `${this.$t('scene.results.axies.label')} ${x + 1} `
            const text = getWght(p.val, this.unitsLoads.wght) + ' ' + w
            const maxn = getWght(p.max, this.unitsLoads.wght) + ' ' + w
            const offs = getWght(p.val - p.max, this.unitsLoads.wght) + ' ' + w
            const vald = p.val > p.max ? false : true

            o.pp.push({ head, text, maxn, offs, vald })

          })
        }
      }
    
      for (const p of Object.keys(o)) o[p] = Object.freeze(o[p])

      return o
    }
  },
  methods: {

    // AREA
    nextArea() {
      this.$emit('nextArea')
    },

    prevArea() {
      this.$emit('prevArea')
    },

    // PAGE
    nextPage() {      
      this.$emit('nextPage', this.scenePage)
    },

    prevPage() {
      this.$emit('prevPage', this.scenePage)
    }

  }
}
</script>