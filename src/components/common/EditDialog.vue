<template>
  <v-dialog
    v-model="dialog"
    max-width="439"
  >
    <v-card
      class="rounded-lg"
    >
      <v-subheader class="font-weight-regular text-body-2">
        {{ t('common.all_edit') }}
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
                {{ t('item.color') }} {{ colorText }}
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
            {{ t('common.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            type="submit"
          >
            {{ t('common.ok') }}
          </v-btn>

        </v-card-actions>

      </v-form>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, decimal, maxValue, minValue, integer, maxLength } from '@vuelidate/validators'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setWght, setSize } from '@/configs/functions/setunits.js'
import { getCargoIcon } from '@/configs/functions/geticon.js'
import {useUserStore} from "../../stores/user";
import {useI18n} from "vue-i18n";

const {t} = useI18n()

const userStore =useUserStore()

const dialog = ref(false)

const colorMenu = ref(false)
const colorDefault = Object.freeze('#999999')

const start = reactive({
  ln: {
    min: 0,
    max: 0,
  },
  wd: {
    min: 0,
    max: 0,
  },
  hg: {
    min: 0,
    max: 0,
  },
  wg: {
    min: 0,
    max: 0,
  },
  nm: {
    min: 0,
    max: 0,
  },
  cn: {
    min: 0,
    max: 0,
  }
})

const un = reactive({
  size: 0,
  wght: 0,
})

const form = reactive({
  nm: null as string | null,
  ln: null as number | null,
  wd: null as number | null,
  hg: null as number | null,
  wg: null as number | null,
  cn: null as number | null,
  pg: null as number | null,
  st: null as number | null,
  lm: null as number | null,
  rt: null as number | null,
  ov: null as number | null,
  color: '#000000'
})

const validationRules = {
  nm: { maxLength: maxLength(start.nm.max) },
  ln: { decimal, minValue: minValue(getSize(start.ln.min, un.size)), maxValue: maxValue(getSize(start.ln.max, un.size)) },
  wd: { decimal, minValue: minValue(getSize(start.wd.min, un.size)), maxValue: maxValue(getSize(start.wd.max, un.size)) },
  hg: { decimal, minValue: minValue(getSize(start.hg.min, un.size)), maxValue: maxValue(getSize(start.hg.max, un.size)) },
  wg: { decimal, minValue: minValue(getWght(start.wg.min, un.wght)), maxValue: maxValue(getWght(start.wg.max, un.wght)) },
  cn: { integer, minValue: minValue(start.cn.min), maxValue: maxValue(start.cn.max) },
  pg: { required },
  st: { required },
  rt: { required },
  ov: { required },
  lm: {}
}

const v$ = useVuelidate(validationRules, form)

const colorText = computed(() => {
  return form.color !== colorDefault ? 'выбран' : 'не выбран'
})

const submit = () => {
  v$.value.$touch()
  if (v$.value.$invalid) return false

  const cr_validation = new RegExp(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
  const result = {
    nm: form.nm !== null ? String(form.nm) : null,
    ln: form.ln !== null ? setSize(form.ln, un.size) : null,
    wd: form.wd !== null ? setSize(form.wd, un.size) : null,
    hg: form.hg !== null ? setSize(form.hg, un.size) : null,
    wg: form.wg !== null ? setWght(form.wg, un.wght) : null,
    cn: form.cn !== null ? Number(form.cn) : null,
    pg: form.pg !== null ? Number(form.pg) : null,
    st: form.st !== null ? Number(form.st) : null,
    lm: form.lm !== null && form.st === 1 ? setWght(form.lm, un.wght) : null,
    rt: form.rt !== null ? Number(form.rt) : null,
    ov: form.ov !== null ? Number(form.ov) : null,
    cr: form.color !== colorDefault && cr_validation.test(form.color) ? form.color : null
  }

  dialog.value = false
}

const open = () => {
  resetForm()
  dialog.value = true
}

const close = () => {
  dialog.value = false
}

const resetForm = () => {
  form.nm = null
  form.ln = null
  form.wd = null
  form.hg = null
  form.wg = null
  form.cn = null
  form.pg = null
  form.st = null
  form.lm = null
  form.rt = null
  form.ov = null
  form.color = colorDefault

  un.size = userStore.config.units.cargo.size
  un.wght = userStore.config.units.cargo.wght
}

const pgIcon = computed(() => {
  return Object.freeze(getCargoIcon(form.pg))
})

const subFieldText = (int, max) => {
  int = int ? int : 0
      return `${int} / ${getSize(max, userStore.config.units.cargo.size)}`
}

const dataErrors = (data, min, max, unit = '') => {
  const errors = []

  if (!data.$dirty) return errors
  !data.decimal  && errors.push(t('common.validation.decimal'))
  !data.minValue && errors.push(t('common.validation.minValue') + ' ' + min + ' ' + unit)
  !data.maxValue && errors.push(t('common.validation.maxValue') + ' ' + max + ' ' + unit)

  return errors
}

const countErrors = (data, min, max) => {
  const errors = []

  if (!data.$dirty) return errors
  !data.integer  && errors.push(t('common.validation.integer'))
  !data.minValue && errors.push(t('common.validation.minValue') + ' ' + min)
  !data.maxValue && errors.push(t('common.validation.maxValue') + ' ' + max)

  return errors
}

const selectErrors = (data) => {
  const errors = []

  if (!data.$dirty) return errors
  !data.includes && errors.push(t('common.validation.required'))

  return errors
}

const state = () => {

   form.nm = null
   form.ln = null
   form.wd = null
   form.hg = null
   form.wg = null
   form.cn = null

   form.pg = null
   form.st = null
   form.lm = null
   form.rt = null
   form.ov = null

   form.color = colorDefault

  un.size = userStore.config.units.cargo.size
  un.wght = userStore.config.units.cargo.wght
}

const list = (array, bool = false) => {

  const list = [...array]

  list.unshift({ text: 'common.null', value: null })

  if (bool) return Object.freeze(list.map((item) => { return { text: t(item.text), value: item.value }}))

  return Object.freeze(list.map((item) => item.value))

}
</script>
