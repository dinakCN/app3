<template>
  <v-card class="rounded-lg mb-3">
    <v-card-actions>
      <span class="text-button font-weight-bold ml-1">
        {{ $t('templates.header') }}
      </span>
      <v-spacer></v-spacer>
      <v-btn 
        rounded
        small
        text
        color="red"
        class="text-caption text-uppercase px-1"
        @click="close()"
      >
        {{ $t('$vuetify.close') }}
      </v-btn>   
    </v-card-actions>

    <v-data-iterator
      :items="filterData"  
      :page.sync="page"
      :search="search"
      :items-per-page.sync="itemsPerPage"
      disable-sort
      group-by="gr"
      group-desc
    >
      <template v-slot:header>
        <v-toolbar
          dark
          color="blue darken-3"
          class="mb-1"
        > 
          <v-select
            v-model="value"
            flat
            solo-inverted
            hide-details
            :items="filter"
            prepend-inner-icon="mdi-magnify"
            :label="$t('common.filter')"
            class="mr-1"
            style="max-width:25em"
          ></v-select>
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            :label="$t('common.search')"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-list>
          <v-scale-transition group>
            <v-list-item
              v-for="item in props.items"
              :key="item.add_time"
              link
            >
              <v-list-item-avatar>
                <v-icon
                  rounded
                  color="primary"
                >
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content
                :class="[item.gr == 1 ? 'primary--text' : '']"
                @click="submit(item.data, item.clid)"
              >
                <v-list-item-title class="body-2 font-weight-medium">
                  {{ item.nm }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.text }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <div class="d-flex align-center pl-2">
                  <v-btn 
                    v-if="item.clid"
                    :disabled="!user.tarif.type"
                    icon                
                    @click.stop="del(item.clid)"
                  >
                    <v-icon>bx-trash</v-icon>
                  </v-btn>
                  <v-btn 
                    icon
                    @click.stop="submit(item.data, item.clid)"
                  >
                    <v-icon>bx bx-right-arrow-circle</v-icon>
                  </v-btn>                 
                </div>
              </v-list-item-action>
            </v-list-item>
          </v-scale-transition>
        </v-list>          
      </template>

      <template v-slot:no-data>
        <v-card-text class="mt-4 text-center">
          <span class="text-body-2 grey--text font-weight-regular">... {{ $t('common.nodata') }} ...</span>
        </v-card-text>
      </template>

      <template v-slot:no-results>
        <v-card-text class="mt-4 text-center">
          <span class="text-body-2 grey--text font-weight-regular">... {{ $t('common.noresult') }} ...</span>
        </v-card-text>
      </template>

    </v-data-iterator>

    <!-- PROMO -->
    <PromoDialog
      ref="promo"
      :head="$t('message.templates.set.head')"
      :text="$t('message.templates.set.text')"
      :call="$t('message.templates.set.call')"
    />

  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Templates',
  components: {
    PromoDialog: () => import(/* webpackPrefetch: true */'@/components/common/PromoDialog')
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      templates: [],
      filter: [
        { text : this.$t('templates.filter.all'), value: -1 },
        { text : this.$t('templates.filter.default'), value: 0 },
        { text : this.$t('templates.filter.mine'), value: 1 }
        // { text : this.$t('templates.filter.shared'), value: 2 }
      ],
      value: -1,
      page: 1,
      search: '',
      itemsPerPage: 10
    }
  },
  computed: {
    ...mapState('app', ['user']),

    filterData() {
      if (this.value === -1) return this.data

      return this.data.filter((i) => {
        return String(i.gr) === String(this.value)
      })
    }
  },
  mounted() {
    this.hideToast()
  },
  methods: {    
    ...mapActions('app', ['showError', 'hideToast']),

    close() {
      this.$emit('close')
    },

    del(clid) {

      if (!clid) return false

      if (!this.chechPermission()) return this.showPromo()

      return this.$emit('del', clid)
    },

    submit(data, clid) {
      if (!this.chechPermission() && clid) return this.showPromo()

      return this.$emit('submit', data)
    },

    chechPermission() {
      if (Number(this.user.tarif.type) === 1) return true
      if (Number(this.user.tarif.type) === 2) return true

      return false
    },

    showPromo() {
      this.$refs.promo.open()
    }

  }
}
</script>
// lang ok