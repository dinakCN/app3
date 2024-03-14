<template>
  <div>

    <v-card class="rounded-lg">

      <!-- HEADER -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ $t('setting.units.cargo.header') }}
      </div>
      
      <div class="text-caption text-uppercase grey--text mx-2">
        {{ $t('setting.units.cargo.subtitle') }}
      </div>

      <v-card-text 
        class="d-flex align-center py-0"
      >
        <v-radio-group
          v-model="cargo['size']"
          class="mr-3"
          mandatory
          row
        >
          <v-radio
            :label="$t('units.mm')"
            value="0"
          ></v-radio>
          <v-radio
            :label="$t('units.sm')"
            value="1"
          ></v-radio>
          <v-radio
            :label="$t('units.m')"
            value="2"
          ></v-radio>
        </v-radio-group>

        <v-spacer></v-spacer>

        <v-radio-group
          v-model="cargo['wght']"
          row
        >
          <v-radio
            :label="$t('units.kg')"
            value="0"
          ></v-radio>
          <v-radio
            :label="$t('units.tn')"
            value="1"
          ></v-radio>
        </v-radio-group>
      </v-card-text>

    </v-card>

    <v-card class="rounded-lg mt-2">

      <!-- HEADER -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ $t('setting.units.loads.header') }}
      </div>

      <div class="text-caption text-uppercase grey--text mx-2">
        {{ $t('setting.units.loads.subtitle') }}
      </div>

      <v-card-text 
        class="d-flex align-center py-0"
      >
        <v-radio-group
          v-model="loads['size']"
          class="mr-3"
          mandatory
          row
        >
          <v-radio
            :label="$t('units.mm')"
            value="0"
          ></v-radio>
          <v-radio
            :label="$t('units.sm')"
            value="1"
          ></v-radio>
          <v-radio
            :label="$t('units.m')"
            value="2"
          ></v-radio>
        </v-radio-group>

        <v-spacer></v-spacer>

        <v-radio-group
          v-model="loads['wght']"
          row
        >
          <v-radio
            :label="$t('units.kg')"
            value="0"
          ></v-radio>
          <v-radio
            :label="$t('units.tn')"
            value="1"
          ></v-radio>
        </v-radio-group>
      </v-card-text>

    </v-card>

    <!-- BUTTONS -->
    <div class="d-flex alig-center mt-1">
      
      <v-spacer></v-spacer>

      <v-btn
        elevation="6"
        color="primary"
        rounded
        class="px-2"
        @click="submit()"
      >
        {{ $t('common.save') }}
      </v-btn>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'

export default {

  data() {
    return {
      cargo: { size: '1', wght: '0' },
      loads: { size: '1', wght: '0' }
    }
  },
  computed: {
    ...mapGetters('cargo', ['unitsCargo', 'unitsLoads'])
  },
  mounted() {
    this.getsFromConfig()
    this.hideToast()
  },
  methods: {
    ...mapActions('cargo', ['postConfigUnits']),
    ...mapActions('app', ['showError', 'hideToast']),
    ...mapMutations('app', ['setLoading']),

    getsFromConfig() {
      this.cargo = this.unitsCargo
      this.loads = this.unitsLoads
    },

    submit() {
      this.setLoading(true)
      this.postConfigUnits({ cargo: this.cargo, loads: this.loads })
        .then(
          () => this.$emit('close'),
          () => this.showError(this.$t('common.validation.error')))
        .finally(() => this.setLoading(false))
    }
    
  }

}
</script>