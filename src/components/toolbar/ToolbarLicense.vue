<template>
  <v-btn
    icon
    to="/user#user-tarif"
  >
    <v-avatar
      size="38"
      :color="avatartColor"
      class="text-caption text-uppercase text-white"
    >
      {{ name }}
    </v-avatar>
  </v-btn>
</template>

<script setup lang="ts">

import { computed, reactive } from "vue"
import { useAppStore } from "@/stores/app.js"
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const appStore = useAppStore();
const user = reactive(appStore.user);

const name = computed(() => {
  return user.tarif.type ? t('tarif.type.1.subtitle') : t('tarif.type.0.subtitle');
})

const avatartColor = computed(() => {

  if (user.tarif.type === 2) return 'primary'
  if (user.tarif.type === 1) return 'success'

  return 'grey-lighten-1'
})

</script>
