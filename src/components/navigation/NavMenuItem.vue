<template>
  <div>
    <v-list-item
      v-if="!menuItem.items"
      :input-value="menuItem.value"
      :to="menuItem.link"
      :exact="menuItem.exact"
      :disabled="menuItem.disabled"
      active-class="primary--text"
      link
    >

      <template v-slot:prepend>
        <v-icon :small="small" :class="{ 'grey--text': menuItem.disabled }">
          {{ menuItem.icon || 'mdi-circle-medium' }}
        </v-icon>
      </template>

      <v-list-item-title>
        {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
      </v-list-item-title>
    </v-list-item>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  menuItem: {
      type: Object,
      default: () => {}
    },
    small: {
      type: Boolean,
      default: false
    }
})

</script>
