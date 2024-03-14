<template>
  <v-menu
    offset-y
    left
    transition="slide-y-transition"
    disabled
  >
    <template v-slot:activator="{ on }">
      <v-btn rounded icon v-on="on">
        {{ currentLocale.code.toUpperCase() }}
      </v-btn>
    </template>

    <v-list dense nav>
      <v-list-item v-for="locale in availableLocales" :key="locale.code" @click="setLocale(locale.code)">
        <v-list-item-title>{{ locale.code.toUpperCase() }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
/*
|---------------------------------------------------------------------
| Language Switcher Component
|---------------------------------------------------------------------
|
| vue-i18n locales available array
|
*/
export default {
  computed: {
    currentLocale() {
      return this.$i18n.locales.find((i) => i.code === this.$i18n.locale)
    },
    availableLocales () {
      return this.$i18n.locales.filter((i) => i.code !== this.$i18n.locale)
    }
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale
      this.$vuetify.lang.current = locale
    }
  }
}
</script>
