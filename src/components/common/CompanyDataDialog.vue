<template>
  <v-dialog
    v-model="dialog"
    max-width="550"
  >
    <v-card
      class="rounded-lg"
      :loading="loading"
    >

      <!-- HEADER -->

      <v-card-actions class="pb-0 px-1">
        <span class="text-button font-weight-bold mx-1">
          {{ $t('payment.userdata.label') }}
        </span>

        <v-spacer></v-spacer>

        <v-btn
          icon
          color="red"
          @click="close()"
        >
          <v-icon>bx bx-x</v-icon>
        </v-btn>   

      </v-card-actions>

      <!-- FORM -->
      <v-form 
        ref="form"
        v-model="valid"
        lazy-validation
        :disabled="loading"
      > 
        
        <!-- RESIDENT OF COMPANY -->

        <v-radio-group
          v-if="typePayment"
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
              v-if="c.redn && typePayment"
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
                    {{ $t('common.finder') }}
                  </v-btn>
                </v-col>
              </v-row>
              
            </v-col>

          </v-scale-transition>

          <v-col cols="12">
            <v-text-field
              v-if="typePayment"
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
              v-if="typePayment"
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

          <v-scale-transition>
            <v-col
              v-if="c.redn && typePayment"
              cols="12"
            >
              <v-text-field
                v-model="c['ogrn']"
                :label="$t('payment.userdata.ogrn.label')"
                :rules="[rules.required]"
                dense
                required
                clearable
                type="text"
                @keypress="NumbersOnly"
              ></v-text-field>
            </v-col>
          </v-scale-transition>

          <v-scale-transition>
            <v-col
              v-if="!c.redn && typePayment"
              cols="12"
            >
              <v-textarea
                v-model="c['longtext']"
                :label="$t('payment.userdata.longtext.label')"
                dense
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

        <!-- BTN -->

        <v-card-actions class="pb-2 px-2">

          <v-spacer></v-spacer>

          <v-btn
            color="primary lighten-1"
            large
            rounded
            class="px-2"
            :disabled="!valid"
            @click="submit"
          >
            {{ $t('payment.userdata.btn') }}
          </v-btn>

        </v-card-actions>

      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SearchCompanyDialog',
  props: {
    typePayment: {
      type: Number,
      default: 1
    }
  },  
  data() {
    return {
      dialog: false,

      resolve: null,
      reject: null,

      loading: false,
      valid: false,

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
        show: false
      },

      rules: {
        required: (value) => !!value || this.$t('common.validation.required'),
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

          return pattern.test(value) || this.$t('common.validation.email')
        }
      }

    }
  },  
  mounted() {

    this.loading = true

    return this.getConfig()
      .then((r) => {

        const { company, user } = r
        const { email } = user
        const { redn, name, regn, ogrn, address, manager, longtext } = company

        // email

        if (this.rules.required(email) && this.rules.email(email)) {

          /** валидный email скрыт по умолчанию */
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
        if (redn) this.c.redn = redn

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

        this.loading = false
      }) 
  },
  methods: {
    ...mapActions('app', ['showError', 'hideToast']),
    ...mapActions('cargo', ['postConfigProfile', 'getConfig']),

    submit() {
      if (!this.$refs.form.validate()) return this.showError(this.$t('item.message.form_error') )

      this.dialog = false
      this.hideToast()

      return this.resolve({ submit: true, data: { c: this.c, e: this.e.value } }) 
    },

    open() {
      this.dialog = true

      if (!this.typePayment) this.e.show = true

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },

    close() {
      this.dialog = false
      this.hideToast()
      this.resolve({ submit: false, data : {} })      
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

      const options = {
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

      this.loading = true

      return fetch(url, options)
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
        .finally(() => this.loading = false)
    }

  }
}
</script>