<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12" md="10" lg="8">
      <div class="d-flex align-center">
        <v-tabs v-model="tab">
          <template v-for="item in tabItems" :key="item.value">
            <v-tab
                :value="item.value"
                :to="`#${item.value}`"
                :style="{minWidth: mobile ? '60px' : '', display: item.label ? 'block' : 'none' }"
            >
              <span><v-icon>{{ item.icon }}</v-icon></span>
              <span v-if="!mobile" class="pl-2">{{ item.label }}</span>
            </v-tab>
          </template>
        </v-tabs>

        <v-spacer></v-spacer>

        <v-btn @click="close">
          <v-icon color="red lighten-1" size="large">{{ icons.close }}</v-icon>
        </v-btn>
      </div>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="'user-changepass'">
          <user-change-pass />
        </v-tabs-window-item>
        <v-tabs-window-item v-for="item in tabItems" :key="item.value" :value="item.value" class="py-3">
          <component :is="item.component" @open="tab = 'user-changepass'"/>
        </v-tabs-window-item>
      </v-tabs-window>

    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {ref, onMounted, shallowRef, nextTick} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { useAppStore } from '../stores/app'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import icons from "../configs/constants/icons"

import UserProfile from "../components/common/UserProfile.vue";
import UserSetting from "../components/common/UserSetting.vue";
import UserTarifs from "../components/common/UserTarifs.vue";
import UserPayments from "../components/common/UserPayments.vue";
import UserChangePass from "../components/common/UserChangePass.vue";

const { mobile } = useDisplay()
const appStore = useAppStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const tab = ref(null)

onMounted(() => {
  appStore.hideToast()
})

const tabItems = shallowRef([
  { value: 'user-profile', label: t('user.header'), icon: icons.account, component: UserProfile },
  { value: 'user-setting', label: t('user.setting'), icon: icons.settings, component: UserSetting },
  { value: 'user-tarif', label: t('user.tarif'), icon: icons.cash, component: UserTarifs },
  { value: 'user-payments', label: t('user.payment'), icon: icons.dollar, component: UserPayments },
  { value: 'user-changepass', label: '', icon: '', component: UserChangePass }
])

const close = () => {
  router.back()
}

onMounted(() => {
  nextTick(() => {
    if(route.hash) {
      tab.value = route.hash.replace('#', '')
    }
  })
})
</script>

<style scoped>
.v-tab-item--selected {
  color: #1976D2 !important;
}
</style>
