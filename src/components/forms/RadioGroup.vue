<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {ref} from "vue";

withDefaults(defineProps<{
  items: readonly any[],
  cls?: string,
  mandatory?: boolean,
  inline?: boolean,
}>(), {
  items: () => [],
  mandatory: false,
  inline: false,
});

const {t} = useI18n()

/**
 * Модель
 */
const data = defineModel<Number>('value', { default: 0 })

const groupRef = ref(null)

/**
 * Внещний доступ к методам
 */
defineExpose({
  groupRef,
})
</script>

<template>
  <v-radio-group
      ref="groupRef"
      v-model="data"
      :class="cls"
      :mandatory="mandatory"
      :inline="inline"
  >
    <template v-for="(item) in items">
      <v-radio
          :label="t(item.text)"
          :value="item.value"
      ></v-radio>
    </template>
  </v-radio-group>
</template>

<style scoped>

</style>
