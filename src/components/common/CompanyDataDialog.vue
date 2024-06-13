<template>
  <v-dialog v-model="dialog" max-width="550">
    <v-card class="rounded-lg" :loading="loading">
      <!-- HEADER -->
      <v-card-actions class="pb-0 px-1">
        <span class="text-button font-weight-bold mx-1">
          {{ t('payment.userdata.label') }}
        </span>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="close">
          <v-icon>{{ icons.close }}</v-icon>
        </v-btn>
      </v-card-actions>

      <!-- FORM -->
      <v-form ref="form" v-model="valid" lazy-validation :disabled="loading">
        <!-- RESIDENT OF COMPANY -->
        <v-radio-group v-if="typePayment" v-model="c.redn" row dense class="mx-2">
          <v-radio :value="true">
            <template v-slot:label>
              <div>{{ t('payment.userdata.resident.in') }}</div>
            </template>
          </v-radio>
          <v-radio :value="false">
            <template v-slot:label>
              <div>{{ t('payment.userdata.resident.out') }}</div>
            </template>
          </v-radio>
        </v-radio-group>

        <v-row dense class="mt-1 mx-2">
          <v-scale-transition>
            <v-col v-if="c.redn && typePayment" cols="12">
              <v-row dense>
                <v-col>
                  <v-text-field
                    v-model="c.regn"
                    :label="t('payment.userdata.inn.label')"
                    :rules="[rules.required]"
                    dense
                    required
                    clearable
                    type="text"
                    @keydown="NumbersOnly"
                  ></v-text-field>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    outlined
                    color="primary"
                    block
                    rounded
                    :disabled="loading || !c.regn"
                    @click="getDataByRegn"
                  >
                    {{ t('common.finder') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-scale-transition>

          <v-col cols="12">
            <v-text-field
              v-if="typePayment"
              v-model="c.name"
              :label="t('payment.userdata.name.label')"
              :rules="[rules.required]"
              dense
              required
              clearable
              type="text"
            >
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-if="typePayment"
              v-model="c.address"
              :label="t('payment.userdata.address.label')"
              :rules="[rules.required]"
              dense
              required
              clearable
              type="text"
            >
            </v-text-field>
          </v-col>

          <v-scale-transition>
            <v-col v-if="c.redn && typePayment" cols="12">
              <v-text-field
                v-model="c.ogrn"
                :label="t('payment.userdata.ogrn.label')"
                :rules="[rules.required]"
                dense
                required
                clearable
                type="text"
                @keydown="NumbersOnly"
              ></v-text-field>
            </v-col>
          </v-scale-transition>

          <v-scale-transition>
            <v-col v-if="!c.redn && typePayment" cols="12">
              <v-textarea
                v-model="c.longtext"
                :label="t('payment.userdata.longtext.label')"
                dense
                clearable
              ></v-textarea>
            </v-col>
          </v-scale-transition>

          <!-- EMAIL -->
          <v-col v-if="e.show" cols="12">
            <v-text-field
              v-model="e.value"
              label="Email"
              :rules="[rules.required, rules.email]"
              dense
              required
              clearable
              type="email"
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- BTN -->
        <v-card-actions class="pb-2 px-2">
          <v-spacer></v-spacer>
          <v-btn
            color="primary lighten-1"
            large
            rounded
            class="px-2"
            :disabled="!valid"
            @click="submit"
          >
            {{ t('payment.userdata.btn') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useCargoStore } from '@/stores/cargo'
import icons from "../../configs/constants/icons";
import {useVuelidate} from "@vuelidate/core";

const { t } = useI18n()
const appStore = useAppStore()
const cargoStore = useCargoStore()

const dialog = ref(false)
const loading = ref(false)
const valid = ref(false)

const props = withDefaults(defineProps<{
  typePayment: number
}>(), {
  typePayment: 1
})

const c = ref({
  redn: true,
  name: null,
  regn: null,
  ogrn: null,
  address: null,
  manager: null,
  longtext: null,
})

const e = ref({
  value: null,
  show: false,
})

const typePayment = ref(props.typePayment)

const validate = useVuelidate()

const rules = {
  required: (value) => !!value || t('common.validation.required'),
  email: (value) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || t('common.validation.email')
  },
}

const submit = () => {
  if (!validate.value.validate()) return appStore.showError(t('item.message.form_error'))

  dialog.value = false
  appStore.hideToast()
  resolvePromise.value({ submit: true, data: { c: c.value, e: e.value } })
}

const open = () => {
  dialog.value = true
  if (!typePayment.value) e.value.show = true
  return new Promise((resolve, reject) => {
    resolvePromise.value = resolve
    rejectPromise.value = reject
  })
}

const close = () => {
  dialog.value = false
  appStore.hideToast()
  resolvePromise.value({ submit: false, data: {} })
}

const NumbersOnly = (evt) => {
  evt = evt || window.event
  const charCode = evt.which || evt.keyCode
  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
    evt.preventDefault()
  }
}

const getDataByRegn = () => {
  if (!c.value.regn) return appStore.showError(t('payment.userdata.data.error.inn'))
  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party'
  const token = '669c0e8dacfa788e342c0a9ba47cb849248e7f93'
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Token ' + token,
    },
    body: JSON.stringify({
      query: c.value.regn,
      count: 2,
    }),
  }
  loading.value = true
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      appStore.hideToast()
      if (!result?.suggestions?.length) return appStore.showError(t('$vuetify.dataIterator.noResultsText'))
      const [i] = result.suggestions
      const { value, data } = i
      const { inn, ogrn, address, management } = data
      const { value: addr } = address
      const { name: dirr } = management
      c.value = {
        redn: true,
        name: value,
        regn: inn,
        ogrn: ogrn,
        address: addr,
        manager: dirr,
        longtext: null,
      }
    })
    .finally(() => (loading.value = false))
}

const resolvePromise = ref<((value: { submit: boolean; data: any }) => void) | null>(null)
const rejectPromise = ref<((reason?: any) => void) | null>(null)

onMounted(() => {
  loading.value = true
  cargoStore.getConfig().then((r) => {
    const { company, user } = r
    const { email } = user
    const { redn, name, regn, ogrn, address, manager, longtext } = company
    if (rules.required(email) && rules.email(email)) {
      e.value = { value: email, show: false }
    } else {
      e.value.show = true
    }
    c.value = { redn, name, regn, ogrn, address, manager, longtext }
    loading.value = false
  })
})

defineExpose({
  open,
  close,
})
</script>
