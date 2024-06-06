<template>
  <v-dialog
    v-model="dialog"
    max-width="550"
  >
    <v-card
      class="rounded-lg"
    >

      <v-card-actions class="pb-0">
        <span class="text-button font-weight-bold">
          {{ $t('common.search') }} компании
        </span>     
      </v-card-actions>

      <!-- FORM -->
      <v-form 
        ref="form"
        v-model="valid"
        lazy-validation
        class="mx-2"
      >    

        <v-autocomplete
          v-model="name"
          :rules="[rules.required]"
          :hint="$t('autocomplete.hint')"
          :items="entries"
          v-model:search-input="search"
          :loading="loading"
          persistent-hint
          hide-no-data
          hide-selected
          return-object
          clearable   
        ></v-autocomplete>
      
      </v-form>
      <v-card-actions class="pt-0">

        <v-spacer></v-spacer>

        <v-btn
          color="secondary lighten-2"
          text
          @click="close"
        >
          {{ $t('common.cancel') }}
        </v-btn>

        <v-btn
          color="primary lighten-1"
          @click="submit"
        >
          {{ $t('common.ok') }}
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SearchCompanyDialog',
  data() {
    return {
      dialog: false,
      name: null,
      search: null,
      entries: [],
      resolve: null,
      reject: null,
      loading: false,
      valid: false,

      rules: {
        required: (value) => !!value || this.$t('scene.valid.required')
      }

    }
  },  
  watch: {
    search(a) {
      if (a) this.getData()
    }
  },
  methods: {
    ...mapActions('app', ['showError', 'hideToast']),

    submit() {
      if (!this.$refs.form.validate()) return this.showError(this.$t('item.message.form_error') )

      this.dialog = false

      return this.name?.value ? this.resolve(this.name.value) : this.resolve({})
    },

    open() {
      this.dialog = true

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },

    close() {
      this.resolve(false)
      this.dialog = false
    },

    getData() {
      if (!this.search) return

      const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party'
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
          query: this.search,
          count: 10
        })
      }

      this.loading = true

      fetch(url, options)
        .then((response) => response.json())
        .then((result) => {
          
          if (!result?.suggestions?.length) return

          this.entries = result.suggestions.map((i) => {
    
            const o =  { 
              text: `${i.value}, ${i.data.address.value}`,
              value: {
                name: i.value,
                regn: i.data.inn,
                data: i.data.address.value                
              }
            }

            if (i.data.kpp) o.value.data = `${o.value.data}, ${this.$t('payment.userdata.kpp.label')} ${i.data.kpp}`
            if (i.data.ogrn) o.value.data = `${o.value.data}, ${this.$t('payment.userdata.ogrn.label')} ${i.data.ogrn}`

            return o
          })

        })
        .finally(() => this.loading = false)
    }
  }
}
</script>