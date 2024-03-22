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
        <div
          v-if="!projectsCount"
          class="mt-7 mb-1 text-center text-body-2 grey--text text--darken-2"
        >
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
            <template
              v-for="i in sortList"
              :key="i.value"
            >
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

        <!-- list -->
        <v-card rounded="lg">
          <v-list
            variant="flat"
            lines="one"
            nav
          >
            <v-scale-transition group>
              <v-list-item
                v-for="item in filterList"
                :key="item.id"
                link
                :class="item.id === project.id && 'primary lighten-4'"
                @click.stop="set(item.id)"
              >

                <template v-slot:prepend>
                  <v-avatar
                    :icon="item.id === project.id ? 'mdi:mdi mdi-folder-open' : 'mdi:mdi mdi-folder'"
                    color="grey darken-3"
                    variant="plain"
                    size="large"
                  >
                  </v-avatar>
                </template>

                <template v-slot:title>
                  <span class="text-truncate">
                    {{ item.name }}
                  </span>
                </template>

                <template v-slot:subtitle>
                  <span class="text-truncate text-lowercase">
                    {{ t('common.add_time') }} {{ item.add_time }},
                    {{ t('project.last_sync_time')
                    }} {{ item.last_modified }}
                  </span>
                </template>

                <template v-slot:append>
                  <div class="d-flex align-center">

                    <!-- rename -->
                    <v-btn
                      icon="mdi:mdi mdi-form-textbox"
                      variant="text"
                      size="small"
                      @click.stop="setReName({ name: item.name, id: item.id })"
                    >
                    </v-btn>

                    <!-- copy -->
                    <v-btn
                      icon="mdi:mdi mdi-content-copy"
                      variant="text"
                      size="small"
                      @click.stop="copy(item.id)"
                    >
                    </v-btn>

                    <!-- remove -->
                    <v-btn
                      icon="mdi:mdi mdi-trash-can-outline"
                      variant="text"
                      size="small"
                      @click.stop="remove(item.id)"
                    >
                    </v-btn>
                  </div>
                </template>

              </v-list-item>
            </v-scale-transition>

            <v-card-text
              v-if="isFilter && !filterList.length"
              class="py-4 text-center"
            >
              <span class="text-body-2 font-weight-regular">... {{ t('common.noresult') }} ...</span>
            </v-card-text>

          </v-list>
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

<script
  lang="ts"
  setup
>
import { ref, reactive, computed, watchEffect } from "vue"
import type { Ref } from 'vue'
import { useAppStore } from '../stores/app'
import { useCargoStore } from '../stores/cargo'
import { useI18n } from "vue-i18n"
import { useDisplay } from 'vuetify'
import { ProjectInterface } from '../interfaces/ProjectInterface'
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
const version = ref(appStore.version)

const cargoStore = useCargoStore()
const limit = reactive(cargoStore.config.limit)
const project = reactive(cargoStore.project)

/**
 * Loading
 */
const loading = ref(false)

/**
 * Projects
 */
const projects: Array<ProjectInterface> = reactive([
  {
    id: 1,
    add_time: '1',
    status: 1,
    user_id: 1,
    name: 'name',
    json_data: 'json',
    last_modified: 'date'
  }
])
const projectsCount: Ref<number> = computed(() => {
  return projects.length
})

const getList = (scrollToActive = false, clearStorage = true, active = project?.id) => {

  /**
   * clear storage
   *
   */

  if (clearStorage) removeProjectsStorage()

  /**
   * get storage
   *
   */

  const getStorageProjects = localStorage.getItem('projectsList_' + user.id)
  const r = getStorageProjects ? JSON.parse(getStorageProjects) : []

  if (r.length) {

    for (const p of r) r[p] = Object.freeze(r[p])

    projects = r

    /**
     * scroll to active project
     *
     */

    if (scrollToActive) $nextTick(() => scrollIntoView(active))

  } else {

    /**
     * get axios
     *
     */

    loading = true
    getProjectsList()
      .then((r) => {

        for (const p of r) r[p] = Object.freeze(r[p])

        projects = r

        /**
         * scroll to active project
         *
         */

        if (scrollToActive) $nextTick(() => scrollIntoView(active))

        /**
         * set storage list
         *
         */

        if (localStorage && projects.length) localStorage.setItem('projectsList_' + user.id, JSON.stringify(projects))

      })
      .finally(() => loading = false)

  }
}

