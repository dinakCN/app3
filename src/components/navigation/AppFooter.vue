<template>
  <v-bottom-navigation app inset color="primary" grow horizontal active-class>
    <template v-for="(foot, index) in footer" :key=index>

      <v-btn :to="foot.to" :icon="mobile.value">
        <span v-if="!mobile.value">{{ foot.key }}</span>
        <v-icon :left="!mobile.value" :class="mobile.value && 'mr-0'">
          {{ foot.icon }}
        </v-icon>
      </v-btn>

    </template>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { footerNavigation } from '../../configs/footer.js'
import { reactive } from 'vue'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
const footer = reactive(footerNavigation)
</script>../../configs/footer.js
