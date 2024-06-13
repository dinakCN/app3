<template>
  <!-- UPDATE -->
  <v-snackbar
      v-model="updateExists"
      bottom
      right
      color="primary"
  >
    {{ t('update.text') }}
    <v-btn variant="text" class="ml-2" @click="refreshApp">
      {{ t('update.btn') }}
    </v-btn>
  </v-snackbar>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const refreshing = ref(false)
const registration = ref<ServiceWorkerRegistration | null>(null)
const updateExists = ref(false)

const updateAvailable = (event: CustomEvent) => {
  registration.value = event.detail
  updateExists.value = true
}

const refreshApp = () => {
  updateExists.value = false
  if (!registration.value || !registration.value.waiting) return
  registration.value.waiting.postMessage({ type: 'SKIP_WAITING' })
}

onMounted(() => {
  document.addEventListener('swUpdated', updateAvailable, { once: true })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing.value) return
    refreshing.value = true
    window.location.reload()
  })
})

onUnmounted(() => {
  document.removeEventListener('swUpdated', updateAvailable)
})
</script>
