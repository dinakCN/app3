<template>
  <v-text-field
      ref="textfieldRef"
      v-model="data"
      :label="t(label)"
      :hint="t(hint)"
      :color="color"
      :class="cls"
      :clear-icon="clearable ? icons.close : ''"
      dense
      :clearable="clearable"
      :variant="'underlined'"
      :error-messages="dataErrors"
      :counter="config.max"
      :max-length="config.max"
      @update:modelValue="update"
      @click:clear="clear"
      @input="v$.$touch()"
      @blur="v$.$touch()"
      style="width:100%"
  >
  </v-text-field>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useI18n} from "vue-i18n";
import {computed, onMounted, onUnmounted} from "vue";
import {maxLength, required} from "../../plugins/vuelidate";
import {useVuelidate} from "@vuelidate/core";
import icons from "../../configs/constants/icons";

interface IConfig {
    max: number;
}

const props = withDefaults(defineProps<{
  label: string;
  hint: string;
  isNeedValidate?: boolean;
  clearable?: boolean;
  variant?: string,
  config?: IConfig,
  color?: string,
  cls?: string
}>(), {
  clearable: false,
  variant: 'underlined',
  color: '#000000',
  cls: '',
  isNeedValidate: true
});

onMounted(() => {
  v$.value.$reset()
})
onUnmounted(() => {
  v$.value.$reset()
})

/**
 * Lang
 */
const { t } = useI18n()

/**
 * Модель
 */
const data = defineModel<String>('value', { default: '' })

const textfieldRef = ref(null)

const rules = {
  data: {
    required,
    maxLength: maxLength(props.config.max)
  }
}

/**
 * Vuelidate
 */
const v$ = useVuelidate(props.isNeedValidate ? rules : {}, { data })

/**
 * Обработка ошибок
 */
const dataErrors = computed(() => {
  const errors: any = []

  if (!v$.value.$dirty) return errors
  if (!v$.value.$errors.length) return errors

  v$.value.$errors.forEach(e => {
    errors.push(e.$message)
  })

  return errors
})

/**
 * onUpdate
 */
const update = () => {

  /**
   * Check lenght
   */
  if (data.value === null) return
  if (data.value.length > props.config.max) {
    data.value = data.value.substring(0, props.config.max)
  }
}

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
  textfieldRef,
})
</script>
