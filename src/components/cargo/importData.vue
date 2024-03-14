<template>
  <div>

    <!-- UNIT -->
    <div class="d-flex align-center py-0 pl-1">
      <v-radio-group
        v-model="un['size']"
        class="mr-3"
        mandatory
        row
      >
        <v-radio
          :label="$t('units.mm')"
          value="0"
        ></v-radio>
        <v-radio
          :label="$t('units.sm')"
          value="1"
        ></v-radio>
        <v-radio
          :label="$t('units.m')"
          value="2"
        ></v-radio>
      </v-radio-group>

      <v-spacer></v-spacer>

      <v-radio-group
        v-model="un['wght']"
        row
      >
        <v-radio
          :label="$t('units.kg')"
          value="0"
        ></v-radio>
        <v-radio
          :label="$t('units.tn')"
          value="1"
        ></v-radio>
      </v-radio-group>
    </div>

    <!-- DATA -->
    <v-form @submit.prevent="submit()">
      <v-simple-table dense fixed-header height="62vh" class="mb-2 mt-1">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="px-0">
                <v-toolbar elevation="6" color="primary lighten-3" rounded>
                  <v-row dense align="center" class="text-subtitle-2 font-weight-bold px-0">
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1" class="px-1">№</v-col>
                    <v-col cols="2" class="px-2">{{ $t('common.name') }}</v-col>
                    <v-col cols="2" lg="1" class="px-2">{{ $t('item.ln.label') }}</v-col>
                    <v-col cols="2" lg="1" class="px-2">{{ $t('item.wd.label') }}</v-col>
                    <v-col cols="2" lg="1" class="px-2">{{ $t('item.hg.label') }}</v-col>
                    <v-col cols="2" lg="1" class="px-2">{{ $t('item.wg.label') }}</v-col> 
                    <v-col cols="1" class="px-2">{{ $t('item.cn.label') }}</v-col>
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1" class="px-2">{{ $t('item.pg.label') }}</v-col>
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1" class="px-2">{{ $t('item.st.label') }}</v-col>
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1" class="px-2">{{ $t('item.lm.label') }}</v-col>
                    <v-col cols="1"></v-col>                 
                  </v-row>
                </v-toolbar>
              </th>           
            </tr>
          </thead>
          <tbody is="transition-group" name="scale-transition" hide-on-leave>
            <tr
              v-for="(item, index) in $v.items.$each.$iter"
              :key="item.$model.id"
              style="height:104px"
            >
              <td :id="'vrow-' + item.$model.id" style="height:104px" :class="light === item.$model.id && 'red lighten-5'">
                <v-lazy>
                  <v-row
                    dense
                    align="center"    
                  >
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1">{{ Number(index) + 1 }}</v-col>
                    <v-col cols="2">
                      <v-text-field
                        v-model="item.$model.nm"
                        class="pt-3"
                        :error-messages="nmErrors[index]"
                        :maxlength="start.nm.max"
                        required
                        single-line
                        solo
                        flat
                        dense
                        @input="$v.items.$each.$iter[index].nm.$touch()"
                      >
                      </v-text-field>
                    </v-col>
                    <v-col cols="2" lg="1">
                      <v-text-field
                        v-model="item.$model.ln"
                        class="pt-3"
                        :error-messages="lnErrors[index]"
                        step="0.1"
                        required
                        single-line
                        solo
                        flat
                        dense
                        type="number"
                        @input="$v.items.$each.$iter[index].ln.$touch()"
                        @blur="$v.items.$each.$iter[index].ln.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" lg="1">
                      <v-text-field
                        v-model="item.$model.wd"
                        class="pt-3"
                        :error-messages="wdErrors[index]"
                        step="0.1"
                        required
                        single-line
                        solo
                        flat
                        dense
                        type="number"
                        @input="$v.items.$each.$iter[index].wd.$touch()"
                        @blur="$v.items.$each.$iter[index].wd.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" lg="1">
                      <v-text-field
                        v-model="item.$model.hg"
                        class="pt-3"
                        :error-messages="hgErrors[index]"
                        step="0.1"
                        required
                        single-line
                        solo
                        flat
                        dense
                        type="number"
                        @input="$v.items.$each.$iter[index].hg.$touch()"
                        @blur="$v.items.$each.$iter[index].hg.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2" lg="1">
                      <v-text-field
                        v-model="item.$model.wg"
                        class="pt-3"
                        :error-messages="wgErrors[index]"
                        step="0.1"
                        required
                        single-line
                        solo
                        flat
                        dense
                        type="number"
                        @input="$v.items.$each.$iter[index].wg.$touch()"
                        @blur="$v.items.$each.$iter[index].wg.$touch()"
                      ></v-text-field>
                    </v-col> 
                    <v-col cols="1">
                      <v-text-field
                        v-model="item.$model.cn"
                        class="pt-3"
                        :error-messages="cnErrors[index]"
                        step="1"
                        required
                        single-line
                        solo
                        flat
                        dense
                        type="number"
                        @input="$v.items.$each.$iter[index].cn.$touch()"
                        @blur="$v.items.$each.$iter[index].cn.$touch()"
                      ></v-text-field>  
                    </v-col>
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1">
                      <v-select
                        v-model="item.$model.pg"
                        class="pt-3"
                        dense
                        single-line
                        solo
                        flat
                        :items="packingList"
                        :error-messages="pgErrors[index]"
                        required
                      ></v-select>
                    </v-col>
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1">
                      <v-select
                        v-model="item.$model.st"
                        class="pt-3"
                        dense
                        single-line
                        solo
                        flat
                        :items="stuckList"
                        :error-messages="stErrors[index]"
                        required
                      ></v-select>
                    </v-col>
                    <v-col v-show="!$vuetify.breakpoint.mobile" cols="1">
                      <v-text-field
                        v-model="item.$model.lm"
                        class="pt-3"
                        dense
                        single-line
                        solo
                        flat
                        :error-messages="lmErrors[index]"
                        step="1"
                        type="number"
                        @input="$v.items.$each.$iter[index].lm.$touch()"
                        @blur="$v.items.$each.$iter[index].lm.$touch()"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1" class="text-right">
                      <v-btn
                        icon
                        @click="deleteRow(item.$model.id)"
                      >
                        <v-icon>bx-trash</v-icon>
                      </v-btn>  
                    </v-col>                 
                  </v-row>
                </v-lazy>
              </td>
            </tr>
          </tbody>

          <v-divider></v-divider>

        </template>        
      </v-simple-table>      

      <!-- BTN -->
      <div class="d-flex align-center">
        <v-btn
          rounded
          text
          class="button grey--text text--darken-3"
          @click="$emit('back')"
        >
          {{ $t('common.back') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          elevation="6"
          color="primary"
          rounded
          class="px-2"
          type="submit"
        >
          <span v-show="!$v.items.$error">{{ $t('common.add') }}</span>
          <span v-show="$v.items.$error">{{ $t('common.check') }}</span>
        </v-btn>
      </div>

    </v-form>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, maxLength, integer, decimal, maxValue, minValue } from 'vuelidate/lib/validators'
import validMixin from '@/mixins/validItem.js'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setWght, setSize } from '@/configs/functions/setunits.js'

