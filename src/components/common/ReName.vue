<template>
  <span>
    <v-text-field
      v-model="name"
      :label="t(label)"
      :hint="t('item.name.hint')"
      :error-messages="nameErrors"
      :counter="config.max"
      :max-length="config.max"
      clearable
      required
      variant="underlined"
      type="text"
      @click:clear="name = ''"
      @change="nameLimiter"
      @input="fieldTouch"
      @blur="fieldTouch"
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

const name = ref(props.name)

const rules = computed(() => ({
  name: {
    required,
    maxLength: maxLength(config.max)
  }
}))

const v$ = useVuelidate(rules, { name })

console.log(v$)

const nameErrors = computed(() => {

  const errors: Array<string | null > = []

  if (!v$.value.name.$dirty) return errors

  !v$.value.name.maxLength && errors.push(t('common.validation.maxLength') + ' ' + config.max)
  !v$.value.name.required && errors.push(t('common.validation.required'))

  return errors
})

const nameLimiter = () => {
  fieldTouch()

  if (name.value === null) return
  if (name.value.length > config.max) name.value = name.value.substring(0, config.max)
}

const fieldTouch = () => {

  console.log('fieldTouch')

  v$.value.$touch()
}

const submit = (n: string) => {

  fieldTouch()

  if (v$.value.validationGroup.$error) {
    return false
  }

  const name = n

  // name = ''

  // v$.value.$reset()

  // return $emit('submit', name)
}

</script>
