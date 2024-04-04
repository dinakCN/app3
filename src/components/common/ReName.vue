<template>
  <span>
    <v-text-field
      v-model="data"
      ref="textfield"
      :label="t(label)"
      :color="color"
      :hint="t('item.nm.hint')"
      :error-messages="dataErrors"
      :counter="config.max"
      :max-length="config.max"
      clearable
      clear-icon="mdi:mdi mdi-close"
      required
      variant="underlined"
      type="text"
      @click:clear="clear()"
      @input="v$.$touch()"
      @blur="v$.$touch()"
      @update:modelValue="update()"
      style="width:100%"
    >
    </v-text-field>
  </span>
</template>

<script
  setup
  lang="ts"
>
import { ref, computed } from 'vue'
import { useI18n } from "vue-i18n"
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength } from '../../plugins/vuelidate'
import { nm as config } from '../../configs/items.js'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'common.name'
  },
  color: {
    type: String,
    default: ''
  }
})

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
const data = defineModel<String>('name', { default: '' })
const textfield = ref(null)

const rules = computed(() => ({
  data: {
    required,
    maxLength: maxLength(config.max)
  }
}))

/**
 * Vuelidate
 */
const v$ = useVuelidate(rules, { data })

/**
 * Обработка ошибок
 */
const dataErrors = computed(() => {
  const errors: any = []

  if (!v$.value.$dirty) return errors
  if (!v$.value.$errors.length) return errors

  v$.value.$errors.forEach(e => {
    errors.push(e.$message)
  })

  return errors
})

/**
 * onUpdate
 */
const update = () => {

  /**
   * Check lenght
   */
  if (data === null) return
  if (data.length > config.max) {
    data.value = data.value.substring(0, config.max)
  }
}

/**
 * Очистка
 */
const clear = () => {
  data.value = ''
}

/**
 * Внещний доступ к методам
 */
defineExpose({
  textfield,
})

</script>
