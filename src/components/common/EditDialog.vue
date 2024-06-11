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
              <text-field
                  v-model:value="nm"
                  label="item.nm.label"
                  clearable
                  :size="start.nm.max"
                  :config="{
                    max: start.nm.max
                  }"
              >
                <v-icon
                    :color="nm ? 'primary' : 'secondary'"
                    small
                >
                  mdi:mdi-bookmark-check-outline
                </v-icon>
              </text-field>
            </v-col>

            <!-- ln -->
            <v-col
              cols="6"
            >
              <number-field
                  v-model:value="ln"
                  label="item.ln.label"
                  suffix="units.size"
                  :size="un.size"
                  :step="0.1"
                  :config="{
                    max: start.ln.max,
                    min: start.ln.min
                  }"
              >
                <v-icon
                    :color="ln ? 'primary' : 'secondary'"
                    small
                >
                  mdi:mdi-arrow-top-left
                </v-icon>
              </number-field>
            </v-col>

            <!-- wd -->
            <v-col
              cols="6"
            >
              <number-field
                  v-model:value="wd"
                  label="item.wd.label"
                  suffix="units.size"
                  :size="un.size"
                  :step="0.1"
                  :config="{
                    max: start.wd.max,
                    min: start.wd.min
                  }"
              >
                <v-icon
                    :color="wd ? 'primary' : 'secondary'"
                    small
                >
                  mdi:mdi-arrow-bottom-left
                </v-icon>
              </number-field>
            </v-col>

            <!-- hg -->
            <v-col
              cols="6"
            >
              <number-field
                  v-model:value="hg"
                  label="item.hg.label"
                  suffix="units.size"
                  :size="un.size"
                  :step="0.1"
                  :config="{
                    max: start.wd.max,
                    min: start.wd.min
                  }"
              >
                <v-icon
                    :color="hg ? 'primary' : 'secondary'"
                    small
                >
                  mdi:mdi-arrow-up
                </v-icon>
              </number-field>
            </v-col>

            <!-- wg -->
            <v-col
              cols="6"
            >
              <number-field
                  v-model:value="wg"
                  label="item.wg.label"
                  suffix="units.wght"
                  :size="un.wght"
                  :is-size="false"
                  :step="0.1"
                  :config="{
                    max: start.wg.max,
                    min: start.wg.min
                  }"
              >
                <v-icon
                    :color="wg ? 'primary' : 'secondary'"
                    small
                >
                  mdi:mdi-weight-gram
                </v-icon>
              </number-field>
            </v-col>

            <v-col
              cols="12"
            >
              <number-field
                  v-model:value="cn"
                  label="item.cn.label"
                  suffix="units.size"
                  :size="un.size"
                  :step="1"
                  :config="{
                    max: start.cn.max,
                    min: start.cn.min
                  }"
              >
                <v-icon
                    :color="cn ? 'primary' : 'secondary'"
                    small
                >
                  mdi:mdi-tally-mark-4
                </v-icon>
              </number-field>
            </v-col>

            <!-- pg -->
            <v-col
              cols="6"
            >
              <select-field
                  v-model:value="pg"
                  label="item.pg.label"
                  :items="packingList"
                  :icon="pgIcon"
              />
            </v-col>
            <v-col
              class="d-flex"
              cols="6"
            >
              <select-field
                  v-model:value="st"
                  label="item.st.label"
                  :items="stuckList"
                  icon="mdi:mdi-layers-outline"
              />
            </v-col>

            <!-- LIMIT -->
            <v-fade-transition>
              <v-col
                v-if="st == 1"
                cols="12"
              >
                <number-field
                    v-model:value="lm"
                    label="item.lm.label"
                    suffix="units.wght"
                    hint="item.lm.hint"
                    :size="un.wght"
                    :is-size="false"
                    :step="1"
                    :config="{
                    max: start.lm.max,
                    min: start.lm.min
                  }"
                >
                  <v-icon small>mdi:mdi-plus</v-icon>
                </number-field>
              </v-col>
            </v-fade-transition>

          </v-row>

          <v-row dense class="align-center">

            <v-col
              cols="6"
            >
              <select-field
                  v-model:value="rt"
                  label="item.rt.label"
                  :items="rotateList"
                  icon="mdi:mdi-swap-horizontal"
              />
            </v-col>

            <v-col
              cols="6"
            >
              <select-field
                  v-model:value="ov"
                  label="item.ov.label"
                  :items="overList"
                  icon="mdi:mdi-swap-vertical"
              />
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
                  small
                  class="font-weight-regular text-uppercase red--text"
                  @click="color = colorDefault"
                >
                  <v-icon>{{ icons.close }}</v-icon>
                </v-btn>
              </div>

            </v-col>

          </v-row>

        </v-card-text>

        <v-card-actions>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            class="font-weight-medium no-uppercase"
            variant="text"
            @click="close"
          >
            {{ t('common.cancel') }}
          </v-btn>

          <v-btn
            color="primary"
            type="submit"
            class="no-uppercase"
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
import icons from "../../configs/constants/icons";

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

const v$ = useVuelidate()

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
