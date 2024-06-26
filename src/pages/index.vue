<template>
  <v-container>
    <v-row
      justify="center"
      no-gutters
    >
      <v-col
        cols="12"
        lg="10"
        xl="8"
      >
        <!-- header -->
        <v-scale-transition>
          <v-card
            v-if="projectsCount"
            class="rounded-lg"
            :disabled="loading"
          >
            <!-- head -->
            <v-card-actions class="d-flex align-center pt-1">

              <div class="d-sm-flex align-center">

                <div class="text-button font-weight-bold ml-1">
                  {{ t('project.list') }}
                </div>

                <div class="text-button mx-1">
                  <div :class="[projectsCount >= limit.projects ? 'red--text text--lighten-2' : '']">
                    {{ projectsCount }} / {{ limit.projects }}
                  </div>
                </div>

              </div>

              <v-spacer></v-spacer>

              <HelpButton />

            </v-card-actions>

            <!-- filter -->
            <v-text-field
              v-model="filter"
              :placeholder="t('common.search')"
              :max-length="35"
              clear-icon="mdi:mdi mdi-close"
              density="default"
              hide-details
              clearable
              :variant="!isFilter ? 'solo' : 'solo'"
              flat
              single-line
            >
              <template #prepend-inner>
                <v-icon color="black">mdi:mdi mdi-magnify</v-icon>
              </template>
            </v-text-field>
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
          class="d-flex align-center my-2"
        >
          <v-chip-group
            v-model="sort"
            selected-class="text-primary"
            mandatory
            variant="tonal"
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
            v-if="!mobile"
            size="small"
            variant="tonal"
            color="primary"
            :append-icon="orderData.icon"
            @click.stop="changeOrder"
          >
            {{ orderData.name }}
          </v-chip>

        </div>

        <!-- list -->
        <v-card
          v-if="filterList.length || isFilter"
          rounded="lg"
          id="projects-list"
          ref="projectsList"
          :max-height="vh"
          class="overflow-y-auto"
          style="min-height: 60px;"
        >
          <v-list
            variant="text"
            lines="one"
            class="py-0"
          >
            <v-scale-transition group>
              <template
                v-for="item in filterList"
                :key="item.id"
              >
                <v-lazy>
                  <v-list-item
                    link
                    height="60px"
                    :id="item.id"
                    :active="item.id === project_id"
                    color="primary"
                    @click.stop="set(item.id)"
                  >
                    <template v-slot:prepend>
                      <v-avatar
                        :icon="item.id === project_id ? 'mdi:mdi mdi-folder-open' : 'mdi:mdi mdi-folder-outline'"
                        variant="text"
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
                          icon
                          variant="text"
                          size="small"
                          @click.stop="setReName({ name: item.name, id: item.id })"
                        >
                          <v-icon size="20">mdi:mdi mdi-form-textbox</v-icon>
                        </v-btn>

                        <!-- copy -->
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          @click.stop="copy(item.id)"
                        >
                          <v-icon size="20">mdi:mdi mdi-content-copy</v-icon>
                        </v-btn>

                        <!-- remove -->
                        <v-btn
                          icon
                          variant="text"
                          size="small"
                          @click.stop="remove(item.id)"
                        >
                          <v-icon size="20">mdi:mdi mdi-trash-can-outline</v-icon>
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-lazy>
              </template>
            </v-scale-transition>

            <v-card-text
              v-if="isFilter && !filterList.length"
              class="py-4 text-center"
            >
              <span class="text-caption font-weight-regular">... {{ t('common.noresult') }} ...</span>
            </v-card-text>

          </v-list>
        </v-card>

        <!-- create -->
        <div
          name="projects_add"
          class="mt-4 d-flex justify-center"
        >
          <v-btn
            rounded
            size="default"
            color="primary"
            prepend-icon="mdi:mdi mdi-plus-box-multiple"
            @click.stop="create()"
          >
            {{ t('project.create') }}
          </v-btn>
        </div>

      </v-col>
    </v-row>

    <ReNameDialog
      ref="dialogName"
      icon="bx bxs-check-circle"
      color="primary"
    />
  </v-container>
</template>

<route lang="yaml">
  name: 'main'
  meta:
    layout: default
    requiresAuth: true
</route>

<script
  lang="ts"
  setup
>
import { ref, reactive, computed, toRefs, toRef, onMounted, nextTick } from "vue"
import type { Ref } from 'vue'
import { useUserStore } from '../stores/user'
import { useProjectStore } from '../stores/project'
import { useProjectsStore } from '../stores/projects'
import { useAppStore } from '../stores/app'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from "vue-i18n"
import { useDisplay } from 'vuetify'
import { ProjectInterface } from '../interfaces/ProjectInterface'
import HelpButton from "../components/brief/HelpButton.vue"

/**
 * Mobile, Height
 */
const { mobile, height } = useDisplay()
const vh = computed(() => mobile.value ? height.value - 405 : height.value - 410)

/**
 * Router
 */
const router = useRouter()

/**
 * Lang
 */
const { t } = useI18n()

/**
 * App store
 */
