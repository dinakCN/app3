<template>
  <v-card
    class="rounded-lg pb-2"
    :class="[!head ? 'pt-2' : '']"
  >
    <v-card-actions v-if="head">
      <span class="text-button font-weight-bold ml-1">
        {{ head }}
      </span>
    </v-card-actions>

    <!-- FORM -->
    <v-form
      class="mx-2 d-flex align-center"
      @submit.prevent="submit()"
    >
      <v-text-field
        v-model="v$.name"
        :label="t(label)"
        :hint="t('item.name.hint')"
        :error-messages="nameErrors"
        :counter="config.max"
        required
        :max-length="config.max"
        clearable
        @click:clear="name = ''"
        @input="v$.name.touch()"
        @change="nameLimiter()"
        @blur="v$.name.touch()"
      >
      </v-text-field>
      <v-btn
        icon
        class="ml-1"
        :color="color"
        type="submit"
      >
        <v-icon x-large>
          {{ icon }}
        </v-icon>
      </v-btn>
    </v-form>
  </v-card>
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
  icon: {
    type: String,
    default: 'bx bxs-plus-circle'
  },
  color: {
    type: String,
    default: 'primary'
  },
  name: {
    type: String,
    default: ''
  },
  head: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'common.name'
  }
})

onMounted(() => {
  v$.$reset()
})
onUnmounted(() => {
  v$.$reset()
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

const nameErrors = computed(() => {

  const errors: Array<string | readonly string[] | null | undefined> = []

  if (!v$.name.$dirty) return errors

  !v$.name.maxLength && errors.push(t('common.validation.maxLength') + ' ' + config.max)
  !v$.name.required && errors.push(t('common.validation.required'))

  return errors
})

const nameLimiter = () => {
  v$.name.touch()

  if (state.name === null) return
  if (state.name.length > config.max) state.name = state.name.substring(0, config.max)
}

const submit = () => {

  v$.touch()

  if (v$.validationGroup.$error) {
    return false
  }

  const name = name

  name = ''

  v$.$reset()

  return $emit('submit', name)
}

</script>
