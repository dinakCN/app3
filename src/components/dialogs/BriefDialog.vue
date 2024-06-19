<template>
  <v-dialog
    :model-value="isOpen"
    max-width="800px"
    max-height="623px"
    @click:outside="close()"
  >
    <v-card width="100%">
      <template v-slot:title>
        <div class="mb-3">
          {{ title }}
          <span
            v-if="time"
            class="text-body-1 font-weight-light"
            >
          ({{ time }})
          </span>
        </div>
      </template>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          variant="text"
          size="small"
          :text="t('common.close')"
          @click="close()"
        ></v-btn>
      </template>

      <youtube-iframe
        :video-id="id"
        width="100%"
      />

    </v-card>
  </v-dialog>
</template>

<script
  lang="ts"
  setup
>
import { ref, Ref } from 'vue'
import { useI18n } from "vue-i18n"
import { YoutubeIframe } from '@vue-youtube/component'
import { VideoInterface } from '../../interfaces/VideoInterfaces';
import { computed } from 'vue';

/**
 * Lang
 */
const { t } = useI18n()

const data: Ref<VideoInterface | null> = ref(null)

const isOpen = ref(false)

const title = computed(() => {
  return data.value.key ? t(data.value.key) : ''
})

const time = computed(() => {
  return data.value.time ? data.value.time : ''
})

const id = computed(() => {
  return data.value.id ? data.value.id : ''
})
const close = () => {
  isOpen.value = false
}

const show = (el: VideoInterface) => {
  if (!el) return
      isOpen.value = true
      data.value = el
}

defineExpose({
  show, close
})
</script>
