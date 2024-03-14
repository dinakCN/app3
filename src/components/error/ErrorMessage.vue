<template>
  <v-overlay
    absolute
    :z-index="2"
    value="1"
    opacity="1"
    color="#f2f5f8"
  >
    <v-card
      light
      rounded="xl"
      width="350px"
      class="text-center w-full pa-4 elevation-14"
      style="min-width:350px;"
    > 
      <!-- Header -->
      <div class="text-h4 font-weight-thin text-center pt-3">
        {{ $t('scene.valid.jethead') }}
      </div> 

      <!--Icon  -->
      <v-img
        :src="require('@/assets/images/jets/' + icon + '.svg')"
        max-width="128"
        min-height="128"
        alt="calculate error"
        class="mt-2"
        style="margin:0 auto"
      ></v-img> 

      <!-- Message -->
      <div class="mt-2" style="max-width:380px;">
        <div class="text-body-2 font-weight-medium text-center">
          {{ message }}
        </div>
      </div> 

      <!-- Button -->
      <v-btn
        v-if="button"
        to="/"
        rounded
        large
        color="error"
        class="mt-4"
      >
        {{ $t('share.btn') }}
      </v-btn>

    </v-card>
  </v-overlay>
</template>

<script>

export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'repair'
    },
    button: {
      type: Boolean,
      default: false
    }
  }
}
</script>
