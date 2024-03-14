<template>
  <div style="width:100%;">

    <v-card
      flat
      rounded="lg"
      class="ml-1 overflow-y-auto py-1 pb-2"
      :disabled="step"
    >

      <!-- OUTSIDE -->

      <span
        v-for="p in [...existList, ...floorList]" 
        :key="p.id"
        class="px-0"
      >
        <v-row
          dense
          class="text-caption text-uppercase font-weight-bold mt-1 mb-0 mx-0 px-2"
          :class="!p.index ? 'error--text' : 'primary--text'"
        >
          <v-col cols="7" class="text-truncate">{{ p.name }}</v-col>
          <v-col cols="5" class="font-weight-regular text-right">{{ p.plus }}</v-col>
        </v-row>
        
        <v-list
          :disabled="disabled"
          flat
        >
          <v-list-item-group
            :color="!p.index ? 'error' : 'primary'"
            class="px-0"
          >

            <v-scale-transition group>
              <v-lazy  
                v-for="i in p.list" 
                :key="i.id"
                :style="[p.index ? 'height:65px' : 'min-height:70px']"
              >

                <SceneItems
                  :id="String(i.id)"
                  :key="String(i.id)"
                  :sb="i.sb"                  
                  :color="String(i.cr)"
                  :name="String(i.nm)"
                  :text="i.sz + ', ' + i.cn + ' ' + $t('units.co')"
                  :icon="i.icon"
                  :select="String(i.id) === String(select) ? true : false"
                  @selectedOnDrawer="selectedOnDrawer"
                >

                  <template v-if="p.index" #subline>
                    <v-list-item-subtitle>                          
                      <v-icon
                        :color="i.st ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-layers-outline
                      </v-icon>                    
                      <v-icon 
                        :color="i.lm ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-plus
                      </v-icon>
                      <v-icon 
                        :color="i?.rt ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-swap-horizontal
                      </v-icon>
                      <v-icon 
                        :color="i?.ov ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-swap-vertical
                      </v-icon>
                    </v-list-item-subtitle>
                  </template>

                  <template v-if="!p.index" #adds>
                    <div class="error--text text-caption mb-1">
                      <div v-for="(v, index) in i.valid" :key="index">
                        <span>{{ v }}</span>
                      </div>                 
                    </div>
                  </template>

                </SceneItems>
              </v-lazy>
            </v-scale-transition>

          </v-list-item-group>
        </v-list>

      </span>

      <!-- INSIDE -->

      <span
        v-for="p in itemslist" 
        :key="p.id"
        class="px-0"
      >
        <v-row
          dense
          class="text-caption text-uppercase font-weight-bold mt-1 mb-0 mx-0 px-2"
          :class="!p.index && 'error--text'"
        >
          <v-col cols="7" class="text-truncate">{{ p.name }}</v-col>
          <v-col cols="5" class="font-weight-regular text-right">{{ p.plus }}</v-col>
        </v-row>
        
        <v-list
          :disabled="disabled"
          flat
        >
          <v-list-item-group
            :color="!p.index ? 'error' : 'primary'"
            class="px-0"
          >

            <v-scale-transition group>
              <v-lazy  
                v-for="i in p.list" 
                :key="i.id"
                :style="[p.index ? 'height:65px' : 'min-height:70px']"
              >

                <SceneItems
                  :id="String(i.id)"
                  :key="String(i.id)"
                  :sb="i.sb"                  
                  :color="String(i.cr)"
                  :name="String(i.nm)"
                  :text="i.sz + ', ' + i.cn + ' ' + $t('units.co')"
                  :icon="i.icon"
                  :select="String(i.id) === String(select) ? true : false"
                  @selectedOnDrawer="selectedOnDrawer"
                >

                  <template v-if="p.index" #subline>
                    <v-list-item-subtitle>                          
                      <v-icon
                        :color="i.st ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-layers-outline
                      </v-icon>                    
                      <v-icon 
                        :color="i.lm ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-plus
                      </v-icon>
                      <v-icon 
                        :color="i?.rt ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-swap-horizontal
                      </v-icon>
                      <v-icon 
                        :color="i?.ov ? 'grey darken-3' : 'grey lighten-1'"
                        small
                        class="mr-1"
                      >
                        mdi-swap-vertical
                      </v-icon>
                    </v-list-item-subtitle>
                  </template>

                  <template v-if="!p.index" #adds>
                    <div class="error--text text-caption mb-1">
                      <div v-for="(v, index) in i.valid" :key="index">
                        <span>{{ v }}</span>
                      </div>                 
                    </div>
                  </template>

                </SceneItems>
              </v-lazy>
            </v-scale-transition>

          </v-list-item-group>
        </v-list>

      </span>
    </v-card>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getWght } from '@/configs/functions/getunits.js'
import { getText } from '@/configs/functions/gettext.js'
import { getDigits } from '@/configs/functions/getDigits.js'
import { getCargoIcon } from '@/configs/functions/geticon.js'

