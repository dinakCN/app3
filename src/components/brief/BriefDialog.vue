<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560px"
    max-height="423px"
    @click:outside="close()"
  >
    <v-card
      width="100%"
    >
      <template v-slot:title>
        <div class="mb-3">
          {{ title }}
        </div>
      </template>
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          variant="text"
          size="small"
          :text="$t('common.close')"
          @click="close()"
        ></v-btn>
      </template>

      <youtube-iframe :video-id="video_id" width="560px" />

    </v-card>
  </v-dialog>
</template>

<script
  lang="ts"
  setup
>
import { YoutubeIframe } from '@vue-youtube/component'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  video_id: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}
</script>
