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
  <v-app-bar flat tile>

    <!-- menu btn -->
    <template v-slot:prepend>
      <v-app-bar-nav-icon
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

    <div>
      <ToolbarUser />
      <ToolbarSetting />
      <ToolbarLicense />
    </div>

    <v-progress-linear
      :active="appStore.loading"
      :indeterminate="appStore.loading"
      absolute
      bottom
      color="teal"
      style="z-index: 9"
    ></v-progress-linear>

  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>

  <FooterNavigation />

</template>

<script setup lang="ts" >

import { ref } from "vue"
import { menu } from '../configs/navigation.js'
import { useAppStore } from '../stores/app.js'
import MainMenu from "../components/navigation/MainMenu.vue";
import ToolbarSupport from '../components/toolbar/ToolbarSupport.vue'
import ToolbarUser from '../components/toolbar/ToolbarUser.vue'
import ToolbarSetting from '../components/toolbar/ToolbarSetting.vue'
import ToolbarLicense from '../components/toolbar/ToolbarLicense.vue'

const drawer = ref(false)
const appStore = useAppStore()

</script>
