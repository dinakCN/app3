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
          icon
          x-small
          @click="toast.show = false"
        >
          <v-icon>mdi:mdi mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

  </v-app>
</template>

<script
  lang="ts"
  setup
>
import { computed, onMounted } from 'vue';
import { useAppStore } from './stores/app'

const storeApp = useAppStore()
const toast = computed(() => storeApp.toast)

// onMounted(() => {
//   storeApp.showError('test')
// })
</script>
