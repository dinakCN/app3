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
                  <div :class="[projectsLength >= limit.projects ? 'red--text text--lighten-2' : '']">
                    {{ projectsLength }} / {{ limit.projects }}
                  </div>
                </div>

              </div>

              <v-spacer></v-spacer>

            </v-card-actions>

            <!-- filter -->
            <v-text-field
              v-model="filter"
              :placeholder="t('common.search')"
              :outlined="Boolean(filter.value)"
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
            @click.stop="create()"
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
import { useAppStore } from '../stores/app.ts'
import { useCargoStore } from '../stores/cargo.ts'
import { useI18n } from "vue-i18n"

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
const filter = ref([])
const projects = ref([])
const projectsLength = computed(() => {
  if (!projects.value.length) return 0

  return projects.value.length
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
