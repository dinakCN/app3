<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ props }">
      <div ref="copylabel" class="copylabel animate__faster" v-bind="props" @click.stop.prevent="performCopy">{{ text }}</div>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, Ref } from 'vue'
import {useClipboard} from "../../hooks/useClipboard";

const props = withDefaults(defineProps<{
    text: string,
    toastText: string,
    animation: string
}>(), {
  text: '',
  toastText: 'Copied to clipboard!',
  animation: 'heartBeat'
})

const tooltip = ref('Copy')
const timeout = ref<ReturnType<typeof setTimeout> | null>(null)
const copylabel: Ref<HTMLElement> = ref(null)

const { copy } = useClipboard()

const performCopy = async () => {
  await copy(props.text, props.toastText)
  if (copylabel.value) {
    await animateCSS(copylabel.value, props.animation)
  }
  tooltip.value = 'Copied!'
  if (timeout.value) clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    tooltip.value = 'Copy'
  }, 2000)
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`
    element.classList.add(`${prefix}animated`, animationName)

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation()
      element.classList.remove(`${prefix}animated`, animationName)
      resolve('Animation ended')
    }

    element.addEventListener('animationend', handleAnimationEnd, { once: true })
  })

onBeforeUnmount(() => {
  if (timeout.value) clearTimeout(timeout.value)
})
</script>

<style scoped>
.copylabel {
  cursor: pointer;
  display: inline-block;
  border-bottom: 1px dashed;
}
</style>
