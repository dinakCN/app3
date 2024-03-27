<template>
  <v-btn
    icon
    size="default"
    @click.stop="open()"
  >
    <v-icon>mdi:mdi mdi-help-circle-outline</v-icon>
    <v-tooltip
      activator="parent"
      location="start"
    >
      {{ t('common.help') }}
    </v-tooltip>
  </v-btn>

  <!-- Dialog -->
  <BriefDialog v-model="dialog.open" :video_id="video_id" :title="title" />
</template>

<script
  lang="ts"
  setup
>
import { reactive, computed } from 'vue';
import { useRoute } from 'vue-router'
import { useI18n } from "vue-i18n"
import { VideoInterface } from '../../interfaces/VideoInterfaces';
import links from '../../configs/video'

/**
 * Router
 */
const route = useRoute()

/**
 * Lang
 */
const { t } = useI18n()

const v: Array<VideoInterface> = reactive([...links])

const dialog = reactive({
  open: false
})

const video_id = computed(() => {
  const current = v.find((i) => i.page.includes(String(route.name)))

  if (current?.id) return current.id

  return ''
})

const title = computed(() => {
  const current = v.find((i) => i.page.includes(String(route.name)))

  if (current?.key) return t(current.key)

  return ''
})

const open = () => {
  if (video_id.value) dialog.open = true
}

</script>
