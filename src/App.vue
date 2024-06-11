<template>
  <v-app>
    <router-view />

    <v-snackbar
      v-model="toast.show"
      :rounded="toast.rounded"
      :timeout="toast.timeout"
      :color="toast.color"
      :tile="toast.tile"
      max-height="100px"
      style="bottom: 60px;"
    >
      {{ toast.message }}

      <template v-slot:actions>
        <v-btn
          v-if="toast.timeout === 0"
          color="white"
          x-small
          @click="toast.show = false"
        >
          <v-icon>{{ icons.close }}</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script
  lang="ts"
  setup
>
import { computed } from 'vue';
import { useAppStore } from './stores/app'
import icons from "./configs/constants/icons";

const storeApp = useAppStore()
const toast = computed(() => storeApp.toast)

</script>

<style>
.no-uppercase {
  text-transform: unset !important;
}
</style>
