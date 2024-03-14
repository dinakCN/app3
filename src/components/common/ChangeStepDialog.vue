<template>
  <v-dialog
    v-model="dialog"
    max-width="360"
  >
    <v-card class="rounded-lg pb-2 pt-3">

      <!-- FORM -->

      <v-form
        class="mx-2 d-flex align-center"
        @submit.prevent="submit()"
      >       
        <v-text-field
          v-model="s"
          :label="$t('scene.step.changeLabel')"
          required
          step="1"
          dense
          type="number"
          :error-messages="sErrors"
          @input="$v.s.$touch()"
          @blur="$v.s.$touch()"
        >
        </v-text-field>
        <v-btn
          icon
          class="ml-1"
          color="primary"
          type="submit"
        >
          <v-icon x-large>
            bx bxs-chevron-down-circle
          </v-icon>
        </v-btn>
      </v-form>

    </v-card>
  </v-dialog>  
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, integer, maxValue, minValue } from 'vuelidate/lib/validators'

export default {
  name: 'ChangeStepDialog',
  mixins: [validationMixin],
  props: {
    maxValue: {
      type: Number,
      default: 1
    },
    minValue: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      dialog: false,

      resolve: null,
      reject: null,

      s: 1
    }
  },
  validations() {
    return {
      s: { 
        required,
        integer,
        maxValue: maxValue(this.maxValue),
        minValue: minValue(this.minValue)
      }
    }
  },
  computed: {
    sErrors () {
      const errors = []
      
      if (!this.$v.s.$dirty) return errors

      !this.$v.s.required && errors.push(this.$t('common.validation.required'))
      !this.$v.s.integer  && errors.push(this.$t('common.validation.integer'))
      !this.$v.s.minValue && errors.push(this.$t('common.validation.minValue') + ' ' + this.minValue)
      !this.$v.s.maxValue && errors.push(this.$t('common.validation.maxValue') + ' ' + this.maxValue)

      return errors
    }
  },
  mounted() {
    this.$v.$reset()
  },
  beforeDestroy() {
    this.$v.$reset()
  },
  methods: {

    submit() {

      this.$v.$touch()

      if (!this.$v.$error) {

        this.dialog = false
      
        this.resolve(this.s)

      }
    },

    open(n) {

      this.dialog = true

      /** data by default */

      this.s = n

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },

    close() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>