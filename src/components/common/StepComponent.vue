<template>
  <span>
    <!-- STEP -->
    <v-btn
        v-if="!step && sceneMaxPage"
        height="36px"
        variant="text"
        rounded
        small
        class="font-weight-bold"
        style="position: absolute; z-index: 1; right: 48px; top: 0;"
        @click="startStep"
    >
      <v-icon left color="primary">
        bx bxs-game
      </v-icon>
      {{ t('scene.step.label') }}
    </v-btn>

    <v-expand-x-transition>
      <div
          v-if="step && sceneMaxPage"
          class="d-flex align-center pl-1"
          style="position: absolute; z-index: 1; right: 48px; top: 0; height:36px;"
      >
        <v-toolbar
            color="primary"
            dark
            height="36px"
            rounded="xl"
            class="d-flex justify-content-center align-center"
        >
          <v-btn
              small
              @click="prevStepMax"
          >
            <v-icon class="font-weight-regular">
              {{ icons.chevronRight }}
            </v-icon>
          </v-btn>

          <v-btn
              small
              @click="prevStep"
          >
            <v-icon class="font-weight-regular">
              {{ icons.arrowLeftCircle }}
            </v-icon>
          </v-btn>

          <v-btn
              variant="text"
              small
              width="70px"
              class="font-weight-regular text-caption"
              @click="stepDialog"
          >
            {{ stepsVal }}
          </v-btn>

          <v-btn
              small
              @click="nextStep"
          >
            <v-icon class="font-weight-regular">
               {{ icons.arrowRightCircle }}
            </v-icon>
          </v-btn>

          <v-btn
              small
              @click="nextStepMax"
          >
            <v-icon class="font-weight-regular">
              {{ icons.chevronRight }}
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-btn
            small
            height="36px"
            rounded
            class="font-weight-bold ml-1 px-2"
            @click="stopStep(false)"
        >
          <v-icon left color="red">
            {{ icons.close }}
          </v-icon>
          {{ t('$vuetify.close') }}
        </v-btn>
      </div>
    </v-expand-x-transition>

    <div v-if="step" style="position: absolute; z-index: 1; right: 48px; top: 45px; height:40px; ">
      <v-chip-group
          v-model="stepType"
          mandatory
          column
          center-active
          color="transparent"
          active-class="primary--text"
      >
        <v-chip
            small
            outlined
            pill
            :value="0"
        >
          верхняя загрузка
        </v-chip>
        <v-chip
            small
            outlined
            pill
            :value="1"
        >
          задняя загрузка
        </v-chip>
      </v-chip-group>
    </div>

    <ChangeStepDialog
        ref="stepRef"
        :maxValue="stepMax"
    />
  </span>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import icons from "../../configs/constants/icons";
import ChangeStepDialog from "./ChangeStepDialog.vue";

const { t } = useI18n()

//TODO: ?????
const sceneCreate = null
const sceneMaxPage = 1

const stepRef = ref<typeof ChangeStepDialog | null>(null)

const step = ref<number | null>(null)
const stepMax = ref<number | null>(null)
const stepType = ref<number>(1)

const stepsVal = computed(() => {
  if (step.value) return `${step.value} / ${stepMax.value}`
  return t('scene.step.all')
})

const startStep = () => {
  step.value = 1
  makeStep()
}

const nextStep = () => {
  if (step.value && step.value < stepMax.value) {
    step.value++
    makeStep()
  } else {
    prevStepMax()
  }
}

const prevStepMax = () => {
  step.value = 1
  makeStep()
}

const prevStep = () => {
  if (step.value && step.value > 1) {
    step.value--
    makeStep()
  } else {
    nextStepMax()
  }
}

const nextStepMax = () => {
  step.value = stepMax.value
  makeStep()
}

const makeStep = () => {
  if (!sceneCreate?.setup) return
  sceneCreate.setStep(step.value, stepType.value)
}

const stopStep = (deep = true) => {
  step.value = null
  if (!sceneCreate?.setup) return
  sceneCreate.clearStep(deep)
}

const stepDialog = async () => {
  const update = await stepRef.value.open(step.value)
  if (update >= 1 && update <= stepMax.value) {
    step.value = update
    makeStep()
  }
}
</script>