export default {
  name: 'ImportDataTable',
  mixins: [validationMixin, validMixin],
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // @start validMixin

      // highlight the error
      light: null
    }
  },
  validations() {
    return {
      items: {
        required,
        $each: {
          id: {

          },
          nm: { 
            required,
            maxLength: maxLength(this.start.nm.max)
          },
          ln: {
            required,
            decimal,
            minValue: minValue(getSize(this.start.ln.min, this.un.size)),
            maxValue: maxValue(getSize(this.start.ln.max, this.un.size))
          },
          wd: {
            required,
            decimal,
            minValue: minValue(getSize(this.start.wd.min, this.un.size)),
            maxValue: maxValue(getSize(this.start.wd.max, this.un.size))
          },
          hg: {
            required,
            decimal,
            minValue: minValue(getSize(this.start.hg.min, this.un.size)),
            maxValue: maxValue(getSize(this.start.hg.max, this.un.size))
          },
          wg: {
            required,
            decimal,
            minValue: minValue(getWght(this.start.wg.min, this.un.wght)),
            maxValue: maxValue(getWght(this.start.wg.max, this.un.wght))
          },
          cn: {
            required,
            integer,
            minValue: minValue(this.start.cn.min),
            maxValue: maxValue(this.start.cn.max)
          },
          lm: {
            required,
            decimal,
            minValue: minValue(getWght(this.start.lm.min, this.un.wght)),
            maxValue: maxValue(getWght(this.start.lm.max, this.un.wght))
          },
          pg: {
            required
          },
          st: {
            required
          },
          rt: {
            
          },
          ov: {
            
          }
        }        
      }
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsCargo']),

    /**
     * validMixin:
     * lnValues()
     * wdValues()
     * hgValues()
     * wgValues()
     * lmValues()
     * packingList()
     * packingListValues()
     * stuckList()
     * stuckListValues()
     */

    nmErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.nameErrors(i[1].nm))

        return n
      }, {})
    },

    lnErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.dataErrors(i[1].ln, this.lnValues['min'][this.un.size], this.lnValues['max'][this.un.size], this.$t('units.size.' + this.un.size)))

        return n
      }, {})
    },

    wdErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.dataErrors(i[1].wd, this.wdValues['min'][this.un.size], this.wdValues['max'][this.un.size], this.$t('units.size.' + this.un.size)))

        return n
      }, {})
    },

    hgErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.dataErrors(i[1].hg, this.hgValues['min'][this.un.size], this.hgValues['max'][this.un.size], this.$t('units.size.' + this.un.size)))

        return n
      }, {})
    },

    wgErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.dataErrors(i[1].wg, this.wgValues['min'][this.un.wght], this.wgValues['max'][this.un.wght], this.$t('units.wght.' + this.un.wght)))

        return n
      }, {})
    },

    cnErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.countErrors(i[1].cn, this.start.cn['min'], this.start.cn['max']))

        return n
      }, {})
    },

    lmErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.dataErrors(i[1].lm, this.lmValues['min'][this.un.wght], this.lmValues['max'][this.un.wght], this.$t('units.wght.' + this.un.wght)))
      
        return n
      }, {})
    },

    pgErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.selectErrors(i[1].pg))

        return n
      }, {})
    },

    stErrors () {
      return Object.entries(this.$v.items.$each.$iter).reduce((n, i) => {
        n[i[0]] = Object.freeze(this.selectErrors(i[1].st))

        return n
      }, {})
    }
  },
  methods: {
    ...mapActions('app', ['showError']),

    /**
     * validMixin:
     * dataErrors()
     * nameErrors()
     * countErrors()
     * selectErrors()
     */

    submit() {

      if (!this.$v.items.$model.length) {
        this.showError(this.$t('import.data.empty'))
        
        return this.$emit('back')
      }
 
      this.$v.items.$touch()

      // error message
      if (this.$v.items.$error)  {

        const errorRows = this.getErrorRows()

        // console.log(errorRows)

        this.light = errorRows[0][1].$model.id
        document.getElementById('vrow-' + errorRows[0][1].$model.id).scrollIntoView({ block: 'center', behavior: 'smooth' })

        return this.showError(this.$tc('import.data.rowsInvalid', errorRows.length, { n: errorRows.length }))
      }

      const data = []
      const bool = [0, 1]

      for (const i of this.$v.items.$model) {
        data.push({
          id: null,
          nm: i.nm,
          ln: setSize(i.ln, this.un.size),
          wd: setSize(i.wd, this.un.size),
          hg: setSize(i.hg, this.un.size),
          wg: setWght(i.wg, this.un.wght), 
          cn: i.cn,
          pg: i.pg !== null && this.packingListValues.includes(i.pg) ? i.pg : this.start.pg.val,
          st: i.st !== null && this.stuckListValues.includes(i.st) ? i.st : this.start.st.val,
          lm: Number(i.lm) > 0 && (Number(i.st) === 1 || Number(i.st) === 3) ? setWght(i.lm, this.un.wght) : 0,
          rt: i.rt !== null && bool.includes(Number(i.rt)) ? Number(i.rt) : Number(this.start.rt.val),
          ov: i.ov !== null && bool.includes(Number(i.ov)) && Number(i.pg) !== 1 ? Number(i.ov) : Number(this.start.ov.val),
          cr: null,
          un: this.un
        })
      }

      return this.$emit('submit', data)
    },

    getErrorRows() {
      if (!this.$v.items.$model.length) return []

      const errorRows = Object.entries(this.$v.items.$each.$iter).filter((i) => i[1].$anyError)

      return errorRows
    },

    deleteRow(id) {
      const index = this.items.findIndex((i) => String(i.id) === String(id))

      this.items.splice(index, 1) 
    }
  }   
}
</script>