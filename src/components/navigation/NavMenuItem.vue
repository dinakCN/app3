<template>
  <div v-if="!menuItem.items">
    <v-list-item
      :input-value="menuItem.value"
      :to="menuItem.link"
      :href="menuItem.redirect"
      :exact="menuItem.exact"
      :disabled="menuItem.disabled"
      active-class="text-primary"
      link
    >

      <template v-slot:prepend>
        <v-icon size="small" color="text-black" :class="{ 'text-grey': menuItem.disabled }">
          {{ menuItem.icon || 'mdi:mdi-circle-medium' }}
        </v-icon>
      </template>

      <v-list-item-title>
        {{ menuItem.key ? t(menuItem.key) : menuItem.text }}
      </v-list-item-title>
    </v-list-item>
  </div>
</template>

<script lang="ts" setup>

import {useI18n} from "vue-i18n";

const props = defineProps({
  menuItem: {
    type: Object,
    default: () => {}
  },
})

const {t} = useI18n()

</script>
