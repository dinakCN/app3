<template>
  <span>
    <!-- STEP -->

    <v-btn
      v-if="!step && sceneMaxPage"
      height="36px"
      text
      rounded
      small
      class="font-weight-bold"
      style="position: absolute; z-index: 1; right: 48px; top: 0;"
      @click="startStep()"
    >                
      <v-icon left color="primary">
        bx bxs-game
      </v-icon>
      {{ $t('scene.step.label') }}
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
            icon
            small           
            @click="prevStepMax()"
          >                
            <v-icon class="font-weight-regular">
              bx-chevrons-left
            </v-icon>
          </v-btn>

          <v-btn
            icon
            small
            @click="prevStep()"
          >                
            <v-icon class="font-weight-regular">
              bx-left-arrow-circle
            </v-icon>
          </v-btn>

          <v-btn
            text
            small
            width="70px"
            class="font-weight-regular text-caption"
            @click="() => stepDialog()"
          >                
            {{ stepsVal }}
          </v-btn>

          <v-btn
            icon
            small
            @click="nextStep()"
          >                
            <v-icon class="font-weight-regular">
              bx-right-arrow-circle
            </v-icon>
          </v-btn>

          <v-btn
            icon
            small
            @click="nextStepMax()"
          >                
            <v-icon class="font-weight-regular">
              bx-chevrons-right
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
            bx-x
          </v-icon>
          {{ $t('$vuetify.close') }}
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

    <StepDialog
      ref="step"
      :maxValue="stepMax"
    />
    
  </span>
</template>

<script>

export default {
  name: 'StepComponent',
  components: {
    StepDialog: () => import(/* webpackPrefetch: true */'@/components/common/ChangeStepDialog')
  },
  mixins: [messMixin],
  data() {
    return {

      /** режим шагов загрузки */

      step: null,
      stepMax: null,
      stepType: 1
    }
  },
  computed: {

    stepsVal() {

      if (this.step) return this.step + ' / ' + this.stepMax

      return this.$t('scene.step.all')
    }

  },
  watch: {
    stepType() {
      // sceneCreate.clearStep(true)
      // sceneCreate.setStep(this.step, this.stepType)
    }
  },
  methods: {

    /** 
     * 
     * step change
     * 
     */

    nextStep() {

      if (this.step < this.stepMax) {

        this.step++

        this.makeStep()
        this.hideToast()

      } else {
        this.prevStepMax()
      }

    },

    prevStepMax() {
      this.step = 1
      this.makeStep()        
    },

    prevStep() {

      if (this.step > 1) {

        this.step--

        this.makeStep()
        this.hideToast()

      } else {
        this.nextStepMax()
      }     
      
    },

    nextStepMax() {
      this.step = this.stepMax
      this.makeStep()      
    },

    startStep() {

      this.step = 1
      this.makeStep()

    },

    makeStep() {
      if (!sceneCreate?.setup) return 

      sceneCreate.setStep(this.step, this.stepType)
    },

    stopStep(deep = true) {
      
      this.step = null

      if (!sceneCreate?.setup) return 
      
      sceneCreate.clearStep(deep)
  
    },

    async stepDialog() {

      /**
       * открыть диалог
       * 
       */

      const update = await this.$refs.step.open(this.step)

      /**
       * смена шага погрузки
       * 
       */

      if (update >= 1 && update <= this.stepMax)  {

        this.step = update

        this.makeStep()
      }
    }
  }
}
</script>
