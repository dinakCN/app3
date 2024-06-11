<template>
  <div v-if="!menuItem.items">
    <v-list-item
        :input-value="menuItem.value"
        :to="menuItem.link"
        :href="menuItem.redirect"
        :disabled="menuItem.disabled"
        :active="isActive(menuItem.link)"
        link
    >
      <template v-slot:prepend>
        <v-icon size="small" color="text-black">
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
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

interface MenuItem {
  value?: any;
  link?: string;
  redirect?: string;
  disabled?: boolean;
  exact?: boolean;
  icon?: string;
  key?: string;
  text?: string;
  items?: any;
}

const props = defineProps<{
  menuItem: MenuItem;
}>();

const route = useRoute();
const { t } = useI18n();

const isActive = (link: string) => {
  // Check if the current route path matches the menu item link
  const path = link.split('#')[0];
  const hash = link.split('#')[1];
  console.log(route.path === path && route.hash === `#${hash}`)
  return route.path === path && route.hash === `#${hash}`;
};
</script>

<style>
.v-list-item--active {
  color: #1976D2 !important;
}
</style>
