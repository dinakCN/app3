<template>
  <v-bottom-navigation
    color="primary"
    grow
    active-class
  >
    <template
      v-for="(foot, index) in footer"
      :key="index"
    >

      <v-btn
        :to="foot.to"
        :icon="mobile"
        :stacked=true
      >
        <v-icon>
          {{ foot.icon }}
        </v-icon>
        <span v-if="!mobile">
          {{ $t(foot.key) }}
        </span>
      </v-btn>

    </template>
  </v-bottom-navigation>
</template>

<script
  setup
  lang="ts"
>
import { footerNavigation } from '../../configs/footer.js'
import { reactive } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const footer = reactive(footerNavigation)
</script>
