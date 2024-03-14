<template>
  <v-list nav dense>
    <span v-for="(item, index) in menu" :key="index">
      <nav-menu :menu="item.items" />
    </span>
  </v-list>
</template>

<script>
import NavMenu from './NavMenu'

export default {
  components: {
    NavMenu
  },
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  }
}
</script>
