<template>
  <v-container>
    <v-row
      ref="projects"
      justify="center"
      no-gutters
    >
      <v-col
        cols="12"
        lg="8"
      >
        <!-- header -->
        <v-scale-transition>
          <v-card
            :loading="loading"
            class="rounded-lg"
          >
            <!-- COMMAND -->
            <v-card-actions class="d-flex align-center">

              <div class="d-sm-flex align-center">

                <div class="text-button font-weight-bold ml-2">
                  {{ t('project.list') }}
                </div>

                <div class="text-button mx-1">
                  <div :class="[projectsCount >= limit.projects ? 'red--text text--lighten-2' : '']">
                    {{ projectsCount }} / {{ limit.projects }}
                  </div>
                </div>

              </div>

              <v-spacer></v-spacer>

            </v-card-actions>

            <!-- filter -->
            <v-text-field
              v-model="filter"
              :placeholder="t('common.search')"
              :outlined="isFilter"
              :max-length="35"
              prepend-inner-icon="mdi:mdi mdi-magnify"
              clear-icon="mdi:mdi mdi-close"
              density="comfortable"
              hide-details
              clearable
              variant="solo"
              flat
              single-line
            ></v-text-field>
          </v-card>
        </v-scale-transition>

        <!-- no-projects -->
        <div v-if="!projectsCount" class="mt-7 mb-1 text-center text-body-2 grey--text text--darken-2">
          <div class="font-weight-bold mb-1">... {{ t('project.no-projects') }} ...</div>
          <div>{{ t('project.no-projects-description-1') }}</div>
          <div>{{ t('project.no-projects-description-2') }}</div>
        </div>

        <!-- sort -->
        <div v-if="!mobile">
          <div
            name="projects_sort"
            class="mb-2 px-0 d-flex align-center"
          >
            <v-chip-group
              v-model="sort"
              active-class="primary--text"
              mandatory
            >
              <template v-for="(i, x) in sortList" :key="x">
                <v-chip
                  :value="i.value"
                  outlined
                  small
                >
                  {{ i.name }}
                </v-chip>
              </template>
            </v-chip-group>

            <v-spacer></v-spacer>

            <v-btn
              text
              small
              rounded
              class="font-weight-regular"
              @click.stop="() => true"
            >
              {{ orderData.name }}
              <v-icon right>{{ orderData.icon }}</v-icon>
            </v-btn>

          </div>
        </div>

        <!-- create -->
        <div
          name="projects_add"
          class="mt-4 mb-1 d-flex justify-center"
        >
          <v-btn
            class="elevation-18"
            rounded
            color="primary"
            prepend-icon="mdi:mdi mdi-plus-box-multiple"
            @click.stop="() => true"
          >
            {{ t('project.create') }}
          </v-btn>
        </div>

      </v-col>
    </v-row>
</v-container>
</template>

<route lang="yaml">
  meta:
    layout: default
</route>

<script lang="ts" setup>
import { ref, reactive, computed, watchEffect } from "vue"
import { useAppStore } from '../stores/app'
import { useCargoStore } from '../stores/cargo'
import { useI18n } from "vue-i18n"
import { useDisplay } from 'vuetify'

/**
 * Flag mobile
 */
const { mobile } = useDisplay()

/**
 * Lang
 */
const { t } = useI18n()

/**
 * Store
 */
const appStore = useAppStore()
const user = reactive(appStore.user)

const cargoStore = useCargoStore()
const limit = reactive(cargoStore.config.limit)

/**
 * Loading
 */
const loading = ref(false)

/**
 * Filter
 */
const filter = ref('')
const isFilter = computed(() => {
  return Boolean(filter.value)
})
const filterList = computed(() => {

  /**
   * Check
   */
  if (!projectsCount) return []

  /**
   * Filter
   */
  const filter = projects.array.reduce((o, i: object) => {

    if (filter)  {

      let flag = false

      /**
       * compare with priject name
       *
       */

      if (String(i.name).toLowerCase().indexOf(String(filter).toLowerCase()) !== -1) flag = true

      /**
       * admin only
       *
       */

      if (user.id === 1) {

        /**
         * compare with user ID & Project ID
         *
         */

        if (String(i.id).toLowerCase().indexOf(String(filter).toLowerCase()) !== -1) flag = true
        if (String(i.user_id).toLowerCase().indexOf(String(filter).toLowerCase()) !== -1) flag = true

      }

      if (flag) o.push(i)

    } else {
      o.push(i)
    }

    return o

  }, [])

  /**
   * Resort
   */
  if (filter.length) {

    let field: string

    switch (sort.value) {
    case 1:
      field = 'name'
      break
    case 2:
      field = 'add_time'
      break
    case 0:
    default:
      field = 'last_modified'
      break
    }

    /**
     * sort
     *
     */

    filter.sort((a, b) => {

      let at: number|string, bt: number|string

      if (field !== 'name') {

        at = new Date(a[field]).getTime()
        bt = new Date(b[field]).getTime()

      }

      if (field === 'name') {

        at = a[field].toUpperCase()
        bt = b[field].toUpperCase()

      }

      if (at > bt) {
        if (order) return 1

        return -1
      }

      if (at < bt) {
        if (order) return -1

        return 1
      }

      return 0
    })
  }

  return filter
})

/**
 * Projects
 */
const projects = reactive({
  array: []
})

const projectsCount = computed(() => {
  return projects.array.length
})

/**
 * Sort
 */
const sort = ref(2)
const sortList = ref([
  { name: t('project.sort.name'), value: 1 },
  { name: t('project.sort.add_time'), value: 2 },
  { name: t('project.sort.modified'), value: 0 }
]);

/**
 * Order
 */
const order = ref(0);
const orderList = ref([
  { name: t('project.sort.name'), value: 1 },
  { name: t('project.sort.add_time'), value: 2 },
  { name: t('project.sort.modified'), value: 0 }
]);
const orderData = computed(() => {
  if (order.value > orderList.value.length) {
    orderList[0]
  }

  return orderList[order.value]
})
</script>
