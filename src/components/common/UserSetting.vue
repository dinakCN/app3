<template>
  <v-card>
    <v-card v-if="cargo" class="rounded-lg">
      <!-- HEADER -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ t('setting.units.cargo.header') }}
      </div>

      <div class="text-caption text-uppercase grey--text mx-2">
        {{ t('setting.units.cargo.subtitle') }}
      </div>

      <v-card-text class="d-flex align-center py-0">
        <v-radio-group
            v-model="cargo.size"
            class="mr-3"
            mandatory
            row
        >
          <v-radio :label="t('units.mm')" value="0"></v-radio>
          <v-radio :label="t('units.sm')" value="1"></v-radio>
          <v-radio :label="t('units.m')" value="2"></v-radio>
        </v-radio-group>

        <v-spacer></v-spacer>

        <v-radio-group v-model="cargo.wght" row>
          <v-radio :label="t('units.kg')" value="0"></v-radio>
          <v-radio :label="t('units.tn')" value="1"></v-radio>
        </v-radio-group>
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
        <v-radio-group
            v-model="loads.size"
            class="mr-3"
            mandatory
            row
        >
          <v-radio :label="t('units.mm')" value="0"></v-radio>
          <v-radio :label="t('units.sm')" value="1"></v-radio>
          <v-radio :label="t('units.m')" value="2"></v-radio>
        </v-radio-group>

        <v-spacer></v-spacer>

        <v-radio-group v-model="loads.wght" row>
          <v-radio :label="t('units.kg')" value="0"></v-radio>
          <v-radio :label="t('units.tn')" value="1"></v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>

    <!-- BUTTONS -->
    <div class="d-flex align-center mt-1">
      <v-spacer></v-spacer>
      <v-btn
          elevation="6"
          color="primary"
          rounded
          class="px-2"
          @click="submit"
      >
        {{ t('common.save') }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useCargoStore } from '@/stores/cargo'
import {useUserStore} from "../../stores/user";

const { t } = useI18n()
const appStore = useAppStore()
const cargoStore = useCargoStore()
const userStore = useUserStore()

const cargo = ref({ size: '1', wght: '0' })
const loads = ref({ size: '1', wght: '0' })

const unitsCargo = ref(cargoStore.unitsCargo)
const unitsLoads = ref(cargoStore.unitsLoads)

const submit = () => {
  appStore.setLoading(true)
  userStore.postConfigUnits({ cargo: cargo.value, loads: loads.value })
      .then(() => appStore.showSuccess(t('common.saveSuccess')))
      .catch(() => appStore.showError(t('common.validation.error')))
      .finally(() => appStore.setLoading(false))
}

onMounted(() => {
  cargo.value = unitsCargo.value
  loads.value = unitsLoads.value
  appStore.hideToast()
})
</script>
