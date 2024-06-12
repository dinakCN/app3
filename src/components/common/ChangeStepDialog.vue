<template>
  <v-dialog v-model="dialog" max-width="360">
    <v-card class="rounded-lg pb-2 pt-3">
      <!-- FORM -->
      <v-form class="mx-2 d-flex align-center" @submit.prevent="submit">
        <number-field
            v-model:value="s"
            :step="1"
            label="scene.step.changeLabel"
            :config="{
              max: maxValue,
              min: minValue
            }"
        />
        <v-btn class="ml-1" color="primary" type="submit">
          <v-icon x-large>
            {{ icons.chevronDown }}
          </v-icon>
        </v-btn>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import icons from "../../configs/constants/icons";

const props = defineProps({
  maxValue: {
    type: Number,
    default: 1,
  },
  minValue: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['update:dialog'])

const dialog = ref(false)
const s = ref(1)

const v$ = useVuelidate()

const resolve = ref<((value: number | false) => void) | null>(null)
const reject = ref<((reason?: any) => void) | null>(null)

const submit = () => {
  v$.value.$touch()
  if (!v$.value.$error) {
    dialog.value = false
    if (resolve.value) resolve.value(s.value)
  }
}

const open = (n: number) => {
  dialog.value = true
  s.value = n
  return new Promise<number | false>((res, rej) => {
    resolve.value = res
    reject.value = rej
  })
}

const close = () => {
  if (resolve.value) resolve.value(false)
  dialog.value = false
}

watch(dialog, (newVal) => {
  emit('update:dialog', newVal)
})

defineExpose({
  open,
  close,
})
</script>
