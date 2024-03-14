<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>

    <AppFooter />

    <div class="d-flex flex-grow-1">
      <!-- Navigation -->
      <v-navigation-drawer v-model="drawer" app temporary>
        <main-menu />
        <template>
          <toolbar-support></toolbar-support>
        </template>
      </v-navigation-drawer>
    </div>
  </v-app>
</template>

<script lang="ts" setup>

</script>
