<template>
  <v-dialog
    v-model="dialog"
    max-width="590"
    persistent
  >
    <v-card rounded="lg" class="pa-1">

      <v-card-title class="text-h5 error--text text-justify-center text-center">
        Инструкция по управлению сценой
      </v-card-title>

      <div class="d-flex">

        <div :class="$vuetify.breakpoint.mobile ? 'd-none' : 'd-block'">
          <!--Icon -->
          <v-img
            :src="require('@/assets/images/jets/error.svg')"
            max-width="256"
            min-height="256"
            alt="calculate error"
            class="mt-2"
            style="margin:0 auto"
          ></v-img> 
        </div>

        <div>

          <v-card-text class="grey--text text--darken-3 font-weight-regular">
        
            <div v-show="text" class="mt-1">{{ text }}</div>
            <div v-show="call" class="mt-1 font-weight-bold">{{ call }}</div>

            <div class="mt-1">
              <router-link to="/user#user-tarif">{{ $t('common.needlicense') }}</router-link>
            </div>
          </v-card-text>

        </div>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="grey darken-3"
          text
          class="font-weight-medium"
          @click="close"
        >
          {{ this.$t('$vuetify.close') }}
        </v-btn>       

        <v-btn
          rounded
          color="error"
          to="/user#user-tarif"
          class="px-2 font-weight-medium"
        >
          {{ this.$t('common.getlicense') }}
        </v-btn>

      </v-card-actions>
      
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PromoDialog',
  props: {
    text: {
      type: String,
      default: ''
    },
    call: {
      type: String,
      default: ''
    },
    head: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  methods: {
    open() {
      this.dialog = true
    },

    close() {
      this.dialog = false
    }
  }
}
</script>