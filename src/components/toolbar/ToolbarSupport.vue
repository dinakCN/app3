<template>
  <v-list nav density="comfortable">
    <v-list-item
      link
      to="/support"
      color="primary"
    >
      <template v-slot:prepend>
        <v-icon>
         fa-brands fa-telegram
        </v-icon>
      </template>
      <v-list-item-title class="primary">
        {{ $t('menu.support') }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>
