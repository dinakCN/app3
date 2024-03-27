<template>
  <v-dialog
    :model-value="modelValue"
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
          :text="$t('common.close')"
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
import { PropType } from 'vue'
import { useI18n } from "vue-i18n"
import { YoutubeIframe } from '@vue-youtube/component'
import { VideoInterface } from '../../interfaces/VideoInterfaces';
import { computed } from 'vue';

/**
 * Lang
 */
const { t } = useI18n()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  data: Object as PropType<VideoInterface>
})

const title = computed(() => {
  return props.data?.key ? t(props.data.key) : ''
})

const time = computed(() => {
  return props.data?.time ? props.data.time : ''
})

const id = computed(() => {
  return props.data?.id ? props.data.id : ''
})

const emit = defineEmits(['update:modelValue'])
const close = () => {
  emit('update:modelValue', false)
}
</script>
