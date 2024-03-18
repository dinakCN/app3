<template>
  <div>

    <!-- TYPE -->

    <v-row
      dense
      class="mx-1"
    >
      <v-col cols="12" sm="6">
        <v-card
          class="rounded-lg"
          :class="type == 'expir' ? 'primary lighten-4 elevation-14' : ''"
          style="height: 100%"
          :disabled="loading"
          @click="type = 'expir'"
        >

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-button font-weight-bold pt-1">
                {{ $tc('payment.types.expir.head') }}
                <v-icon small>bx bx-pin</v-icon>
              </v-list-item-title>
              <v-list-item-content class="text-body-2 grey--text text-darken-2 pb-0">
                {{ $t('payment.types.expir.desc') }}
              </v-list-item-content>
            </v-list-item-content>
          </v-list-item>

        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card
          rounded="lg"
          :color="type == 'count' ? 'success lighten-3 elevation-14' : ''"
          style="height: 100%"
          :disabled="loading"
          @click="type = 'count'"
        >

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-button font-weight-bold pt-1">
                {{ $tc('payment.types.count.head') }}
                <v-icon small>bx bx-pin</v-icon>
              </v-list-item-title>
              <v-list-item-content class="text-body-2 grey--text text-darken-2 pb-0">
                {{ $t('payment.types.count.desc') }}
              </v-list-item-content>
            </v-list-item-content>
          </v-list-item>

        </v-card>
      </v-col>
    </v-row>

    <!-- BODY -->

    <v-card
      :disabled="loading"
      class="mx-2 mt-2 rounded-lg"
    >

      <div class="d-flex align-top my-1 py-1">

        <!-- periods -->
        <div class="text-button font-weight-bold mx-2">
          Описание тарифа
        </div>

        <v-spacer></v-spacer>

        <!-- discount -->
        <v-chip
          :color="user.discount ? 'red lighten-1' : 'secondary lighten-4'"
          outlined
          class="px-2 mx-1 mt-0 font-weight-bold text-button"
        >
          <v-icon small class="pr-1">mdi-gift-outline</v-icon>
          <span class="px-1">Cкидка</span>
          <span>{{ user.discount }}%</span>
          <div v-if="user.discount">
            <span class="px-1">=</span>
            <span>{{ format.format(discountInt) }}</span>
          </div>

        </v-chip>

      </div>

      <!-- users -->

      <div
        v-if="usersList.length"
        class="mx-2"
      >
        <v-radio-group
          v-model="users"
          :disabled="type !== 'expir' && selectedProducts?.type !== 'month'"
          row
        >
          <v-radio
            v-for="u in usersList"
            :key="u.id"
            :label="u.text"
            :value="u.id"
          ></v-radio>
        </v-radio-group>
      </div>

      <v-toolbar height="auto" flat>
        <v-chip-group
          v-model="tarif"
          :color="chipsClass"
          column
          mandatory
        >
          <template v-for="i in products">
            <v-chip
              :key="i?.id"
              :value="i?.id"
              filter
              outlined
            >
              <span class="font-weight-regular">
                {{ i.period }} {{ $tc('payment.period.' + i.type, i.period, { n: i.period }) }}
              </span>
              <span class="pl-1">
                <div>
                  <v-icon small>
                    bx bx-user
                  </v-icon>
                  {{ usersSelected?.text ? usersSelected.text : 1 }}
                </div>
              </span>
              <span class="pl-1"> / {{ format.format(i.price) }}</span>
            </v-chip>
          </template>
        </v-chip-group>
      </v-toolbar>

      <!-- amount -->

      <div class="d-flex mx-2 pb-2 font-weight-light">
        <v-spacer></v-spacer>
        <div>
          <div class="text-right">итого к оплате</div>
          <div class="text-h4 py-1 font-weight-light">
            {{ format.format(toPayDiscount) }}
          </div>
        </div>
      </div>

    </v-card>

    <!-- BUTTONS -->

    <div class="pt-2 mx-2 text-right">
      <v-btn
        color="primary"
        rounded
        large
        class="px-3 font-weight-regular"
        :disabled="!tarif || loading"
        @click="dataDialog = true"
      >
        Выписать счет
      </v-btn>
    </div>

    <!-- DIALOG -->

    <v-dialog
      v-model="dialog"
      max-width="590"
      persistent
    >
      <v-card rounded="lg" class="pa-2">

        <v-row dense>

          <v-col v-if="!$vuetify.breakpoint.mobile" cols="auto" class="align-center">

            <!--logo -->

            <v-img
              :src="require('@/assets/images/jets/start.svg')"
              max-width="128"
              min-height="128"
              alt="You are lucky!"
              class="mt-2 mx-2"
              style="margin:0 auto"
            ></v-img>

          </v-col>
          <v-col class="">

            <h4 class="text-uppercase justify-center text-center">
              Спасибо за заказ
            </h4>

            <div class="grey--text text-body-1 text-darken-3 font-weight-regular text-center self-justify-center">
              <div class="my-1 text-center">{{ $tc('payment.valid.company.submit') }} <b>{{ e.value }}</b></div>
            </div>

          </v-col>

        </v-row>

      </v-card>

      <div class="d-flex align-bottom mt-2">
        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          rounded
          class="font-weight-medium px-2"
          @click="dialog = false"
        >
          {{ this.$t('common.ok') }}
        </v-btn>

      </div>

    </v-dialog>

    <!-- USER DATA -->

    <v-dialog
      v-model="dataDialog"
      max-width="590"
      persistent
    >
      <v-card rounded="lg" class="px-1">

        <div class="d-flex align-center">

          <!-- PAY DATA HEADER -->
          <div class="text-button font-weight-bold my-1 mx-1">
            {{ $t('payment.userdata.label') }}
          </div>

          <v-spacer></v-spacer>

          <v-btn
            icon
            color="red"
            @click="dataDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>

        </div>

        <!-- FORM -->
        <v-form
          ref="form"
          v-model="valid"
          :disabled="loading"
          class="pb-1"
        >

          <!-- RESIDENT OF COMPANY -->

          <v-radio-group
            v-model="c['redn']"
            row
            dense
            class="mx-2"
          >
            <v-radio
              :value="true"
            >
              <template v-slot:label>
                <div>{{ $t('payment.userdata.resident.in') }}</div>
              </template>
            </v-radio>

            <v-radio
              :value="false"
            >
              <template v-slot:label>
                <div>{{ $t('payment.userdata.resident.out') }}</div>
              </template>
            </v-radio>
          </v-radio-group>

          <v-row
            dense
            class="mt-1 mx-2"
          >

            <v-scale-transition>

              <v-col
                v-if="c.redn"
                cols="12"
              >

                <v-row dense>

                  <v-col>
                    <v-text-field
                      v-model="c['regn']"
                      :label="$t('payment.userdata.inn.label')"
                      :rules="[rules.required]"
                      dense
                      required
                      clearable
                      type="text"
                      @keypress="NumbersOnly"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                      outlined
                      color="primary"
                      block
                      rounded
                      :disabled="loading || !c.regn"
                      @click="getDataByRegn()"
                    >
                      Заполнить поля по ИНН
                    </v-btn>
                  </v-col>
                </v-row>

              </v-col>

            </v-scale-transition>

            <v-col cols="12">
              <v-text-field
                v-model="c['name']"
                :label="$t('payment.userdata.name.label')"
                :rules="[rules.required]"
                dense
                required
                clearable
                type="text"
              >
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="c['address']"
                :label="$t('payment.userdata.address.label')"
                :rules="[rules.required]"
                dense
                required
                clearable
                type="text"
              >
              </v-text-field>
            </v-col>

            <v-col
              v-if="c.redn"
              cols="12 d-none"
            >
              <v-text-field
                v-model="c['ogrn']"
                :label="$t('payment.userdata.ogrn.label')"
                dense
                type="text"
                @keypress="NumbersOnly"
              ></v-text-field>
            </v-col>

            <v-scale-transition>
              <v-col
                v-if="!c.redn"
                cols="12"
              >
                <v-textarea
                  v-model="c['longtext']"
                  :label="$t('payment.userdata.longtext.label')"
                  dense
                  auto-grow
                  clearable
                ></v-textarea>
              </v-col>
            </v-scale-transition>

            <!-- EMAIL -->

            <v-col
              v-if="e['show']"
              cols="12"
            >
              <v-text-field
                v-model="e['value']"
                label="Email"
                :rules="[rules.required, rules.email]"
                dense
                required
                clearable
                type="email"
              ></v-text-field>
            </v-col>

          </v-row>

        </v-form>

        <div class="d-flex justify-center py-2 px-2">

          <v-btn
            block
            color="primary"
            rounded
            large
            class="font-weight-medium px-2"
            :disabled="loading"
            @click="validate()"
          >
            <!-- {{ typeUserPayment ? $tc('payment.button.company', 0, { n: toPay }) : $tc('payment.button.default', 0, { n: toPay }) }} -->
            Выписать счет
          </v-btn>

        </div>

      </v-card>

    </v-dialog>

  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'

  // https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

