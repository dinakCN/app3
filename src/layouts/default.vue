<template>

  <!-- Navigation -->
  <v-navigation-drawer app temporary>
    <main-menu />
    <template slot="append">
      <!-- <toolbar-support></toolbar-support> -->
    </template>
  </v-navigation-drawer>

  <!-- app -->
  <v-app-bar>

    <!-- menu btn -->
    <template v-slot:prepend>
      <v-app-bar-nav-icon>
      </v-app-bar-nav-icon>
    </template>

    <!-- logo -->
    <v-app-bar-title>
      <div class="d-flex flex-grow-1 align-center">
        <!-- <img src="@/assets/images/logo.svg" class="mr-4" width="30" height="30" alt="logo" loading="lazy"> -->
        <span>
          <span class="font-weight-medium">Jet</span>
          <span class="font-weight-light">Loader</span>
        </span>
      </div>
    </v-app-bar-title>

  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>

  <AppFooter /> 

</template>

<script lang="ts" setup>

</script>
