<template>
  <v-dialog
    v-model="state.dialog"
    max-width="439"
  >
    <v-card>text</v-card>
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
  dialog: false as  boolean | undefined,
  name: '' as string,
  resolve: null as any,
  reject: null as any
})

const submit = (name: string) => {
  state.dialog = false
  state.resolve(name)
}

const test = () => true

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

</script>
