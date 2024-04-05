<template>

  <!-- Navigation -->
  <v-navigation-drawer
    v-model="drawer"
    temporary
  >
    <MainMenu :menu="menu" />
    <template v-slot:append>
      <ToolbarSupport />
    </template>
  </v-navigation-drawer>

  <!-- app -->
  <v-app-bar :elevation="12">

    <!-- menu btn -->
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        size="small"
        @click.stop="drawer = !drawer"
      >
      </v-app-bar-nav-icon>
    </template>

    <!-- logo -->
    <v-app-bar-title>
      <div class="d-flex flex-grow-1 align-center">
        <img src="@/assets/images/logo.svg" class="mr-4" width="30" height="30" alt="logo" loading="lazy">
        <span>
          <span class="font-weight-medium">Jet</span>
          <span class="font-weight-light">Loader</span>
        </span>
      </div>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <div class="mx-2">
      <ToolbarUser />
      <ToolbarSetting />
      <ToolbarLicense />
    </div>

    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      bottom
      color="primary"
      style="z-index: 9"
    ></v-progress-linear>

  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>

  <FooterNavigation />

</template>

<script setup lang="ts" >

import { ref, computed } from "vue"
import { menu } from '../configs/navigation.js'
import { useAppStore } from '../stores/app'

const drawer = ref(false)
const appStore = useAppStore()
const loading = computed(() => Boolean(appStore.loading))

</script>
