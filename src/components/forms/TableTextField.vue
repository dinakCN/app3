<template>
  <v-text-field
      ref="fieldRef"
      v-model="data"
      :label="label ? t(label) : ''"
      :hint="hint ? t(hint) : ''"
      :color="color"
      :class="cls"
      :clear-icon="clearable ? icons.close : ''"
      dense
      :variant="variant"
      :error-messages="dataErrors"
      :max-length="max"
      :min-length="min"
      @update:modelValue="update"
      @input="v$.$touch()"
      @blur="v$.$touch()"
      style="width:100%"
  >
  </v-text-field>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {useI18n} from "vue-i18n";
import {onMounted, onUnmounted} from "vue";
import {maxLength, required} from "../../plugins/vuelidate";
import {useVuelidate} from "@vuelidate/core";
import icons from "../../configs/constants/icons";

const props = withDefaults(defineProps<{
  label?: string;
  hint?: string;
  clearable?: boolean;
  variant?: "underlined" | "filled" | "outlined" | "plain" | "solo" | "solo-inverted" | "solo-filled",
  max?: number,
  min?: number,
  color?: string,
  cls?: string,
}>(), {
  clearable: false,
  variant: 'plain',
  color: '#000000',
  cls: '',
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

const fieldRef = ref(null)

const rules = {
  data: {
    required,
    maxLength: maxLength(props.max)
  }
}

/**
 * Vuelidate
 */
const v$ = useVuelidate(rules, { data })

/**
 * Обработка ошибок
 */
const dataErrors = computed(() => {
  const errors: any = []

  if (!v$.value.$dirty) return errors
  if (!v$.value.$errors.length) return errors

  v$.value.$errors.forEach(e => {
    e.$validator === 'required' && errors.push(t('common.validation.required'))
    e.$validator === 'maxLength' && errors.push(t('common.validation.maxValue') + ' ' + e.$params.max)
  })

  return errors
})

const update = () => {

  if (data.value === null) return
  if (data.value.length > props.max) {
    data.value = data.value.substring(0, props.max)
  }
}

defineExpose({
  fieldRef,
})
</script>
