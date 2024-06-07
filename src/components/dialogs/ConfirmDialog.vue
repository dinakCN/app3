<script setup lang="ts">
import {ref} from "vue"
import {useI18n} from "vue-i18n";
import {reactive} from "vue";

const {t} = useI18n();

const isActive = ref(false)
const text = ref('')

const state = reactive({
  resolve: null as any,
  reject: null as any
})

const close = () => {
  isActive.value = false
  text.value = ''
  state.resolve(false)
  return false
}

const apply = () => {
  isActive.value = false
  text.value = ''
  state.resolve(true)
  return true
}

const open = (str: string) => {
  text.value = str
  isActive.value = true
  return new Promise((resolve, reject) => {
    state.resolve = resolve
    state.reject = reject
  })
}

defineExpose({
  close,
  apply,
  open,
})

</script>

<template>
  <v-dialog
    v-model="isActive"
    max-width="400"
    persistent
  >
    <v-card
      prepend-icon="mdi:mdi-head-question-outline"
      :text=" text ? `${t(text)}?` : ''"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="close">
          {{ t('$vuetify.close')}}
        </v-btn>

        <v-btn @click="apply">
          {{ t('$vuetify.apply')}}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
