<template>
  <span>
    <v-text-field
      v-model="state.name"
      :label="t(label)"
      :hint="t('item.name.hint')"
      :error-messages="nameErrors"
      :counter="config.max"
      required
      :max-length="config.max"
      clearable
      variant="plain"
      @click:clear="state.name = ''"
      @input="v$.name.touch()"
      @change="nameLimiter()"
      @blur="v$.name.touch()"
      style="width:100%"
    >
    </v-text-field>
  </span>
</template>

<script
  setup
  lang="ts"
>
import { reactive, computed } from 'vue'
import { useI18n } from "vue-i18n"
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength } from '@vuelidate/validators'
import { nm as config } from '../../configs/items.js'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'common.name'
  },
  name: {
    type: String,
    default: 'cs'
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

const state = reactive({
  name: ''
})

const rules = computed(() => ({
  name: {
    required,
    maxLength: maxLength(config.max)
  }
}))

const v$ = useVuelidate(rules, state)

console.log(v$)

const nameErrors = computed(() => {

  const errors: Array<string | readonly string[] | null | undefined> = []

  if (!v$.value.name.$dirty) return errors

  !v$.value.name.maxLength && errors.push(t('common.validation.maxLength') + ' ' + config.max)
  !v$.value.name.required && errors.push(t('common.validation.required'))

  return errors
})

const nameLimiter = () => {
  v$.value.name.touch()

  if (state.name === null) return
  if (state.name.length > config.max) state.name = state.name.substring(0, config.max)
}

const submit = (n: string) => {

  v$.value.touch()

  if (v$.value.validationGroup.$error) {
    return false
  }

  const name = n

  // name = ''

  // v$.value.$reset()

  // return $emit('submit', name)
}

</script>
