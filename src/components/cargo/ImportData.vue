<template>
  <div>
    <!-- UNIT -->
    <div class="d-flex align-center py-0 pl-1">
      <radio-group v-model:value="un.size" :items="unitSizeArray" inline />

      <v-spacer></v-spacer>

      <radio-group v-model:value="un.wght" :items="unitWeightArray" inline />
    </div>

    <!-- DATA -->
    <v-form @submit.prevent="submit">
      <v-data-table :items="tableItems" :headers="headers">
        <template v-slot:item="{ item, index }">
          <tr>
            <td>{{ index + 1 }}</td>
            <td style="width: 20%">
              <table-text-field
                v-model:value="item.nm"
                :max="start.nm.max"
              />
            </td>
            <td style="width: fit-content">
              <table-number-field :min="lnValues.min[un.size]" :max="lnValues.max[un.size]" v-model:value="item.ln" />
            </td>
            <td style="width: fit-content">
              <table-number-field :min="wdValues.min[un.size]" :max="wdValues.max[un.size]" v-model:value="item.wd" />
            </td>
            <td style="width: fit-content">
              <table-number-field :min="hgValues.min[un.size]" :max="hgValues.max[un.size]" v-model:value="item.hg" />
            </td>
            <td style="width: fit-content">
              <table-number-field :min="wgValues.min[un.wght]" :max="wgValues.max[un.wght]" v-model:value="item.wg" />
            </td>
            <td style="width: fit-content">
              <table-number-field :min="start.cn.min" :max="start.cn.max" v-model:value="item.cn" />
            </td>
            <td style="width: fit-content">
              <select-field :items="packingList" v-model:value="item.pg" variant="plain" />
            </td>
            <td style="width: fit-content">
              <select-field :items="stuckList" v-model:value="item.st" variant="plain" />
            </td>
            <td style="width: fit-content">
              <table-number-field :min="lmValues.min[un.wght]" :max="lmValues.max[un.wght]" v-model:value="item.lm" />
            </td>
            <td class="text-right">
              <v-btn @click="deleteRow(item.id)">
                <v-icon>{{ icons.trashCan }}</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>

      <!-- BTN -->
      <div class="d-flex align-center">
        <v-btn rounded variant="text" class="button grey--text text-darken-3" @click="$emit('back')">
          {{ t('common.back') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn elevation="6" color="primary" rounded class="px-2" type="submit">
          <span v-show="!isFormError">{{ t('common.add') }}</span>
          <span v-show="isFormError">{{ t('common.check') }}</span>
        </v-btn>
      </div>
    </v-form>
  </div>
</template>



<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import useVuelidate from '@vuelidate/core'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { useDisplay } from 'vuetify'
import { unitSizeArray, unitWeightArray } from '@/configs/units'
import icons from '@/configs/constants/icons'
import { cn, hg, lm, ln, nm, ov, pg, rt, st, wd, wg } from '@/configs/items'
import { useCargoStore } from '@/stores/cargo'
import useValidateFields from "../../hooks/useValidateFields";
import {useUserStore} from "../../stores/user";
import TableTextField from "../forms/TableTextField.vue";
import TableNumberField from "../forms/TableNumberField.vue";

const emit = defineEmits(['submit', 'back'])

const props = withDefaults(defineProps<{
  items: []
}>(), {
  items: () => []
})

const start = {
  nm, ln, wd, hg, wg, cn, pg, st, lm, rt, ov
}

const { t } = useI18n()
const appStore = useAppStore()
const cargoStore = useCargoStore()
const userStore = useUserStore()
const { mobile } = useDisplay()

const tableItems = ref(props.items)

const un = ref(userStore.config.units.cargo)

const light = ref(null)

const stuckList = computed(() => cargoStore.stuckList)
const packingList = computed(() => cargoStore.packingList)

const {
  lnValues,
  lmValues,
  wgValues,
  hgValues,
  wdValues,
} = useValidateFields()

console.log(
    lnValues,
  lmValues,
  wgValues,
  hgValues,
  wdValues,)

const v$ = useVuelidate()

const headers = [
  { title: '№' },
  { title: t('common.name') },
  { title: t('item.ln.label') },
  { title: t('item.wd.label') },
  { title: t('item.hg.label') },
  { title: t('item.wg.label') },
  { title: t('item.cn.label') },
  { title: t('item.pg.label') },
  { title: t('item.st.label') },
  { title: t('item.lm.label') },
  { title: '' },
]

const isFormError = computed(() => v$.value.$error)

const submit = () => {
  if (!tableItems.value.length) {
    appStore.showError(t('import.data.empty'))
    return
  }

  v$.value.$touch()

  if (isFormError.value) {
    appStore.showError(t('import.data.rowsInvalid'))
    return
  }

  const data = tableItems.value.map((item) => ({
    id: null,
    nm: item.nm,
    ln: getSize(item.ln, un.value.size),
    wd: getSize(item.wd, un.value.size),
    hg: getSize(item.hg, un.value.size),
    wg: getWght(item.wg, un.value.wght),
    cn: item.cn,
    pg: item.pg !== null && packingList.value.includes(item.pg) ? item.pg : start.pg.val,
    st: item.st !== null && stuckList.value.includes(item.st) ? item.st : start.st.val,
    lm: Number(item.lm) > 0 && (Number(item.st) === 1 || Number(item.st) === 3) ? getWght(item.lm, un.value.wght) : 0,
    rt: item.rt !== null && [0, 1].includes(Number(item.rt)) ? Number(item.rt) : Number(start.rt.val),
    ov: item.ov !== null && [0, 1].includes(Number(item.ov)) && Number(item.pg) !== 1 ? Number(item.ov) : Number(start.ov.val),
    cr: null,
    un: un.value,
  }))

  emit('submit', data)
}

const deleteRow = (id) => {
  const index = tableItems.value.findIndex((i) => String(i.id) === String(id))
  tableItems.value.splice(index, 1)
}
</script>


