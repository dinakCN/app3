<template>
  <v-text-field
      v-model="data"
      autocomplete="current-password"
      :append-icon="showPassword ? icons.eyeOutline : icons.eyeOff"
      :error-messages="dataErrors"
      :variant="variant"
      :type="showPassword ? 'text' : 'password'"
      :label="t('password.pwd.label')"
      :hint="t('password.pwd.hint')"
      persistent-hint
      counter
      required
      @keyup.enter="submit"
      @click:append="showPassword = !showPassword"
  ></v-text-field>
</template>

<script
  setup
  lang="ts"
>
import {useAppStore} from "../../stores/app";
import {useUserStore} from "../../stores/user";
import {computed, ref, onMounted, onUnmounted} from "vue";
import {useVuelidate} from "@vuelidate/core";
import icons from "../../configs/constants/icons";
import {useI18n} from "vue-i18n";

const props = withDefaults(defineProps<{
  cls?: string
  variant?: string
}>(), {
  variant: 'underlined',
  cls: '',
});

const appStore = useAppStore()
const userStore = useUserStore()

const newPassword = ref('')
const showPassword = ref(false)

const rules = {
  required: (value: string) => !!value || t('scene.valid.required'),
  password: (value: string) => {
    const pattern = /^(?=.*[a-z])(?=.*[0-9])(?=.{6,})/
    return pattern.test(value) || t('password.pwd.hint')
  }
}

onMounted(() => {
  v$.value.$reset()
})
onUnmounted(() => {
  v$.value.$reset()
})

/**
 * Lang
 */
const { t } = useI18n()

/**
 * Модель
 */
const data = defineModel<String>('value', { default: '' })

const fieldRef = ref(null)

/**
 * Vuelidate
 */
const v$ = useVuelidate(rules, { data })

const isInvalid = computed(() => v$.value.$invalid)

const submit = () => {
  if (v$.value.$error) return

  userStore.postConfigProfile({ pass: newPassword.value })
      .then(() => appStore.showSuccess(t('password.success')))
      .catch(() => appStore.showError(t('password.error')))
}

/**
 * Обработка ошибок
 */
const dataErrors = computed(() => {
  const errors: any = []

  if (!v$.value.$dirty) return errors
  if (!v$.value.$errors.length) return errors

  v$.value.$errors.forEach(e => {
    e.$validator === 'required' && errors.push(t('common.validation.required'))
    e.$validator === 'maxLength' && errors.push(t('common.validation.maxValue') + ' ' + e.$params.max)
  })

  return errors
})

/**
 * Внещний доступ к методам
 */
defineExpose({
  fieldRef,
  isInvalid,
  submit
})

</script>