export default {
  name: 'UserPayments',
  data() {
    return {
      // loading: true,
      type: 'expir',

      tarif: null,
      users: null,

      valid: false,

      typeUserPayment: 1,

      tarifList: {
        count: [],
        expir: [],
        optns: []
      },

      c: {
        // residence boolean, true == residence, false == unresidence
        redn: true,
        name: null,
        regn: null,
        ogrn: null,
        address: null,
        manager: null,
        longtext: null
      },

      e: {
        value: null,
        show: true
      },

      rules: {
        required: (value) => !!value || this.$t('common.validation.required'),
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

          return pattern.test(value) || this.$t('common.validation.email')
        }
      },

      format: formatter,

      dialog: false,
      dataDialog: false
    }
  },
  computed: {
    ...mapState('app', ['user', 'loading']),

    chipsClass() {
      return this.type === 'count' ? 'success accent-4' : ' primary accent-4'
    },

    products() {

      const p = this.tarifList[this.type]

      if (!p.length) return []

      return p.map((i) => {

        const o = {
          id: i.id,
          type: i.type,
          price: i.price,
          period: i.period
        }

        if (this.users !== 1 && this.usersSelected?.price) {
          o.price = Math.round(o.price + (this.usersSelected.price * o.period))
        }

        return o

      })
    },

    selectedProducts() {
      if (this.loading && !this.tarif) return { id: 0, pay: null, type: null }

      if (this.tarif) return this.tarifList[this.type].filter((i) => String(i?.id) === String(this.tarif))[0]

      return { id: 0, pay: null, type: null }
    },

    toPay() {
      if (!this.selectedProducts?.price) return null

      let { price } = this.selectedProducts

      if (this.usersSelected) price += this.selectedProducts.period * this.usersSelected.price

      return Number(price)
    },

    discountInt() {
      if (!this.toPay || !this.user.discount) return 0

      return Math.round(this.toPay * ((this.user.discount) / 100))
    },

    toPayDiscount() {
      if (!this.toPay) return 0

      return Number(this.toPay - this.discountInt)
    },

    usersList() {
      if (!this.tarifList?.optns?.length) return []

      return this.tarifList.optns
    },

    usersSelected() {
      if (!this.usersList.length || !this.users) return null

      return this.usersList.filter((i) => String(i?.id) === String(this.users))[0]
    }
  },
  watch: {
    type() {

      /** значения по умолчанию */

      this.users = 1

      this.tarif = this.tarifList[this.type][0].id
    },

    typeUserPayment(type) {

      if (!type) this.valid = true

    }
  },
  mounted() {

    this.getPaymentsList()
      .then((r) => {

        const { expir, count } = r

        r.expir = expir.sort((e1, e2) => e1['price'] > e2['price'] ? 1 : -1)
        r.count = count.sort((e1, e2) => e1['price'] > e2['price'] ? 1 : -1)

        // упаковка ответа

        const types = ['count', 'expir']

        types.forEach((type) => {

          if (r[type].length) {

            r[type].forEach((i) => {
              this.tarifList[type].push({
                id: i.id,
                type: i.type,
                price: i.price,
                period: i.period,
                text: ''
              })
            })

          }
        })

        // пользователи

        if (r['users'].length) {

          /** sort */

          r['users'] = r['users'].sort((a, b) => a.price > b.price ? 1 : -1)

          r['users'].forEach((i) => {
            this.tarifList['optns'].push({
              id: Number(i.id),
              type: i.type,
              price: Number(i.price),
              period: Number(i.period),
              text: i.period + ' ' + this.$tc('payment.period.' + i.type, i.period, { n: i.period })
            })

          })

        }

        /** добавить 1 пользователя */

        this.tarifList['optns'].unshift({
          id: 1,
          type: 'users',
          price: 0,
          period: 1,
          text: 1 + ' ' + this.$tc('payment.period.' + 'users', 1, { n: 1 })
        })

        this.users = 1

        this.setLoading(false)
      })

    this.setLoading(true)

    this.getConfig()
      .then((r) => {

        const { company, user } = r
        const { email } = user
        const { redn, name, regn, ogrn, address, manager, longtext } = company

        // email

        if (this.rules.required(email) && this.rules.email(email)) {

          /** валидный email */
          this.e.value = email

        } else {

          /** не валидный email показан */
          this.e.show = true
        }

        /**
         * company data
         *
         */

        // resident

        if (redn === null) {
          this.c.redn = true
        } else {
          this.c.redn = redn ? true : false
        }

        // name company
        if (name) this.c.name = name

        // inn
        if (regn) this.c.regn = regn

        // ogrn
        if (ogrn) this.c.ogrn = ogrn

        // address
        if (address)  this.c.address = address

        // general manager
        if (manager)  this.c.manager = manager

        // long text for unresident
        if (longtext) this.c.longtext = longtext

        this.setLoading(false)
      })
  },
  methods: {
    ...mapMutations('app', ['setLoading']),
    ...mapActions('app', ['showSuccess', 'showError', 'hideToast']),
    ...mapActions('cargo', ['getPaymentsList', 'postPayments', 'postConfigProfile', 'getConfig']),

    validate() {

      if (!this.$refs.form.validate()) return this.showError(this.$t('item.message.form_error') )

      const data = {
        types: this.typeUserPayment ? 'company' : 'default',
        prods: this.tarif,
        optns: [],
        email: this.e.value,
        company: null
      }

      /** добавить пользователей если выбраны любые кроме по умолчанию */

      if (this.users && this.users !== 1) data.optns.push(this.users)

      // console.log(data)

      /** скорпировать данные компании */

      if (this.typeUserPayment === 1)  data.company = Object.assign({}, this.c)

      /** событие метрики */

      this.$metrika.reachGoal('get.payment', { order_price: this.toPayDiscount, currency: 'RUB' })

      this.dataDialog = false

      return this.postPayments(data)
        .then((r) => {

          if (this.typeUserPayment) {

            if (!r?.data?.msorder) return

            return this.dialog = true
          }

          if (!this.typeUserPayment && r.data.redirect) return window.location.replace(r.data.redirect)

          this.showError(this.$tc('payment.valid.default.error'))

        })
    },

    NumbersOnly(evt) {
      evt = (evt) ? evt : window.event

      const charCode = (evt.which) ? evt.which : evt.keyCode

      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {

        return evt.preventDefault()
      }

      return true
    },

    getDataByRegn() {

      if (!this.c.regn) return this.showError(this.$t('payment.userdata.data.error.inn') )

      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party'
      const token = '669c0e8dacfa788e342c0a9ba47cb849248e7f93'

      const users = {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Token ' + token
        },
        body: JSON.stringify({
          query: this.c.regn,
          count: 2
        })
      }

      return fetch(url, users)
        .then((response) => response.json())
        .then((result) => {

          // console.log(result)

          this.hideToast()

          if (!result?.suggestions?.length) return this.showError(this.$t('$vuetify.dataIterator.noResultsText') )

          const [i] = result.suggestions
          const { value, data } = i
          const { inn, ogrn, address, management } = data
          const { value: addr } = address
          const { name: dirr } = management

          return this.c = {
            redn: true,
            name: value,
            regn: inn,
            ogrn: ogrn,
            address: addr,
            manager: dirr,
            longtext: null
          }

        })
    }

  }
}
</script>
