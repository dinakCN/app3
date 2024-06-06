<template>
  <v-card class="rounded-lg mb-3">
    <v-card-actions>
      <span class="text-button font-weight-bold ml-1">
        {{ t('templates.header') }}
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
        {{ t('$vuetify.close') }}
      </v-btn>
    </v-card-actions>

    <v-data-iterator
      :items="filterData"
      v-model:page="page"
      :search="search"
      v-model:items-per-page="itemsPerPage"
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
            :label="t('common.filter')"
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
            :label="t('common.search')"
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
          <span class="text-body-2 grey--text font-weight-regular">... {{ t('common.nodata') }} ...</span>
        </v-card-text>
      </template>

      <template v-slot:no-results>
        <v-card-text class="mt-4 text-center">
          <span class="text-body-2 grey--text font-weight-regular">... {{ t('common.noresult') }} ...</span>
        </v-card-text>
      </template>

    </v-data-iterator>

    <!-- PROMO -->
    <PromoDialog
      ref="promo"
      :head="t('message.templates.set.head')"
      :text="t('message.templates.set.text')"
      :call="t('message.templates.set.call')"
    />

  </v-card>
</template>

<script setup lang="ts">
import {computed, onMounted, Ref, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {useUserStore} from "../../stores/user";
import {useAppStore} from "../../stores/app";
import PromoDialog from "../dialogs/PromoDialog.vue";

const {t} = useI18n()
  const props = withDefaults(defineProps<{data: string[]}>(), {
    data: () => []
  })
  const templates  = ref([])
  const filter  = ref([
    { text : t('templates.filter.all'), value: -1 },
    { text : t('templates.filter.default'), value: 0 },
    { text : t('templates.filter.mine'), value: 1 }
        // { text : this.t('templates.filter.shared'), value: 2 }
    ])
  const value  = ref(-1)
  const page  = ref(1)
  const search  = ref('')
  const itemsPerPage  = ref(10)

  const userStore = useUserStore()
  const appStore = useAppStore()

const promo: Ref<typeof PromoDialog> = ref(null)

const emit = defineEmits(['close', 'del', 'submit'])

const user = computed(() => userStore.user)

  const filterData = (() => {
        if (value.value === -1) return props.data

        return props.data.filter((i) => {
          return String(i.gr) === String(value.value)
        })
  })

    const close = () => {
      emit('close')
    }

    const del = (clid) => {

      if (!clid) return false

      if (!checkPermission()) return showPromo()

      return emit('del', clid)
    }

    const submit = (data, clid) => {
      if (!checkPermission() && clid) return showPromo()

      return emit('submit', data)
    }

    const checkPermission = () => {
      if (Number(user.value.tarif.type) === 1) return true
      return Number(user.value.tarif.type) === 2;


    }

    const showPromo = () => {
      promo.value.open()
    }
    onMounted(() => {
      appStore.hideToast()
    })
</script>
// lang ok
