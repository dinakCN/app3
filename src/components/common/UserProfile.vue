<template>
  <div>
    <v-card class="rounded-lg">

      <!-- HEADER -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ $t('user.header') }}
      </div>

      <v-card-text class="black--text">
        <v-row dense>
          <v-col cols="6" sm="5" md="4" lg="3">
            {{ $t('user.name') }}:
          </v-col>
          <v-col class="font-weight-medium primary--text" @click="setReName()">
            {{ name }}
            <v-btn
              color="primary"
              icon
              small
              @click="setReName()"
            >
              <v-icon small>bx bx-edit-alt</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense class="mt-0">
          <v-col cols="6" sm="5" md="4" lg="3">
            {{ $t('user.email') }}:
          </v-col>
          <v-col class="font-weight-medium">
            {{ email }}
          </v-col>
        </v-row>

        <v-row
          dense
          class="mt-1"
          :class="[user.discount ? 'red--text text-lighten-1' : 'black--text']"
        >
          <v-col
            :class="[user.discount && 'font-weight-bold']"
            cols="6"
            sm="5"
            md="4"
            lg="3"
          >
            Скидка:
          </v-col>
          <v-col
            class="font-weight-medium"
            :class="[user.discount && 'font-weight-bold']"
          >
            {{ user.discount }}%
          </v-col>
        </v-row>

      </v-card-text>

      <!-- SUBMISSION -->
      <div class="text-button font-weight-bold mx-2 pt-1">
        {{ $t('user.submission') }}
      </div>

      <v-card-text class="black--text">
        <template v-for="(i, index) in data">
          <v-row
            :key="index"
            dense
          >
            <v-col cols="6" sm="5" md="4" lg="3">
              {{ i.head }}:
            </v-col>
            <v-col :class="[i.color && colors]" class="font-weight-medium">
              {{ i.text }}
            </v-col>
          </v-row>
        </template>
      </v-card-text>

      <div v-if="stats" class="grey--text text-darken-3">

        <div class="text-button font-weight-bold mx-2 pt-1">
          Статистика
        </div>

        <!-- STATS -->
        <v-card-text>
          <v-row dense>
            <v-col cols="6" sm="5" md="4" lg="3">
              Расчетов выполнено:
            </v-col>
            <v-col class="font-weight-medium">
              {{ stats }}
            </v-col>
          </v-row>
        </v-card-text>

      </div>

      <v-card-actions class="align-center">

        <v-spacer></v-spacer>

        <v-btn
          color="success"
          rounded
          class="px-2"
          to="/user#user-changepass"
        >
          {{ $t('user.pwdchange') }}
        </v-btn>
        <v-btn
          color="error"
          rounded
          class="px-2"
          @click="exit()"
        >
          {{ $t('user.logout') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- DOCUMETNS LIST -->

    <v-card class="rounded-lg">

    </v-card>

    <!-- EDIT NAME -->
    <ReName
      ref="dialogReName"
      icon="bx bxs-check-circle"
      color="primary"
    />

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ReName from '@/components/common/ReNameDialog'

export default {
  name: 'UserProfile',
  components: {
    ReName
  },
  data() {
    return {
      stats: 0,
      name: null,
      email: null
    }
  },
  computed: {
    ...mapState('app', ['user']),
    license() {
      let t

      if (Number(this.user.tarif.type) === 2) {

        t = `${this.$t('tarif.type.1.title')}`

      } else if (Number(this.user.tarif.type) === 1) {

        t = `${this.$t('tarif.type.1.title')}`

      } else {

        t = this.$t('tarif.type.0.title')
      }

      return t
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
    data() {
      const o = []

      o.push({ head: this.$t('tarif.current'), text: this.license, color: true })

      if (this.user.tarif.type) {

        if (this.user.tarif.count) {
          o.push({ head: this.$t('tarif.count'), text: this.user.tarif.count, color: true })
        }

        if (this.licExpir) {
          o.push({ head: this.$t('tarif.expir'), text: this.licExpir, color: true })
        }

      }

      return o
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
    this.getConfig()
      .then((r) => {
        const { user, stats } = r

        if (stats?.counts) this.stats = stats.counts
        if (user?.email)   this.email = user.email
        if (user?.name)    this.name  = user.name

      })
  },
  methods: {
    ...mapActions('cargo', ['postConfigProfile', 'getConfig']),

    async setReName() {
      const update = await this.$refs.dialogReName.open(this.name)

      if (update) {
        this.name = update
        this.postConfigProfile({ name: update })
      }
    },

    exit() {
      return window.location.href = 'http://app.jload.me/exit?service=logout'
    }
  }
}
</script>
