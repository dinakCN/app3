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
            <!-- head -->
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

        <!-- no-projects text -->
        <div v-if="!projectsCount" class="mt-7 mb-1 text-center text-body-2 grey--text text--darken-2">
          <div class="font-weight-bold mb-1">... {{ t('project.no-projects') }} ...</div>
          <div>{{ t('project.no-projects-description-1') }}</div>
          <div>{{ t('project.no-projects-description-2') }}</div>
        </div>

        <!-- sort & order-->
        <div
          name="projects_sort"
          class="d-flex align-center"
        >
          <v-chip-group
            v-model="sort"
            selected-class="text-primary"
            mandatory
            variant="text"
          >
            <template v-for="i in sortList" :key="i.value">
              <v-chip
                :value="i.value"
                size="small"
              >
                {{ i.name }}
              </v-chip>
            </template>
          </v-chip-group>

          <v-spacer></v-spacer>

          <v-chip
            size="small"
            variant="text"
            color="primary"
            :append-icon="orderData.icon"
            @click.stop="changeOrder"
          >
            {{ orderData.name }}
          </v-chip>

        </div>

        <!-- list
          :style="{ 'max-height': projectsCardHeight + 'px' }"
        -->
        <v-card
          v-if="filterList.length || isFilter"
          id="projects-list"
          class="rounded-lg overflow-y-auto"
          :disabled="loading"
        >
          <v-scale-transition group>
            <template>
              <v-list-item
                v-for="item in filterList"
                :id="item.id === project.id && 'project-active'"
                :key="item.id"
                :class="item.id === project.id && 'primary lighten-4'"
                style="height:60px;"
                link
              >
                <v-lazy width="100%">
                  <v-row no-gutters>
                    <v-col cols="auto" class="d-flex align-center mr-2">

                      <v-list-item-avatar
                        class="mx-0"
                        @click.stop="set(item.id)"
                      >
                        <v-icon
                          color="grey darken-4"
                          rounded
                        >
                          {{ item.id === project.id ? 'bx bx-folder-open' : 'bx-folder' }}
                        </v-icon>
                      </v-list-item-avatar>

                    </v-col>
                    <v-col class="flex-grow-1 text-truncate mr-1 d-flex align-center">

                      <template @click.stop="set(item.id)">
                        <v-list-item-title>
                          <div>
                            <span v-if="user.id === 1" class="text-caption text--secondary" >project_ID :{{ item.id }} user_ID {{ item.user_id }}</span>
                            {{ item.name }}
                          </div>
                        </v-list-item-title>

                        <v-list-item-subtitle v-if="!$vuetify.breakpoint.mobile" class="text-lowercase">
                          {{ t('common.add_time') }} {{ item.add_time | formatDate() }}, {{ t('project.last_sync_time') }} {{ item.last_modified | formatDate() }}
                        </v-list-item-subtitle>

                      </template>

                      <template v-if="projects.length === 1 && !project.id" @click.stop="set(item.id)">
                        <v-list-item-title class="text-right">
                          <div class="mx-1 text-body-2 grey--text text--darken-3 text-lowercase">
                            {{ t('project.no-projects-description-3') }}
                          </div>
                        </v-list-item-title>
                      </template>

                    </v-col>
                    <v-col
                      cols="auto"
                      class="flex-shrink-0 d-flex align-center"
                    >
                      <v-list-item-action class="mr-0">
                        <div class="d-flex align-center">
                          <v-btn
                            v-show="item.id !== project.id"
                            text
                            class="font-weight-medium text-lowercase"
                            @click.stop="set(item.id)"
                          >
                            {{ t('common.open') }}
                          </v-btn>
                          <v-btn
                            icon
                            @click.stop="setReName({ name: item.name, id: item.id })"
                          >
                            <v-icon>bx bx-rename</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            @click.stop="copy(item.id)"
                          >
                            <v-icon>bx-copy</v-icon>
                          </v-btn>
                          <v-btn
                            icon
                            @click.stop="remove(item.id)"
                          >
                            <v-icon>bx-trash</v-icon>
                          </v-btn>
                        </div>
                      </v-list-item-action>
                    </v-col>
                  </v-row>
                </v-lazy>
              </v-list-item>
            </template>
          </v-scale-transition>

          <v-card-text v-if="isFilter && !filterList.length" class="py-4 text-center">
            <span class="text-body-2 font-weight-regular">... {{ t('common.noresult') }} ...</span>
          </v-card-text>

        </v-card>

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
import type { Ref } from 'vue'
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
 * Projects
 */
 interface Project {
  id: number,
  add_time: string,
  status: number,
  user_id: number,
  name: string,
  json_data: string,
  last_modified: string
}
const projects: Array<Project> = reactive([])
const projectsCount: Ref<number> = computed(() => {
  return projects.length
})

/**
 * Filter
 */
const filter: Ref<string> = ref('')
const isFilter = computed<Boolean>(() => {
  return Boolean(filter.value)
})
const filterList = computed<Array<Project>>(() => {

  /**
   * Check
   */
  if (!projectsCount) return []

  /**
   * Filter
   */
  const f = projects.reduce((o: Array<Project>, i: Project) => {

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
        const id = (i.id).toString().toLowerCase()
        const userID = (i.user_id).toString().toLowerCase()

        if (id.indexOf(String(filter).toLowerCase()) !== -1) flag = true
        if (userID.indexOf(String(filter).toLowerCase()) !== -1) flag = true

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
  if (f.length) {

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

    // f.sort((a, b) => {

    //   let at: number|string, bt: number|string

    //   if (field !== 'name') {

    //     let at = new Date(a[field]).getTime()
    //     let bt = new Date(b[field]).getTime()

    //   }

    //   if (field === 'name') {

    //     let at = a[field].toUpperCase()
    //     let bt = b[field].toUpperCase()

    //   }

    //   if (at > bt) {
    //     if (order) return 1

    //     return -1
    //   }

    //   if (at < bt) {
    //     if (order) return -1

    //     return 1
    //   }

    //   return 0
    // })
  }

  return f
})

/**
 * Sort
 */
const sort = ref(2)
const sortList = reactive([
  { name: t('project.sort.name'), value: 1 },
  { name: t('project.sort.add_time'), value: 2 },
  { name: t('project.sort.modified'), value: 0 }
]);

/**
 * Order
 */
const order = ref(0);
const orderList = reactive([
  { name: t('project.order.false'), value: 0, icon: 'mdi:mdi mdi-chevron-down' },
  { name: t('project.order.true'), value: 1, icon: 'mdi:mdi mdi-chevron-up' }
]);
const orderData = computed(() => {
  if (order.value > orderList.length) {
    orderList[0]
  }

  return orderList[order.value]
})
const changeOrder = () => {
    if (order.value === 0) return order.value = 1

    return order.value = 0
}
</script>
