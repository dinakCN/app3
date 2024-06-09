<template>
  <v-text-field
      ref="searchfieldRef"
      class="my-1 px-1"
      v-model="data"
      :placeholder="placeholder ? t(placeholder) : ''"
      :outlined="Boolean(data)"
      :prepend-inner-icon="icons.magnify"
      @click:clear="clear"
      variant="underlined"
      hide-details
      block
      clearable
      solo
      flat
  >
  </v-text-field>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useI18n} from "vue-i18n";
import icons from "../../configs/constants/icons";

const props = withDefaults(defineProps<{
  placeholder?: string;
  clearable?: boolean;
}>(), {
  clearable: false,
  placeholder: '',
  cls: '',
});

/**
 * Lang
 */
const { t } = useI18n()

/**
 * Модель
 */
const data = defineModel<String>('value', { default: '' })

const searchfieldRef = ref(null)

/**
 * Очистка
 */
const clear = () => {
  data.value = ''
}

/**
 * Внещний доступ к методам
 */
defineExpose({
  searchfieldRef,
})
</script>
