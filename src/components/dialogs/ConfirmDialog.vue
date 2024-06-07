<script setup lang="ts">
import {ref} from "vue"
import {useI18n} from "vue-i18n";

defineProps<{
  text: string
}>()

const {t} = useI18n();

const isActive = ref(false)

const emit = defineEmits(['apply', 'close'])
const close = () => {
  isActive.value = false
  emit('close', false)
}

const apply = () => {
  isActive.value = false
  emit('apply', false)
}

const open = () => {
  isActive.value = true
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
      prepend-icon="mdi-map-marker"
      :text="text"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>

        <v-btn @click="close">
          {{ t('$vuetify.close)')}}
        </v-btn>

        <v-btn @click="apply">
          {{ t('$vuetify.apply)')}}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
