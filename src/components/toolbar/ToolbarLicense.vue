<template>
  <v-btn
    icon
    :to="{ path: '/user#user-tarif'}"
  >
    <v-avatar
      size="38"
      :class="color"
      class="text-caption text-uppercase white--text"
    >
      {{ name }}
    </v-avatar>
  </v-btn>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('app', ['user']),
    name() {
      return this.user.tarif.type ? this.$t('tarif.type.1.subtitle') : this.$t('tarif.type.0.subtitle')
    },
    color() {
      if (this.user.tarif.type === 2) {

        return 'primary'
      } else if (this.user.tarif.type === 1) {

        return 'success'
      } else {

        return 'grey lighten-1'
      }
    }
  }
}
</script>
