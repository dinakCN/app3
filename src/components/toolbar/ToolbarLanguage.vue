<template>
  <v-menu
    offset-y
    left
    transition="slide-y-transition"
    disabled
  >
    <template v-slot:activator="{ props }">
      <v-btn rounded v-bind="props">
        {{ currentLocale.code.toUpperCase() }}
      </v-btn>
    </template>

    <v-list dense nav>
      <v-list-item v-for="locale in locales" :key="locale.code" @click="changeLocale(locale.code)">
        <v-list-item-title>{{ locale.code.toUpperCase() }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {useI18n} from "vue-i18n";
import { useLocale } from 'vuetify';

const { current } = useLocale()
const { locale, availableLocales } = useI18n();

const currentLocale = computed(() => {
  return availableLocales.find((i) => i.code === locale.value) || { code: 'en' };
});

const locales = computed(() => {
  return availableLocales.filter((i) => i.code !== locale.value);
});

const changeLocale = (l: string) => {
  locale.value = l;
  current.value = l;
};
</script>
