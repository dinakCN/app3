<template>
  <v-list nav dense>
    <v-list-item
      link
      to="/support"
    >
      <v-list-item-icon>
        <v-icon color="primary">
          bx bxl-telegram
        </v-icon>
      </v-list-item-icon>
      <v-list-item-content >
        <v-list-item-title class="primary--text">
          {{ $t('menu.support') }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
