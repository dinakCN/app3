<template>
  <v-list
    nav
    lines="one"
    density="comfortable"
  >
    <span v-for="(item, index) in menu" :key="index">
      <NavMenu :menu="item.items" />
    </span>
  </v-list>
</template>

<script lang="ts" setup>

import NavMenu from './NavMenu.vue'

const props = defineProps({
  menu: {
    type: Array,
    default: () => []
  }
})

</script>
