<template>
  <v-card rounded="lg">
    <!-- HEADER -->
    <div class="text-button font-weight-bold mx-2 pt-1">
      {{ t('password.header') }}
    </div>

    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-card-text>
        <v-text-field
            v-model="newPassword"
            autocomplete="current-password"
            :append-icon="showPassword ? icons.eyeOutline : icons.eyeOff"
            :rules="[rules.required, rules.password]"
            :type="showPassword ? 'text' : 'password'"
            :label="t('password.pwd.label')"
            :hint="t('password.pwd.hint')"
            persistent-hint
            counter
            required
            @keyup.enter="submit"
            @click:append="showPassword = !showPassword"
        ></v-text-field>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import { useCargoStore } from '../../stores/cargo'
import icons from "../../configs/constants/icons";

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const cargoStore = useCargoStore()

const valid = ref(true)
const newPassword = ref('')
const showPassword = ref(false)

const rules = {
  required: (value: string) => !!value || t('scene.valid.required'),
  password: (value: string) => {
    const pattern = /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/
    return pattern.test(value) || t('password.pwd.hint')
  }
}

const form = ref(null)

const submit = () => {
  if (!form.value?.validate()) return

  cargoStore.postConfigProfile({ pass: newPassword.value })
      .then(() => appStore.showSuccess(t('password.success')))
      .catch(() => appStore.showError(t('password.error')))
}

const back = () => {
  router.go(-1)
}
</script>
