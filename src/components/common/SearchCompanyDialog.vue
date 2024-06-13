<template>
  <v-dialog
      v-model="dialog"
      max-width="550"
  >
    <v-card class="rounded-lg">
      <v-card-actions class="pb-0">
        <span class="text-button font-weight-bold">
          {{ t('common.search') }} компании
        </span>
      </v-card-actions>

      <!-- FORM -->
      <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          class="mx-2"
      >
        <v-autocomplete
            v-model="name"
            :rules="[rules.required]"
            :hint="t('autocomplete.hint')"
            :items="entries"
            v-model:search-input="search"
            :loading="loading"
            persistent-hint
            hide-no-data
            hide-selected
            return-object
            clearable
        ></v-autocomplete>
      </v-form>

      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="secondary lighten-2" variant="text" @click="close">
          {{ t('common.cancel') }}
        </v-btn>
        <v-btn color="primary lighten-1" @click="submit">
          {{ t('common.ok') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import {useVuelidate} from "@vuelidate/core";

const { t } = useI18n()
const appStore = useAppStore()

const dialog = ref(false)
const name = ref(null)
const search = ref(null)
const entries = ref([])
const resolve = ref(null)
const reject = ref(null)
const loading = ref(false)
const valid = ref(false)

const rules = {
  required: (value) => !!value || t('scene.valid.required')
}

const validate = useVuelidate()
const submit = () => {
  if (!validate.value.validate()) {
    appStore.showError(t('item.message.form_error'))
    return
  }

  dialog.value = false
  resolve.value(name.value ? name.value : {})
}

const open = () => {
  dialog.value = true
  return new Promise((res, rej) => {
    resolve.value = res
    reject.value = rej
  })
}

const close = () => {
  dialog.value = false
  resolve.value(false)
}

const getData = () => {
  if (!search.value) return

  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party'
  const token = '669c0e8dacfa788e342c0a9ba47cb849248e7f93'

  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Token ' + token
    },
    body: JSON.stringify({
      query: search.value,
      count: 10
    })
  }

  loading.value = true

  fetch(url, options)
      .then(response => response.json())
      .then(result => {
        if (!result?.suggestions?.length) return

        entries.value = result.suggestions.map(i => {
          const o =  {
            text: `${i.value}, ${i.data.address.value}`,
            value: {
              name: i.value,
              regn: i.data.inn,
              data: i.data.address.value
            }
          }

          if (i.data.kpp) o.value.data = `${o.value.data}, ${t('payment.userdata.kpp.label')} ${i.data.kpp}`
          if (i.data.ogrn) o.value.data = `${o.value.data}, ${t('payment.userdata.ogrn.label')} ${i.data.ogrn}`

          return o
        })
      })
      .finally(() => loading.value = false)
}

watch(search, (newVal) => {
  if (newVal) getData()
})

defineExpose({
  open,
  close,
})
</script>