export default {
  name: 'SceneDataLoads',
  components: {
    SceneItems: () => import(/* webpackPrefetch: true */ '@/components/cargo/SceneItems')
  },
  props: {
    area: {
      type: Object,
      default: () => {}
    },
    exist: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    floor: {
      type: Array,
      default: () => []
    },
    select: {
      type: String,
      default: ''
    },
    step: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      disabled: false
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsCargo', 'unitsLoads']),

    existList() {
      if (!this.exist.length) return []

      const list = this.exist.map((list) => {

        const i = {
          id: Number(list.id),
          nm: String(list.name),
          ln: Number(list.length),
          wd: Number(list.width),
          hg: Number(list.height),
          wg: Number(list.weight),
          cr: String(list.color),
          cn: Number(list.count),
          sb: Number(list.subling),
          icon: null,
          sz: null,
          valid: []
        }

        /** иконка */
        i.icon = getCargoIcon(list.packing)

        /** общий текст размеров груза без количества */
        i.sz = getText(
          i,
          this.$t('units.size.' + this.unitsCargo.size),
          this.$t('units.wght.' + this.unitsCargo.wght),
          this.unitsCargo)

        if (i.ln > this.area?.base.ln) i.valid.push(this.$t('scene.valid.existList.ln'))
        if (i.wd > this.area?.base.wd) i.valid.push(this.$t('scene.valid.existList.wd'))
        if (i.hg > this.area?.base.hg) i.valid.push(this.$t('scene.valid.existList.hg'))
        if (i.wg > this.area?.base.wg) i.valid.push(this.$t('scene.valid.existList.wg'))

        const rm = ['pg', 'ln', 'wg', 'hg', 'wd']

        rm.forEach((x) => delete i[x])

        for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

        return Object.freeze(i)
      })

      return [Object.freeze({ 
        id: 0, 
        name: this.$t('scene.exist'), 
        list: Object.freeze(list), 
        plus: null,
        index: 0
      })]

    },

    itemslist() {

      const r = []    

      this.items.forEach((item, index) => {

        let wg = 0, cn = 0

        // добавить текст описания каждой позиций
        const list = item.list.map((list) => {

          const i = {
            id: Number(list.id),
            nm: String(list.name),
            ln: Number(list.length),
            wd: Number(list.width),
            hg: Number(list.height),
            wg: Number(list.weight),
            cr: String(list.color),
            cn: Number(list.count),
            st: Number(list.stuck),
            lm: Number(list.limit),
            rt: Number(list.rotate),
            ov: Number(list.overturn),
            sb: Number(list.subling),
            icon: null,
            sz: null,
            valid: []
          }

          wg += i.wg * i.cn
          cn += i.cn

          /** иконка */
          i.icon = getCargoIcon(list.packing)

          /** общий текст размеров груза без количества */
          i.sz = getText(
            i,
            this.$t('units.size.' + this.unitsCargo.size),
            this.$t('units.wght.' + this.unitsCargo.wght),
            this.unitsCargo)

          const rm = ['pg', 'ln', 'wg', 'hg', 'wd']

          rm.forEach((x) => delete i[x])

          for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

          return Object.freeze(i)
        })

        /**
         * check total
         * 
         */

        if (!cn || !wg) return

        /**
         * total text 
         * 
         */

        const plus = getDigits(getWght(wg, this.unitsCargo.wght)) + ' ' + 
        this.$t('units.wght.' + this.unitsCargo.wght) + ', ' +
        cn + ' ' + this.$t('units.co')

        return r.push(Object.freeze({ 
          id: Object.freeze(item.id), 
          name: Object.freeze(item.name), 
          list: Object.freeze(list.reverse()), 
          plus: Object.freeze(plus),
          index: this.items.length - index
        }))

      })

      return r
    },

    floorList() {

      const result = []    

      let wg = 0, cn = 0

      this.floor.forEach((item) => {        

        // добавить текст описания каждой позиций
        item.list.forEach((list) => {

          const i = {
            id: Number(list.id),
            nm: String(list.name),
            ln: Number(list.length),
            wd: Number(list.width),
            hg: Number(list.height),
            wg: Number(list.weight),
            cr: String(list.color),
            cn: Number(list.count),
            st: Number(list.stuck),
            lm: Number(list.limit),
            rt: Number(list.rotate),
            ov: Number(list.overturn),
            sb: Number(list.subling),
            icon: null,
            sz: null,
            valid: []
          }

          wg += i.wg * i.cn
          cn += i.cn

          /** иконка */
          i.icon = getCargoIcon(list.packing)

          /** общий текст размеров груза без количества */
          i.sz = getText(
            i,
            this.$t('units.size.' + this.unitsCargo.size),
            this.$t('units.wght.' + this.unitsCargo.wght),
            this.unitsCargo)

          const rm = ['pg', 'ln', 'wg', 'hg', 'wd']

          rm.forEach((x) => delete i[x])

          for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])

          return result.push(Object.freeze(i))

        })

        return

      })

      if (!result.length) return []

      /**
       * total text 
       * 
       */

      const plus = getDigits(getWght(wg, this.unitsCargo.wght)) + ' ' + 
      this.$t('units.wght.' + this.unitsCargo.wght) + ', ' +
      cn + ' ' + this.$t('units.co')

      return [Object.freeze({ 
        id: 1, 
        name: this.$t('scene.floor'), 
        list: Object.freeze(result), 
        plus: plus,
        index: 1
      })]

    }
  },
  methods: {

    selectedOnDrawer(id) {
      
      /**
       * event to scene
       * 
       */

      this.$emit('selectedOnDrawer', id)

      /**
       * disable drawer
       *  
       */

      this.disabled = true

      /**
       * change drawer disable
       * 
       */

      setTimeout(() => {
        this.disabled = false
      }, 1750)
    }

  }
}
</script>