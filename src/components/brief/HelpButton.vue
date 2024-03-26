<template>
  <span>

    <v-btn
      icon
      @click.stop="brief()"
    >
      <v-icon>mdi:mdi mdi-help-circle-outline</v-icon>
      <v-tooltip
        activator="parent"
        location="start"
      >
        {{ $t('common.help') }}
      </v-tooltip>
    </v-btn>

    <!-- BRIEF -->
    <!-- <brief-dialog ref="briefs" /> -->

  </span>
</template>

<script
  lang="ts"
  setup
>
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { VideoInterface } from '../../interfaces/VideoInterfaces';

import links from '../../configs/video'

const route = useRoute()

const v: Array<VideoInterface> = reactive([links])

const brief = () => {
  const current = v.find((i) => {
    return i.page.includes(String(route.name))
  })

  if (current?.link) $refs.briefs.show(current.link)
}
</script>
