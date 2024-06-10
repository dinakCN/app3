<template>
  <v-container fluid>
    <v-row justify="center" no-gutters>
      <v-col
          cols="12"
          md="10"
          lg="8"
      >
        <div class="d-flex align-center">
          <v-tabs v-model="tab" fixed-tabs>
            <v-tab :to="'#user-profile'" :style="mobile ? 'min-width:60px' : ''">
              <span><v-icon>{{ icons.account }}</v-icon></span>
              <span v-if="!mobile" class="pl-2">{{ t('user.header') }}</span>
            </v-tab>
            <v-tab :to="'#user-setting'" :style="mobile ? 'min-width:60px' : ''">
              <span><v-icon>{{ icons.settings }}</v-icon></span>
              <span v-if="!mobile" class="pl-2">{{ t('user.setting') }}</span>
            </v-tab>
            <v-tab :to="'#user-tarif'" :style="mobile ? 'min-width:60px' : ''">
              <span><v-icon>{{ icons.cash }}</v-icon></span>
              <span v-if="!mobile" class="pl-2">{{ t('user.tarif') }}</span>
            </v-tab>
            <v-tab :to="'#user-payments'" :style="mobile ? 'min-width:60px' : ''">
              <span><v-icon>{{ icons.dollar }}</v-icon></span>
              <span v-if="!mobile" class="pl-2">{{ t('user.payment') }}</span>
            </v-tab>
            <v-tab to="#user-changepass" style="display:none"></v-tab>
          </v-tabs>

          <v-spacer></v-spacer>

          <v-btn @click="close">
            <v-icon color="red lighten-1" size="large">{{ icons.close }}</v-icon>
          </v-btn>
        </div>

        <v-tabs v-model="tab"           style="height: 100vh">
          <v-tab value="user-profile" class="py-3">
            <user-profile @close="close" />
          </v-tab>

          <v-tab value="user-changepass" class="py-3">
            <user-change-pass />
          </v-tab>

          <v-tab value="user-setting" class="py-3">
            <user-setting @close="close" />
          </v-tab>

          <v-tab value="user-tarif" class="py-3">
            <user-tarifs @close="close" />
          </v-tab>

          <v-tab value="user-payments" class="py-3">
            <user-payments />
          </v-tab>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'
import {useDisplay} from "vuetify";
import icons from "../configs/constants/icons";
import {useI18n} from "vue-i18n";

const {mobile} = useDisplay()
const appStore = useAppStore()
const {t} = useI18n()
const tab = ref(null)
const prevRoute = ref(null)

const router = useRouter()

onMounted(() => {
  appStore.hideToast()
})

const close = () => {
  if (prevRoute.value) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>
