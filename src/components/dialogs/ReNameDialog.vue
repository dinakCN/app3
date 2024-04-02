<template>
  <v-dialog
    v-model="state.dialog"
    width="auto"
  >
    <v-card
      max-width="560"
      min-width="400"
      prepend-icon="mdi:mdi mdi-update"
      :title="head"
    >

      <v-form
        class="ma-2"
        @submit.prevent="submit(state.name)"
      >
        <ReName

        />
      </v-form>

      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Close"
          variant="plain"
          @click="close()"
        ></v-btn>
        <v-btn
          color="primary"
          text="Save"
          variant="tonal"
          @click="submit(state.name)"
        ></v-btn>
      </template>

    </v-card>

  </v-dialog>
</template>


<script
  setup
  lang="ts"
>
import { reactive } from 'vue'

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

const state = reactive({
  dialog: false as boolean | undefined,
  name: '' as string,
  resolve: null as any,
  reject: null as any
})

const submit = (name: string) => {
  state.dialog = false
  state.resolve(name)
}

const open = (name: string) => {
  state.dialog = true
  state.name = name

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
