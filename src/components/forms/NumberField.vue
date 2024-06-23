<template>
  <v-text-field
      ref="fieldRef"
      v-model="data"
      :label="label ? t(label) : ''"
      :color="color"
      :class="cls"
      :suffix="suffix && t(`${suffix}.${size}`)"
      class="centered-input"
      dense
      :hide-spin-buttons="withIcons"
      :prepend-inner-icon="withIcons ? icons.minusCircle : ''"
      :append-inner-icon="withIcons ? icons.plusCircle : ''"
      :variant="variant"
      type="number"
      :messages="subFieldText"
      :step="step"
      :error-messages="dataErrors"
      :max-length="config.max"
      @click:append-inner="changeCount(+step)"
      @click:prepend-inner="changeCount(-step)"
      @input="v$.$touch()"
      @blur="v$.$touch()"
      style="width:100%"
  >
    <template v-if="prependIcon" v-slot:prepend>
      <v-icon small>{{prependIcon}}</v-icon>
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import {ComputedRef, ref, watchEffect} from 'vue';
import {computed, onMounted, onUnmounted} from "vue";
import {required} from "../../plugins/vuelidate";
import {useVuelidate} from "@vuelidate/core";
import {useI18n} from "vue-i18n";
import {decimal, maxValue, minValue} from "@vuelidate/validators";
import icons from "../../configs/constants/icons";

interface IConfig {
    max: number;
    min: number;
}

const props = withDefaults(defineProps<{
  label?: string,
  isSize?: boolean,
  isNeedValidate?: boolean,
  variant?: "underlined" | "filled" | "outlined" | "plain" | "solo" | "solo-inverted" | "solo-filled",
  config?: IConfig,
  color?: string,
  cls?: string
  size?: number,
  step?: number
  suffix?: string
  withIcons?: boolean
  prependIcon?: string
  isCustomValidator?: object
}>(), {
  variant: 'underlined',
  color: '#000000',
  cls: '',
  isSize: true,
  withIcons: false,
  isNeedValidate: true
});

onMounted(() => {
  v$.value.$reset()
})
onUnmounted(() => {
  v$.value.$reset()
})

const {t} = useI18n()

/**
 * Модель
 */
const data = defineModel<Number>('value', { default: 0 })

const fieldRef = ref(null)

const changeCount = (st: number) => {
  data.value = +data.value + st
}

const subFieldText: ComputedRef<string> = computed(() => {
  if(!props.size) {
    return ''
  }
  const val = data.value ? data.value : 0
  return `${val}/${props.config.max}`
})

const rules = computed(()  => {
  return {
    data: props.isCustomValidator ? props.isCustomValidator : {
      required,
      decimal,
      minValue: props.isSize ? minValue(props.config.min) : minValue(props.config.min),
      maxValue: props.isSize ? maxValue(props.config.max) : maxValue(props.config.max)
    }
  }
})

/**
 * Vuelidate
 */
const v$ = useVuelidate(rules, { data })

const isInvalid = computed(() => v$.value.$invalid)

/**
 * Обработка ошибок
 */
const dataErrors = computed(() => {
  if(!props.isNeedValidate) return []

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
