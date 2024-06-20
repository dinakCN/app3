<template>
  <v-text-field
      ref="fieldRef"
      v-model="data"
      :class="cls"
      class="centered-input"
      dense
      :hide-spin-buttons="true"
      :variant="variant"
      type="number"
      :step="step"
      :error-messages="dataErrors"
      :max-length="max"
      :min-length="min"
      @input="v$.$touch()"
      @blur="v$.$touch()"
  >
  </v-text-field>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import { getWght, getSize } from '@/configs/functions/getunits.js';
import {computed, onMounted, onUnmounted} from "vue";
import {required} from "../../plugins/vuelidate";
import {useVuelidate} from "@vuelidate/core";
import {decimal} from "@vuelidate/validators";

const props = withDefaults(defineProps<{
  isSize?: boolean,
  variant?: "underlined" | "filled" | "outlined" | "plain" | "solo" | "solo-inverted" | "solo-filled",
  min: number,
  max: number,
  cls?: string
  size?: number,
  step?: number
  suffix?: string
}>(), {
  variant: 'plain',
  cls: '',
  isSize: true,
});

onMounted(() => {
  v$.value.$reset()
})
onUnmounted(() => {
  v$.value.$reset()
})

/**
 * Модель
 */
const data = defineModel<Number>('value', { default: 0 })

const fieldRef = ref(null)

const changeCount = (st: number) => {
  data.value = +data.value + st
}

const rules = {
  data: props.isCustomValidator ? props.isCustomValidator : {
    required,
    decimal,
    minValue: props.isSize ? getSize(props.min, props.size) : getWght(props.min, props.size),
    maxValue: props.isSize ? getSize(props.max, props.size) : getWght(props.max, props.size)
  }
}

/**
 * Vuelidate
 */
const v$ = useVuelidate(rules, { data })

const isInvalid = computed(() => v$.value.$invalid)

/**
 * Обработка ошибок
 */
const dataErrors = computed(() => {
  const errors: any = []

  if (!v$.value.$dirty) return errors
  if (!v$.value.$errors.length) return errors
  v$.value.$errors.forEach(e => {
    e.$validator === 'required' && errors.push(t('common.validation.required'))
    e.$validator === 'integer'  && errors.push(t('common.validation.integer'))
    e.$validator === 'minValue' && errors.push(t('common.validation.minValue') + ' ' + e.$params.min)
    e.$validator === 'maxValue' && errors.push(t('common.validation.maxValue') + ' ' + e.$params.max)
    errors.push(e.$message)
  })

  return errors
})

/**
 * Внещний доступ к методам
 */
defineExpose({
  fieldRef,
  isInvalid
})
</script>
