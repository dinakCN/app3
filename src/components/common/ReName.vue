<template>
  <v-card
    class="rounded-lg pb-2"
    :class="[!head ? 'pt-2' : '']"
    elevation="2"
  >
    <v-card-actions v-if="head">
      <span class="text-button font-weight-bold ml-1">
        {{ head }}
      </span>     
    </v-card-actions>

    <!-- FORM -->
    <v-form
      class="mx-2 d-flex align-center"
      @submit.prevent="submit()"
    >       
      <v-text-field
        v-model="nm"
        :label="$t(label)"
        :hint="$t('item.nm.hint')"  
        :error-messages="nmErrors"
        :counter="config.max"
        required
        :max-length="config.max"
        clearable
        @click:clear="nm = ''"
        @input="$v.nm.$touch()"
        @change="nmLimiter()"
        @blur="$v.nm.$touch()"
      >
      </v-text-field>
      <v-btn
        icon
        class="ml-1"
        :color="color"
        type="submit"
      >
        <v-icon x-large>
          {{ icon }}
        </v-icon>
      </v-btn>
    </v-form>
  </v-card>
</template>

<script>
import { nm as nameConfig } from '@/configs/items.js'
import { validationMixin } from 'vuelidate'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  props: {
    icon: {
      type: String,
      default: 'bx bxs-plus-circle'
    },
    color: {
      type: String,
      default: 'primary'
    },
    name: {
      type: String,
      default: ''
    },
    head: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'common.name'
    }
  },
  data() {
    return {
      config: nameConfig,
      nm: this.name
    }
  },
  computed: {
    nmErrors () {
      const errors = []

      if (!this.$v.nm.$dirty) return errors
      !this.$v.nm.maxLength && errors.push(this.$t('common.validation.maxLength') + ' ' + this.config.max)
      !this.$v.nm.required && errors.push(this.$t('common.validation.required'))

      return errors
    }
  },
  validations() {
    return {
      nm: { 
        required,
        maxLength: maxLength(this.config.max)
      },
      validationGroup: ['nm']
    }
  },
  mounted() {
    this.$v.$reset()
  },
  beforeDestroy() {
    this.$v.$reset()
  },
  methods: {
    nmLimiter() {
      this.$v.nm.$touch()
      if (this.nm === null) return
      if (this.nm.length > this.config.max) this.nm = this.nm.substring(0, this.config.max)
    },
    submit() {
      this.$v.$touch()

      if (this.$v.validationGroup.$error) {
        return false
      } 
      
      const name = this.nm

      this.nm = ''
      this.$v.$reset()      

      return this.$emit('submit', name)
    }
  }
}
</script>