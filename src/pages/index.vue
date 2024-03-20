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
            class="rounded-xl"
          >
            <!-- COMMAND -->
            <v-card-actions class="d-flex align-center">

              <div class="d-sm-flex align-center">

                <div class="text-button font-weight-bold ml-2">
                  {{ t('project.list') }}
                </div>

                <div class="text-button mx-1">
                  <!-- <div :class="[projects.length >= config.limit.projects ? 'red--text text--lighten-2' : '']">
                    {{ projects.length }} / {{ config.limit.projects }}
                  </div> -->
                </div>
                
                <!-- <div v-if="!user.tarif.type" class="pr-1 text-caption font-weight-light">
                  <router-link to="/user#user-tarif" class="red--text text-decoration-none">{{ t('message.project.add.call') }}</router-link>
                </div> -->
              </div>

              <v-spacer></v-spacer>

            </v-card-actions>

            <!-- filter -->
            <v-text-field
              v-model="filter"
              :placeholder="t('common.search')"
              :outlined="Boolean(filter)"
              :max-length="35"
              prepend-inner-icon="mdi-magnify"
              density="comfortable"
              hide-details
              block
              clearable
              variant="solo"
              flat
            ></v-text-field>
          </v-card>
        </v-scale-transition>

        <!-- create -->
        <div
          name="projects_add"
          class="mt-4 mb-1 d-flex justify-center"
        >
          <v-btn
            class="px-2 font-weight-medium elevation-18"
            rounded
            color="primary"
            @click.stop="create()"
          >
            <v-icon left>
              bx-add-to-queue
            </v-icon>
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
import { ref, reactive, computed } from "vue"
import { useAppStore } from '../stores/app.js'
import { useI18n } from "vue-i18n"

/**
 * Lang
 */
const { t } = useI18n()

/**
 * Store
 */
const appStore = useAppStore()

/**
 * Loading
 */
const loading = ref(false)

/**
 * Projects
 */
const filter = reactive([])
const projects = reactive([])

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
  { name: t('project.sort.name'), value: 1 },
  { name: t('project.sort.add_time'), value: 2 },
  { name: t('project.sort.modified'), value: 0 }
]);
const orderData = computed(() => {
  if (order.value > orderList.length) {
    orderList[0]
  }

  return orderList[order.value]
})
</script>
