<template>
  <v-dialog
    v-model="dialog"
    max-width="439"
  >
    <v-card
      class="rounded-lg"
    >
      <v-subheader class="font-weight-regular text-body-2">
        {{ $t('common.all_edit') }}
      </v-subheader>

      <v-form class="mt-0" @submit.prevent="submit">
        <v-card-text class="pb-0">

          <v-row dense class="align-center">

            <!-- nm -->
            <v-col
              cols="12"
            >
              <v-text-field
                v-model="nm"
                :label="$t('item.nm.label')"
                :error-messages="nmErrors"
                :counter="start.nm.max"
                :maxlength="start.nm.max"
                dense
                clearable
                @click:clear="nm = null"
                @input="$v.nm.$touch()"
                @blur="$v.nm.$touch()"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="nm ? 'primary' : 'secondary'"
                    small
                  >
                    mdi-bookmark-check-outline
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- ln -->
            <v-col
              cols="6"
            >
              <v-text-field
                v-model="ln"
                :label="$t('item.ln.label')"
                :suffix="$t('units.size.' + un.size)"
                dense
                counter
                step="0.1"
                :counter-value="() => subFieldText(ln, start.ln.max)"
                :error-messages="lnErrors"
                type="number"
                @input="$v.ln.$touch()"
                @blur="$v.ln.$touch()"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="ln ? 'primary' : 'secondary'"
                    small
                  >
                    mdi-arrow-top-left
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- wd -->
            <v-col
              cols="6"
            >
              <v-text-field
                v-model="wd"
                :label="$t('item.wd.label')"
                :suffix="$t('units.size.' + un.size)"
                dense
                counter
                step="0.1"
                :counter-value="() => subFieldText(wd, start.wd.max)"
                :error-messages="wdErrors"
                type="number"
                @input="$v.wd.$touch()"
                @blur="$v.wd.$touch()"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="wd ? 'primary' : 'secondary'"
                    small
                  >
                    mdi-arrow-bottom-left
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- hg -->
            <v-col
              cols="6"
            >
              <v-text-field
                v-model="hg"
                :label="$t('item.hg.label')"
                :suffix="$t('units.size.' + un.size)"
                dense
                counter
                step="0.1"
                :counter-value="() => subFieldText(hg, start.hg.max)"
                :error-messages="hgErrors"
                type="number"
                @input="$v.hg.$touch()"
                @blur="$v.hg.$touch()"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="hg ? 'primary' : 'secondary'"
                    small
                  >
                    mdi-arrow-up
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- wg -->
            <v-col
              cols="6"
            >
              <v-text-field
                v-model="wg"
                :label="$t('item.wg.label')"
                :suffix="$t('units.wght.' + un.wght)"
                dense
                step="0.1"
                :error-messages="wgErrors"
                type="number"
                @input="$v.wg.$touch()"
                @blur="$v.wg.$touch()"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="wg ? 'primary' : 'secondary'"
                    small
                  >
                    mdi-weight-gram
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col
              cols="12"
            >
              <v-text-field
                v-model="cn"
                :label="$t('item.cn.label')"
                dense
                :error-messages="cnErrors"
                type="number"
                step="1"
                @input="$v.cn.$touch()"
                @blur="$v.cn.$touch()"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="cn ? 'primary' : 'secondary'"
                    small
                  >
                    mdi-tally-mark-4
                  </v-icon>
                </template>
              </v-text-field>
            </v-col>

            <!-- pg -->
            <v-col
              cols="6"
            >
              <v-select
                v-model="pg"
                dense
                :items="packingList"
                :label="$t('item.pg.label')"
                :error-messages="pgErrors"
                required
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="pg !== null ? 'primary' : 'secondary'"
                    small
                  >{{ pgIcon }}</v-icon>
                </template>
              </v-select>
            </v-col>
            <v-col
              class="d-flex"
              cols="6"
            >
              <v-select
                v-model="st"
                dense
                :label="$t('item.st.label')"
                :items="stuckList"
                :error-messages="stErrors"
                required
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="st !== null ? 'primary' : 'secondary'"
                    small
                  >mdi-layers-outline</v-icon>
                </template>
              </v-select>
            </v-col>

            <!-- LIMIT -->
            <v-fade-transition>
              <v-col
                v-if="st == 1"
                cols="12"
              >
                <v-text-field
                  v-model="lm"
                  dense
                  :label="$t('item.lm.label')"
                  :suffix="$t('units.wght.' + un.wght)"
                  :error-messages="lmErrors"
                  :hint="$t('item.lm.hint')"
                  persistent-hint
                  step="1"
                  type="number"
                  @input="$v.lm.$touch()"
                  @blur="$v.lm.$touch()"
                >
                  <template v-slot:prepend>
                    <v-icon small>mdi-plus</v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-fade-transition>

          </v-row>

          <v-row dense class="align-center">

            <v-col
              cols="6"
            >
              <v-select
                v-model="rt"
                dense
                :label="$t('item.rt.label')"
                :items="rotateList"
                :error-messages="rtErrors"
                required
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="rt !== null ? 'primary' : 'secondary'"
                    small
                  >mdi-swap-horizontal</v-icon>
                </template>
              </v-select>
            </v-col>

            <v-col
              cols="6"
            >
              <v-select
                v-model="ov"
                :disabled="pg === 1"
                dense
                :label="$t('item.ov.label')"
                :items="overList"
                :error-messages="ovErrors"
                required
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="ov !== null ? 'primary' : 'secondary'"
                    small
                  >mdi-swap-vertical</v-icon>
                </template>
              </v-select>
            </v-col>

            <v-col
              v-if="ov === 1"
              cols="12"
              class="red--text text-lighten-2 text-center text-caption"
            >
              Для грузов с типом упаковки <b>"Паллет"</b> изменение поле "Кантование" в значение <b>"Да"</b> будет пропущено
            </v-col>

            <v-col
              cols="6"
              class="pt-0"
            >
              <div
                class="pl-3 text-body-2"
                :class="color !== colorDefault ? 'primary--text' : 'text-secondary'"
              >
                {{ $t('item.color') }} {{ colorText }}
              </div>
              <div>
                <v-icon
                  :color="color !== colorDefault ? 'primary' : 'secondary'"
                  small
                >
                  mdi mdi-eyedropper-variant
                </v-icon>

                <v-menu
                  v-model="colorMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  class="ml-1"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon :color="color">
                        mdi mdi-circle
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-card>
                    <v-color-picker
                      v-model="color"
                      dot-size="25"
                      mode="hexa"
                    ></v-color-picker>
                  </v-card>
                </v-menu>

                <v-btn
                  v-if="color !== colorDefault"
                  icon
                  small
                  class="font-weight-regular text-uppercase red--text"
                  @click="color = colorDefault"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>

            </v-col>

          </v-row>

        </v-card-text>

        <v-card-actions>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            class="font-weight-medium"
            text
            @click="close"
          >
            {{ $t('common.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            type="submit"
          >
            {{ $t('common.ok') }}
          </v-btn>

        </v-card-actions>

      </v-form>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setWght, setSize } from '@/configs/functions/setunits.js'
import { getCargoIcon } from '@/configs/functions/geticon.js'
import { validationMixin } from 'vuelidate'
import validMixin from '@/mixins/validItem.js'
import { decimal, maxValue, minValue, integer, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'EditDialog',
  mixins: [validationMixin, validMixin],
  data() {
    return {
      dialog: false,

      colorMenu: false,
      colorDefault: Object.freeze('#999999'),

      nm: null,
      ln: null,
      wd: null,
      hg: null,
      wg: null,
      cn: null,

      pg: null,
      st: null,
      lm: null,
      rt: null,
      ov: null,

      color: '#000000'

    }
  },
  validations() {
    return {
      nm: {
        maxLength: maxLength(this.start.nm.max)
      },
      ln: {
        decimal,
        minValue: minValue(getSize(this.start.ln.min, this.un.size)),
        maxValue: maxValue(getSize(this.start.ln.max, this.un.size))
      },
      wd: {
        decimal,
        minValue: minValue(getSize(this.start.wd.min, this.un.size)),
        maxValue: maxValue(getSize(this.start.wd.max, this.un.size))
      },
      hg: {
        decimal,
        minValue: minValue(getSize(this.start.hg.min, this.un.size)),
        maxValue: maxValue(getSize(this.start.hg.max, this.un.size))
      },
      wg: {
        decimal,
        minValue: minValue(getWght(this.start.wg.min, this.un.wght)),
        maxValue: maxValue(getWght(this.start.wg.max, this.un.wght))
      },
      cn: {
        integer,
        minValue: minValue(this.start.cn.min),
        maxValue: maxValue(this.start.cn.max)
      },
      pg: {
        includes: (value) => this.packingListValues.includes(value)
      },
      st: {
        includes: (value) => this.stuckListValues.includes(value)
      },
      rt: {
        includes: (value) => this.rotateListValues.includes(value)
      },
      ov: {
        includes: (value) => this.overListValues.includes(value)
      },
      lm: this.limitValid,

      validationGroup: ['nm', 'ln', 'wd', 'hg', 'wg', 'cn', 'lm', 'pg', 'st', 'rt', 'ov']
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsCargo']),

    colorText() {
      if (this.color !== this.colorDefault) return 'выбран'

      return 'не выбран'
    },

    nmErrors () {
      const errors = []

      if (!this.$v.nm.$dirty) return errors
      !this.$v.nm.maxLength && errors.push(this.$t('common.validation.maxLength') + ' ' + this.start.nm.max)

      return errors
    },

    lnErrors () {
      return this.dataErrors(this.$v.ln, this.lnValues['min'][this.un.size], this.lnValues['max'][this.un.size], this.$t('units.size.' + this.un.size))
    },

    wdErrors () {
      return this.dataErrors(this.$v.wd, this.wdValues['min'][this.un.size], this.wdValues['max'][this.un.size], this.$t('units.size.' + this.un.size))
    },

    hgErrors () {
      return this.dataErrors(this.$v.hg, this.hgValues['min'][this.un.size], this.hgValues['max'][this.un.size], this.$t('units.size.' + this.un.size))
    },

    cnErrors () {
      return this.countErrors(this.$v.cn, this.start.cn['min'], this.start.cn['max'])
    },

    wgErrors () {
      return this.dataErrors(this.$v.wg, this.wgValues['min'][this.un.wght], this.wgValues['max'][this.un.wght], this.$t('units.wght.' + this.un.wght))
    },

    pgErrors () {
      return this.selectErrors (this.$v.pg)
    },

    stErrors () {
      return this.selectErrors (this.$v.st)
    },

    rtErrors () {
      return this.selectErrors (this.$v.rt)
    },

    ovErrors () {
      return this.selectErrors (this.$v.ov)
    },

    lmErrors () {
      return this.dataErrors(this.$v.lm, this.lmValues['min'][this.un.wght], this.lmValues['max'][this.un.wght], this.$t('units.wght.' + this.un.wght), false)
    },

    limitValid() {
      if (this.st === 1) {

        return {
          decimal,
          minValue: minValue(getWght(this.start.lm.min, this.un.wght)),
          maxValue: maxValue(getWght(this.start.lm.max, this.un.wght))
        }
      }

      return {}
    },

    packingList() {
      return Object.freeze(this.list(this.start.pg.default, true))
    },

    packingListValues() {
      return Object.freeze(this.list(this.start.pg.default))
    },

    stuckList() {
      return Object.freeze(this.list(this.start.st.default, true))
    },

    stuckListValues() {
      return Object.freeze(this.list(this.start.st.default))
    },

    rotateList() {
      return Object.freeze(this.list(this.start.rt.default, true))
    },

    rotateListValues() {
      return Object.freeze(this.list(this.start.rt.default))
    },

    overList() {
      return Object.freeze(this.list(this.start.ov.default, true))
    },

    overListValues() {
      return Object.freeze(this.list(this.start.ov.default))
    },

    pgIcon () {
      return Object.freeze(getCargoIcon(this.pg))
    }

  },
  methods: {

    submit() {

      /**
       * валидация
       *
       */

      this.$v.$touch()

      if (this.$v.validationGroup.$error) return false

      const cr_validation = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)

      const result = {
        nm: this.nm !== null ? String(this.nm) : null,
        ln: this.ln !== null ? setSize(this.ln, this.un.size) : null,
        wd: this.wd !== null ? setSize(this.wd, this.un.size) : null,
        hg: this.hg !== null ? setSize(this.hg, this.un.size) : null,
        wg: this.wg !== null ? setWght(this.wg, this.un.wght) : null,
        cn: this.cn !== null ? Number(this.cn) : null,

        pg: this.pg !== null ? Number(this.pg) : null,
        st: this.st !== null ? Number(this.st) : null,
        lm: this.lm !== null && this.st === 1 ? setWght(this.lm, this.un.wght) : null,
        rt: this.rt !== null ? Number(this.rt) : null,
        ov: this.ov !== null ? Number(this.ov) : null,
        cr: this.color !== this.colorDefault && cr_validation.test(this.color) ? this.color : null
      }

      this.dialog = false
      this.resolve(result)
    },

    open() {

      this.state()
      this.dialog = true

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })

    },

    close() {

      this.resolve(false)
      this.dialog = false

    },

    subFieldText (int, max) {
      int = int ? int : 0

      return `${int} / ${getSize(max, this.un.size)}`
    },

    dataErrors(data, min, max, unit = '') {
      const errors = []

      if (!data.$dirty) return errors
      !data.decimal  && errors.push(this.$t('common.validation.decimal'))
      !data.minValue && errors.push(this.$t('common.validation.minValue') + ' ' + min + ' ' + unit)
      !data.maxValue && errors.push(this.$t('common.validation.maxValue') + ' ' + max + ' ' + unit)

      return errors
    },

    countErrors(data, min, max) {
      const errors = []

      if (!data.$dirty) return errors
      !data.integer  && errors.push(this.$t('common.validation.integer'))
      !data.minValue && errors.push(this.$t('common.validation.minValue') + ' ' + min)
      !data.maxValue && errors.push(this.$t('common.validation.maxValue') + ' ' + max)

      return errors
    },

    selectErrors(data) {
      const errors = []

      if (!data.$dirty) return errors
      !data.includes && errors.push(this.$t('common.validation.required'))

      return errors
    },

    state () {

      this.nm = null
      this.ln = null
      this.wd = null
      this.hg = null
      this.wg = null
      this.cn = null

      this.pg = null
      this.st = null
      this.lm = null
      this.rt = null
      this.ov = null

      this.color = this.colorDefault

      // un
      this.un.size = String(this.unitsCargo.size)
      this.un.wght = String(this.unitsCargo.wght)

    },

    list(array, bool = false) {

      const list = [...array]

      list.unshift({ text: 'common.null', value: null })

      if (bool) return Object.freeze(list.map((item) => { return { text: this.$t(item.text), value: item.value }}))

      return Object.freeze(list.map((item) => item.value))

    }

  }
}
</script>
// lang ok
