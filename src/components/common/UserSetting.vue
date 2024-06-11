<template>
  <div>
    <v-card class="rounded-lg">
      <!-- HEADER -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ t('setting.units.cargo.header') }}
      </div>

      <div class="text-caption text-uppercase grey--text mx-2">
        {{ t('setting.units.cargo.subtitle') }}
      </div>

      <v-card-text class="d-flex align-center py-0">
        <radio-group v-model:value="cargo.size" :items="unitSizeArray" />

        <v-spacer></v-spacer>

        <radio-group v-model:value="cargo.wght" :items="unitWeightArray" />
      </v-card-text>
    </v-card>

    <v-card v-if="loads" class="rounded-lg mt-2">
      <!-- HEADER -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ t('setting.units.loads.header') }}
      </div>

      <div class="text-caption text-uppercase grey--text mx-2">
        {{ t('setting.units.loads.subtitle') }}
      </div>

      <v-card-text class="d-flex align-center py-0">
        <radio-group v-model:value="loads.size" :items="unitSizeArray" />

        <v-spacer></v-spacer>

        <radio-group v-model:value="loads.wght" :items="unitWeightArray" />
      </v-card-text>
    </v-card>

    <!-- BUTTONS -->
    <div class="d-flex align-center mt-1">
      <v-spacer></v-spacer>
      <v-btn
          elevation="6"
          color="primary"
          rounded
          class="px-2 no-uppercase"
          @click="submit"
      >
        {{ t('common.save') }}
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import {useUserStore} from "../../stores/user";
import {unitSizeArray, unitWeightArray} from "../../configs/units";

const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()


const cargo = ref(userStore.config.units.cargo)
const loads = ref(userStore.config.units.loads)

const submit = () => {
  appStore.setLoading(true)
  userStore.postConfigUnits({ cargo: cargo.value, loads: loads.value })
      .then(() => appStore.showSuccess(t('common.success')))
      .catch(() => appStore.showError(t('common.validation.error')))
      .finally(() => appStore.setLoading(false))
}

onMounted(() => {
  appStore.hideToast()
})
</script>