const storeApp = useAppStore()
const loading = computed(() => {
  return Boolean(storeApp.loading)
})

/**
 * User Store
 */
const appUser = useUserStore()
const user = toRefs(appUser.user)
const limit = toRef(appUser.config.limit)

/**
 * Project store
 */
const appProject = useProjectStore()
const project_id = computed(() => appProject.project.id)

/**
 * Projects store
 */
const appProjects = useProjectsStore()
const projects = computed(() => appProjects.store.projects)
const projectsList = ref<HTMLElement | null>(null)

const projectsCount: Ref<number> = computed(() => {
  return projects.value.length
})

onMounted(() => {

  /**
   * Закрыть все уведомления
   */
  storeApp.hideToast()

  /**
   * Проверка на загрузку проектов
   */
  if (!projectsCount.value) {

    /**
     * Загрузить проекты
     */
    appProjects.getProjectsList()
      .then(() => {

        /**
         * Промотка окна до активного проекта
         */
        if (project_id.value) {
          nextTick()
          setTimeout(() => scrollIntoView(project_id.value, false), 300)
        }
      })
  }
})

// const copy = (id) => {
//   loading = true

//   copyProject(id)
//     .then((r) => {

//       getList(true, true, r.id)
//       $metrika.reachGoal('add.project')

//     }, (message) => {

//       addError(message)
//     })
//     .finally(() => loading = false)
// }

// const addError = (message) => {
//   if (message) {
//     message = JSON.parse(message)

//     if (!user.tarif.type && message.type === 'maxProjects') $refs.promo.open()

//     message = getMessage(message)

//   } else {
//     message = $t('scene.valid.error')
//   }

//   showError(message)
// }

// const remove = async (id) => {
//   const confirm = await $confirm($t('common.delete') + '?')

//   if (confirm) {
//     loading = true

//     /**
//      * Мгновенное удаление из массива
//      *
//      */

//     const index = projects.findIndex((i) => String(i.id) === String(id))

//     if (index !== -1) {
//       projects.splice(index, 1)
//     }

//     /**
//      * Удаление с базы данных и обновление
//      *
//      */

//     delProject(id)
//       .then(() => {

//         getList(false, true)
//         loading = false

//       })
//   }
// }

/**
 * Filter
 */
const filter: Ref<string> = ref('')
const isFilter = computed<boolean>(() => {
  return Boolean(filter.value)
})
const filterList = computed(() => {

  /**
   * Check
   */
  if (!projectsCount.value) return []

  /**
   * Filter
   */
  const f = projects.value.reduce((o, i) => {

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
      if (user.id.value === 1) {

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

  }, [] as Array<ProjectInterface>)

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
  if (order.value) f.reverse()

  // console.log(f)

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
 * Dialogs
 */
const dialogName = ref<any>(null)

const setReName = async (obj: { name: string, id: number }) => {

  const { id, name } = obj
  const update = await dialogName.value.open(name)

  console.log(update)

  if (update) {

    projects.value.forEach((i: ProjectInterface) => {
      if (i.id === id) i.name = update
    })

    if (project_id.value === id) appProject.changeProjectName(update)

    appProject.putProject({ id, name: update })
      .then(() => appProjects.getProjectsList())
  }
}

const create = async () => {

  const n = await dialogName.value.open(t('project.val'))

  if (!n) return false

  return add(n)
}


const scrollIntoView = (id: number, smooth: boolean = false) => {

  const list = document.getElementById('projects-list')

  if (!list) return

  const find = filterList.value.findIndex((i) => String(i.id) === String(id))

  if (find === -1) return

  const offset = (find * 60) - Math.round(vh.value / 2)

  if (offset > 0)

    if (smooth) {

      return list.scrollTo({
        top: offset,
        left: 0,
        behavior: "smooth",
      })

    } else {
      return list.scrollTo(0, offset)
    }

  return list.scrollTo(0, 0)
}

const add = async (n: string) => {
  return appProject.addProject(n)
    .then((r) => {

      /**
       * Загрузить проекты
       */
      appProjects.getProjectsList()
        .then(() => {

          /**
           * Плавная промотка до нового проекта
           */
          nextTick()
          setTimeout(() => {
            scrollIntoView(r.id, true)
          }, 100)
        })

      /**
       * Metrics
       */
      // $metrika.reachGoal('add.project')

    })
    .catch((message) => addError(message))
}

const set = (id: number) => {
  /**
   * Проверка
   */
  // if (String(project_id) === String(id)) return router.push('/cargo')

  return appProject.getProject(id)
  // .then(() =>  router.push('/cargo'))
}

// const add = (n) => {
//   loading = true

//   addProject(n)
//     .then((r) => {

//       getList(true, true, r.id)
//       $metrika.reachGoal('add.project')

//     }, (message) => {
//       addError(message)
//     })
//     .finally(() => {
//       loading = false
//     })
// }



/**
 * Metrika
 */
// const metrika = () => {
//   // YaMetrika user data

//   $metrika.userParams({
//     vip_status: user.tarif.type !== 0 ? true : false,
//     UserID: user.id,
//     version: version
//   })
// }
</script>
