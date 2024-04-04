<template>
  <v-dialog
    v-model="state.dialog"
    width="auto"
  >
    <v-card
      min-width="410"
      :prepend-icon="head ? 'mdi:mdi mdi-update' : ''"
      :title="head"
    >
      <v-form class="mx-3 mt-1">
        <NameField
          ref="data"
          v-model:name="state.name"
          :label="label"
          color="primary"
        />
      </v-form>
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
          :text="t('common.close')"
          variant="plain"
          size="small"
          @click="close()"
        ></v-btn>
        <v-btn
          color="primary"
          :text="t('common.save')"
          variant="text"
          size="small"
          class="mr-1"
          @click="submit()"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>


<script
  setup
  lang="ts"
>
import { reactive, ref } from 'vue'
import { useI18n } from "vue-i18n"
import { useVuelidate } from '@vuelidate/core'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  color: {
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

/*
* Lang
*/
const { t } = useI18n()

/**
 * Valid
 */
const v$ = useVuelidate()

const state = reactive({
  dialog: false as boolean | undefined,
  name: '' as string,
  resolve: null as any,
  reject: null as any
})

const data = ref<HTMLFormElement | null>(null)

const submit = async () => {

  v$.value.$reset()

  const isFormCorrect = await v$.value.$validate()

  if (!isFormCorrect) return false

  state.resolve(state.name)
  state.dialog = false

  return true
}

const open = (name: string) => {
  state.dialog = true
  state.name = name

  setTimeout(() => {
    if (data?.value?.textfield) data.value.textfield.focus()
  }, 200)

  return new Promise((resolve, reject) => {
    state.resolve = resolve
    state.reject = reject
  })
}

const close = () => {
  state.resolve(false)
  state.dialog = false
}

/**
 * Внещний доступ к методам
 */
defineExpose({
  open,
})

</script>