const set = (id) => {
  if (String(project.id) === String(id)) return $router.push('/cargo')

  loading = true

  return getProject(id)
    .then(() => {
      loading = false

      $router.push('/cargo')
    })
}

const add = (n) => {
  loading = true

  addProject(n)
    .then((r) => {

      getList(true, true, r.id)
      $metrika.reachGoal('add.project')

    }, (message) => {
      addError(message)
    })
    .finally(() => {
      loading = false
    })
}

const create = async () => {
  const n = await $refs.dialogReName.open('')

  if (!n) return false

  return add(n)
}

const copy = (id) => {
  loading = true

  copyProject(id)
    .then((r) => {

      getList(true, true, r.id)
      $metrika.reachGoal('add.project')

    }, (message) => {

      addError(message)
    })
    .finally(() => loading = false)
}

const addError = (message) => {
  if (message) {
    message = JSON.parse(message)

    if (!user.tarif.type && message.type === 'maxProjects') $refs.promo.open()

    message = getMessage(message)

  } else {
    message = $t('scene.valid.error')
  }

  showError(message)
}

const remove = async (id) => {
  const confirm = await $confirm($t('common.delete') + '?')

  if (confirm) {
    loading = true

    /**
     * Мгновенное удаление из массива
     *
     */

    const index = projects.findIndex((i) => String(i.id) === String(id))

    if (index !== -1) {
      projects.splice(index, 1)
    }

    /**
     * Удаление с базы данных и обновление
     *
     */

    delProject(id)
      .then(() => {

        getList(false, true)
        loading = false

      })
  }
}

const setReName = async (obj) => {
  const { id, name } = obj
  const update = await $refs.dialogReName.open(name)

  if (update) {
    projects.forEach((i) => {
      if (String(i.id) === String(id)) i.name = update
    })

    if (String(project.id) === String(id)) changeProjectName(update)

    loading = true
    putProject({ id, name: update })
      .then(() => removeProjectsStorage())
      .finally(() => loading = false)
  }
}

const scrollIntoView = (id) => {

  if (!id) return false

  const list = document.getElementById('projects-list')

  if (list) {

    const find = filterList.findIndex((i) => String(i.id) === String(id))

    if (find !== -1) {

      const offset = (find * 60) - Math.round(projectsCardHeight / 2)

      if (offset > 0) return list.scrollTo(0, offset)

      return list.scrollTo(0, 0)
    }
  }

  return false
}

const removeProjectsStorage = () => {

  if (localStorage) localStorage.removeItem('projectsList_' + user.id)
}

/**
 * Filter
 */
const filter: Ref<string> = ref('')
const isFilter = computed<boolean>(() => {
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
  const f = projects.reduce((o: Array<ProjectInterface>, i: ProjectInterface) => {

    if (filter.value) {

      let flag = false

      /**
       * compare with priject name
       *
       */

      if (String(i.name).toLowerCase().indexOf(String(filter.value).toLowerCase()) !== -1) flag = true

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
   * Check
   */
  if (!f.length) return []

  /**
   * Sort
   */
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
  }

  f.sort((a, b) => {

    if (field !== 'name') {

      let at: number = new Date(a[field]).getTime()
      let bt: number = new Date(b[field]).getTime()

      if (at > bt) return -1
      if (at < bt) return 1
    }

    if (field === 'name') {

      let at: string = a[field].toUpperCase()
      let bt: string = b[field].toUpperCase()

      if (at > bt) return -1
      if (at < bt) return 1
    }

    return 0
  })

  /**
   * Order
   */
  if (order) f.reverse()

  console.log(f)

  return f
})

/**
 * Sort
 */
const sort: Ref<number> = ref(2)
const sortList = reactive([
  { name: t('project.sort.name'), value: 1 },
  { name: t('project.sort.add_time'), value: 2 },
  { name: t('project.sort.modified'), value: 0 }
]);

/**
 * Order
 */
const order: Ref<number> = ref(0);
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

/**
 * Metrika
 */
const metrika = () => {
  // YaMetrika user data

  $metrika.userParams({
    vip_status: user.tarif.type !== 0 ? true : false,
    UserID: user.id,
    version: version
  })
}
</script>
