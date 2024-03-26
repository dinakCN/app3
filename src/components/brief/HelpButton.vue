<template>
  <v-btn
    icon
    size="default"
    @click.stop="brief()"
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
  <BriefDialog v-model="dialog.open" />
</template>

<script
  lang="ts"
  setup
>
import { reactive } from 'vue';
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

const brief = () => {
  const current = v.find((i) => {
    console.log(route.name)
    return i.page.includes(String(route.name))
  })

  console.log(current)

  if (current?.link) dialog.open = true
}
</script>
