<template>
  <v-dialog v-model="dialog" max-width="439">
    <v-card class="rounded-lg">
      <v-subheader>
        {{ t('cargo.move.header') }}
      </v-subheader>

      <v-form @submit.prevent="submit">
        <v-card-text class="pb-0">
          <select-field v-model:value="select" :items="points" label="common.select" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary lighten-1" variant="text" @click="close">
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn color="primary lighten-1" variant="text" type="submit">
            {{ t('common.ok') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, reactive, ref} from 'vue'
import { useCargoStore } from '../../stores/cargo'
import { useI18n } from 'vue-i18n'

const cargoStore = useCargoStore()
const { t } = useI18n()

const dialog = ref(false)
const select = ref(null)
const clid = ref(null)

const state = reactive({
  resolve: null as any,
  reject: null as any
})

const points = computed(() => {
  const pointsList = cargoStore.points.map((i) => {
    const order = cargoStore.pointOrder[i.id] ? cargoStore.pointOrder[i.id] + '.' : t('common.off')
    return { text: order + ': ' + i.name, value: i.id, disabled: String(i.id) === String(clid.value) }
  })

  pointsList.push({ text: '... ' + t('cargo.move.new').toLowerCase(), value: 'new', disabled: false })

  return pointsList
})

const submit = () => {
  dialog.value = false
  state.resolve = select.value
}

const open = (id: number) => {
  clid.value = id
  dialog.value = true
  return new Promise((resolve, reject) => {
    state.resolve = resolve
    state.reject = reject
  })
}

const close = () => {
  dialog.value = false
}

defineExpose({
  open,
  close
})
</script>
