<template>
  <v-select
      ref="selectRef"
      v-model="data"
      dense
      :disabled="disabled"
      :variant="variant"
      :item-title="itemTitle"
      :label="t(label)"
      :items="items"
  >
    <template v-if="icon" v-slot:prepend>
      <v-icon small>{{ icon }}</v-icon>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useI18n} from "vue-i18n";

withDefaults(defineProps<{
  label: string,
  disabled?: boolean,
  itemTitle?: string,
  items: readonly any[],
  variant?: "outlined" | "plain" | "underlined" | "filled" | "solo" | "solo-inverted" | "solo-filled",
  icon?: string,
  color?: string,
  cls?: string
}>(), {
  variant: 'underlined',
  disabled: false,
  itemTitle: 'text',
  color: '#000000',
  cls: '',
  items: () => [],
  isSize: true,
});

const {t} = useI18n()

/**
 * Модель
 */
const data = defineModel<Number>('value', { default: 0 })

const selectRef = ref(null)

/**
 * Внещний доступ к методам
 */
defineExpose({
  selectRef,
})
</script>
