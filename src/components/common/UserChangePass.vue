<template>
  <v-card rounded="lg">
    <!-- HEADER -->
    <div class="text-button font-weight-bold mx-2 pt-1">
      {{ t('password.header') }}
    </div>

    <v-form
        lazy-validation
    >
      <v-card-text>
        <password-field ref="passRef" />
      </v-card-text>

      <v-card-actions>
        <v-btn variant="text" class="no-uppercase" rounded @click="back">
          {{ t('common.back') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn rounded color="primary" class="px-2 no-uppercase" @click="submit">
          {{ t('password.btn') }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PasswordField from "../forms/PasswordField.vue";
import {Ref, ref} from "vue";

const { t } = useI18n()
const router = useRouter()

const passRef: Ref<typeof PasswordField> = ref(null)

const submit = () => {
  passRef.value.submit()
}

const back = () => {
  router.go(-1)
}
</script>
