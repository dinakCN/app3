<template>
  <div>

    <div class="mt-1 text-center grey--text text-darken-1 text-subtitle-2 text-uppercase font-weight-regular">
      <div>
        {{ $t('tarif.current') }}: {{ license }}
      </div>
      <div v-if="user.tarif.type == 2">
        {{ $t('tarif.expir') }}: {{ licExpir }}
      </div>
    </div>

    <v-row dense class="mt-3 px-3">
      <v-col
        v-for="(plan, i) in plans"
        :key="i"
        cols="12"
        md="6"
      >
        <v-card
          class="text-body-1"
          rounded="lg"
          :class="plan.highlight && 'elevation-19'"
          :dark="plan.highlight"
          :color="plan.highlight ? 'primary darken-3' : ''"
        >

          <v-card-text
            :class="plan.highlight ? 'white--text' : ''"
            class="mb-0 pt-4 text-center"
          >
            <div
              class="text-h6 text-md-h5 text-xl-h4 font-weight-bold text-uppercase mb-1"
            >
              {{ plan.title }}
            </div>
            <div
              :class="plan.highlight ? 'white--text' : 'grey--text text-darken-1'"
              class="overline"
            >
              {{ plan.subtitle }}
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-text
            :class="plan.highlight ? 'white--text' : ''"
            class="pa-3 pb-1 text-subtitle-1"
          >
            <div v-for="(feat, j) in plan.features" :key="j" class="d-flex align-center my-1">

              <v-icon v-if="feat.status" color="success" class="mr-2">bx bx-check</v-icon>
              <v-icon v-else color="error" class="mr-2">bx bx-x</v-icon>

              <span v-if="feat.value && feat.showvalue" class="font-weight-black mr-1">{{ feat.value }}</span>
              <span class="font-weight-regular" :class="[!feat.status && 'grey--text text-darken-1']">{{ feat.label }}</span>

            </div>
          </v-card-text>
          <v-card-actions class="px-2 pb-2">
            <v-btn
              v-if="plan.highlight"
              x-large
              block
              rounded
              outlined
              dark
              class="px-2"
              to="/user#user-payments"
            >
              <span>{{ $t('tarif.type.1.button') }}</span>
            </v-btn>
            <v-btn
              v-if="!plan.highlight"
              x-large
              block
              text
              rounded
              disabled
              class="px-2"
            >
              {{ $t('tarif.type.0.button') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      plans: [{
        highlight: false,
        title: this.$t('tarif.type.0.title'),
        subtitle: this.$tc('tarif.tarif'),
        features: [{
          value: 7,
          status: true,
          showvalue: true,
          label: this.$t('tarif.options.items')
        }, {
          value: 1,
          showvalue: true,
          status: true,
          label: this.$tc('tarif.options.project', 1)
        }, {
          value: 0,
          showvalue: false,
          status: false,
          label: this.$tc('tarif.options.templates.cargo')
        }, {
          value: 0,
          showvalue: false,
          status: false,
          label: this.$tc('tarif.options.templates.loads')
        }, {
          value: 0,
          showvalue: false,
          status: false,
          label: this.$t('tarif.options.cargo-size')
        }]
      }, {
        highlight: true,
        title: this.$t('tarif.type.1.title'),
        subtitle: this.$tc('tarif.tarif'),
        features: [{
          value: 7000,
          showvalue: true,
          status: true,
          label: this.$t('tarif.options.items')
        }, {
          value: 300,
          showvalue: true,
          status: true,
          label: this.$tc('tarif.options.project', 300)
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$tc('tarif.options.templates.cargo', 0)
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$tc('tarif.options.templates.loads', 0)
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$t('tarif.options.pdf')
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$t('tarif.options.cargo-size')
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$t('tarif.options.loads-size')
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$t('tarif.options.transport-counts')
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$t('tarif.options.transport-many')
        }, {
          value: 0,
          showvalue: false,
          status: true,
          label: this.$t('tarif.options.move')
        }]
      }]
    }
  },
  computed: {
    ...mapState('app', ['user']),
    license() {
      return this.user.tarif.type ? this.$t('tarif.type.1.title') : this.$t('tarif.type.0.title')
    },
    colors() {
      let cr

      if (Number(this.user.tarif.type) === 2) {
        cr = 'primary--text'
      } else if (Number(this.user.tarif.type) === 1) {
        cr = 'success--text'
      } else {
        cr = 'grey--text text-darken-3'
      }

      return cr
    },
    licExpir() {
      if (Date.parse(this.user.tarif.expir) >= Date.now()) {
        const date = new Date(this.user.tarif.expir)

        return `${date.getDate()}.${(date.getMonth() + 1)}.${date.getFullYear()}`
      }

      return ''
    }
  },
  mounted() {
    this.getTarifs()
      .then((r) => {

        const index = [0, 1]
        const array = ['max_items', 'max_projects', 'max_cargo_t', 'max_loads_t']

        index.forEach((tp) => {
          array.forEach((i, index) => {
            this.plans[tp].features[index].value = r[tp][i]
            this.plans[tp].features[index].status = Boolean(r[tp][i])
          })
        })
      })
  },
  methods: {
    ...mapActions('cargo', ['getTarifs'])
  }
}
</script>
