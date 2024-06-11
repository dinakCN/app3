<template>
  <v-btn
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

import { computed } from "vue"
import { useUserStore } from "../../stores/user"
import { useI18n } from "vue-i18n"

const { t } = useI18n()

const storeUser = useUserStore();
const user = computed(() => storeUser.user);

const name = computed(() => {
  return user.value.tarif.type ? t('tarif.type.1.subtitle') : t('tarif.type.0.subtitle');
})

const avatartColor = computed(() => {

  if (user.value.tarif.type === 2) return 'primary'
  if (user.value.tarif.type === 1) return 'success'

  return 'grey-lighten-1'
})

</script>
