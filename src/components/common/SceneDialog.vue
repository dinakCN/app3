<template>
  <v-dialog
      v-model="dialog"
      max-width="590"
      persistent
  >
    <v-card rounded="lg" class="pa-1">

      <v-card-title class="text-h5 error--text text-justify-center text-center">
        {{ head }}
      </v-card-title>

      <div class="d-flex">

        <div :class="mobile ? 'd-none' : 'd-block'">
          <!-- Icon -->
          <v-img
              :src="icon"
              max-width="256"
              min-height="256"
              alt="calculate error"
              class="mt-2"
              style="margin:0 auto"
          ></v-img>
        </div>

        <div>

          <v-card-text class="grey--text text-darken-3 font-weight-regular">

            <div v-show="text" class="mt-1">{{ text }}</div>
            <div v-show="call" class="mt-1 font-weight-bold">{{ call }}</div>

            <div class="mt-1">
              <router-link to="/user#user-tarif">{{ t('common.needlicense') }}</router-link>
            </div>
          </v-card-text>

        </div>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            color="grey darken-3"
            variant="text"
            class="font-weight-medium"
            @click="close"
        >
          {{ t('common.close') }}
        </v-btn>

        <v-btn
            rounded
            color="error"
            to="/user#user-tarif"
            class="px-2 font-weight-medium"
        >
          {{ t('common.getlicense') }}
        </v-btn>

      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import { useI18n } from 'vue-i18n'
import {useDisplay} from "vuetify";

const props = withDefaults(defineProps<{
  text: string,
  call: string,
  head: string
}>(), {
  text: '',
  call: '',
  head: 'Инструкция по управлению сценой'
})

const icon = computed(() => require('@/assets/images/jets/error.svg'))

const {mobile} = useDisplay()
const { t } = useI18n()
const dialog = ref(false)

const state = reactive({
  resolve: null as any,
  reject: null as any
})

const open = () => {
  dialog.value = true
  return new Promise((resolve, reject) => {
    state.resolve = resolve
    state.reject = reject
  })
}

const close = () => {
  dialog.value = false
}

defineExpose({
  open,
  close
})
</script>
