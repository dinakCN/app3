<template>
  <div>
    <v-card v-if="user" class="rounded-lg">
      <!-- HEADER -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ t('user.header') }}
      </div>

      <v-card-text class="black--text">
        <v-row dense>
          <v-col cols="6" sm="5" md="4" lg="3">
            {{ t('user.name') }}:
          </v-col>
          <v-col class="font-weight-medium primary--text" @click="setReName()">
            {{ user.name }}
            <v-btn color="primary" small @click="setReName()">
              <v-icon small>{{ icons.editOutline }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense class="mt-0">
          <v-col cols="6" sm="5" md="4" lg="3">
            {{ t('user.email') }}:
          </v-col>
          <v-col class="font-weight-medium">
            {{ user.email }}
          </v-col>
        </v-row>

        <v-row dense class="mt-1" :class="user.discount ? 'red--text text-lighten-1' : 'black--text'">
          <v-col :class="user.discount && 'font-weight-bold'" cols="6" sm="5" md="4" lg="3">
            Скидка:
          </v-col>
          <v-col class="font-weight-medium" :class="user.discount && 'font-weight-bold'">
            {{ user.discount }}%
          </v-col>
        </v-row>
      </v-card-text>

      <!-- SUBMISSION -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ t('user.submission') }}
      </div>

      <v-card-text class="black--text">
        <template v-for="(i, index) in data" :key="index">
          <v-row dense>
            <v-col cols="6" sm="5" md="4" lg="3">
              {{ i.head }}:
            </v-col>
            <v-col :class="i.color && colors" class="font-weight-medium">
              {{ i.text }}
            </v-col>
          </v-row>
        </template>
      </v-card-text>

      <div v-if="config.stats.count" class="grey--text text-darken-3">
        <div class="text-button font-weight-bold mx-2 pt-1">
          Статистика
        </div>

        <!-- STATS -->
        <v-card-text>
          <v-row dense>
            <v-col cols="6" sm="5" md="4" lg="3">
              Расчетов выполнено:
            </v-col>
            <v-col class="font-weight-medium">
              {{ config.stats.count }}
            </v-col>
          </v-row>
        </v-card-text>
      </div>

      <v-card-actions class="align-center">
        <v-spacer></v-spacer>
        <v-btn color="success" rounded class="px-2" to="/user#user-changepass">
          {{ t('user.pwdchange') }}
        </v-btn>
        <v-btn color="error" rounded class="px-2" @click="exit">
          {{ t('user.logout') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- DOCUMENTS LIST -->
    <v-card class="rounded-lg"></v-card>

    <!-- EDIT NAME -->
    <ReNameDialog ref="dialogReNameRef" icon="bx bxs-check-circle" color="primary" />
  </div>
</template>

<script setup lang="ts">
import {ref, computed, Ref} from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import {useUserStore} from "../../stores/user";
import ReNameDialog from '@/components/dialogs/ReNameDialog.vue'
import icons from "../../configs/constants/icons";

const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()

const dialogReNameRef: Ref<ReNameDialog> = ref(null)

const user = computed(() => appStore.user)
const config = computed(() => userStore.config)

const license = computed(() => {
  if (Number(user.value.tarif.type) === 2) {
    return t('tarif.type.1.title')
  } else if (Number(user.value.tarif.type) === 1) {
    return t('tarif.type.1.title')
  } else {
    return t('tarif.type.0.title')
  }
})

const colors = computed(() => {
  if (Number(user.value.tarif.type) === 2) {
    return 'primary--text'
  } else if (Number(user.value.tarif.type) === 1) {
    return 'success--text'
  } else {
    return 'grey--text text-darken-3'
  }
})

const data = computed(() => {
  const o = []
  o.push({ head: t('tarif.current'), text: license.value, color: true })
  if (user.value.tarif.type) {
    if (user.value.tarif.count) {
      o.push({ head: t('tarif.count'), text: user.value.tarif.count, color: true })
    }
    if (licExpir.value) {
      o.push({ head: t('tarif.expir'), text: licExpir.value, color: true })
    }
  }
  return o
})

const licExpir = computed(() => {
  if (Date.parse(user.value.tarif.expir) >= Date.now()) {
    const date = new Date(user.value.tarif.expir)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }
  return ''
})

const setReName = async () => {
  const update = await dialogReNameRef.value.open(user.value.name)
  if (update) {
    await userStore.postConfigProfile({name: update})
  }
}

const exit = () => {
  window.location.href = 'http://app.jload.me/exit?service=logout'
}
</script>
