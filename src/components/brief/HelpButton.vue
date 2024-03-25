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

// import links from '@/configs/video'

// props: {
//   name: {
//     type: String,
//     default: ''
//   }
// },

const v = reactive([])

const brief = () => {
  const current = v.find((i) => i.page.includes(String(this.$route.name)))

  if (current?.link) $refs.briefs.show(current.link)
}

</script>
