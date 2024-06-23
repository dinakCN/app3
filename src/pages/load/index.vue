<template>
  <v-row justify="center" no-gutters>
    <v-col cols="12" lg="8">
      <!-- Alert -->
      <v-alert prominent dense shaped variant="text" type="info" class="text-body-2 mb-2">
        <span class="font-weight-bold">{{ t('load.compare.title') }}</span><br/>
        {{ t('load.compare.description') }}
      </v-alert>

      <!-- Card -->
      <v-card class="rounded-lg mb-2">
        <!-- Card Head -->
        <v-card-actions class="d-flex align-center primary white--text">
          <div class="d-sm-flex align-self-center">
            <div class="text-button font-weight-bold ml-1 ">
              <span>{{ t('load.header') }}</span>
            </div>
            <div class="text-button mx-1 d-flex">
              <div :class="getLoadsCount == config.limit.loads ? 'red--text text--lighten-2' : ''">
                {{ getLoadsCount }} / {{ config.limit.loads }} <span class="text-lowercase font-weight-light"></span>
              </div>
            </div>
          </div>
        </v-card-actions>

        <!-- Null Message -->
        <div v-show="!getLoadsCount" class="mt-2 text-center text-body-2 grey--text text--darken-2">
          <div class="font-weight-bold">{{ t('load.nodata') }}</div>
          <div>{{ t('load.nodata-description') }}</div>
          <div>{{ t('load.select-transport') }}</div>
        </div>

        <!-- List -->
        <v-list>
          <v-fade-transition group>
            <template v-for="item in dataList" :key="item.id">
              <v-list-item :link="!mobile">
                <v-row no-gutters>
                  <!-- Avatar -->
                  <v-col cols="auto" class="d-flex align-center">
                    <v-avatar class="mr-1" @click="router.push(`/load/area/${item.id}`)">
                      <v-icon rounded color="primary">{{ item.icon }}</v-icon>
                    </v-avatar>
                  </v-col>

                  <!-- Content -->
                  <v-col class="d-flex align-center flex-grow-1 flex-shrink-1 text-truncate">
                    <v-list class="mx-1" @click.stop="router.push(`/load/area/${item.id}`)">
                      <v-list-item-title class="body-2 font-weight-medium">{{ item.nm }}</v-list-item-title>
                      <v-list-item-subtitle>
                        <span v-show="!mobile">{{ item.tt }}</span> {{ item.sz }}
                      </v-list-item-subtitle>
                    </v-list>
                  </v-col>

                  <!-- Actions -->
                  <v-col cols="auto" class="d-flex align-center">
                    <v-list-item-action class="mx-0">
                      <div class="d-flex align-center">
                        <v-btn variant="text" class="font-weight-medium text-lowercase" @click.stop="router.push(`/load/area/${item.id}`)">
                          {{ t('common.edit') }}
                        </v-btn>
                        <v-btn @click.stop="router.push(`/load/area/${item.id}`)">
                          <v-icon>{{ icons.editOutline }}</v-icon>
                        </v-btn>
                        <v-btn @click.stop="saveTemp(item.id)">
                          <v-icon>{{ icons.saveOutline }}</v-icon>
                        </v-btn>
                        <v-btn @click.stop="copy(item.id)">
                          <v-icon>{{ icons.copyContent }}</v-icon>
                        </v-btn>
                        <v-btn @click.stop="rem(item.id)">
                          <v-icon>{{ icons.trashCan }}</v-icon>
                        </v-btn>
                      </div>
                    </v-list-item-action>
                  </v-col>
                </v-row>
              </v-list-item>
            </template>
          </v-fade-transition>
        </v-list>
      </v-card>

      <!-- Add Button -->
      <div class="mb-2 text-center" :class="!mobile && 'd-flex justify-center align-center'">
        <v-btn elevation="6" color="primary" rounded class="ma-1 font-weight-medium no-uppercase" @click="add()">
          <v-icon left>{{ icons.plusCircle }}</v-icon>
          {{ t('load.add') }}
        </v-btn>
      </div>

      <!-- Template Card -->
      <v-card class="rounded-lg mb-2">
        <v-card-actions>
          <span class="text-button font-weight-bold ml-1">{{ t('templates.load') }}</span>
        </v-card-actions>

        <!-- Search Field -->
        <search-field
            v-model="search"
            placeholder="common.search"
        />
      </v-card>

      <!-- Type Tabs -->
      <v-card class="rounded-lg mb-2 pb-1">
        <v-tabs
            v-model="tab"
            grow
            class="mb-2"
        >
          <template v-for="t in typeList" :key="t.value">
            <v-tab :value="t.tab">{{ t.text }}</v-tab>
          </template>
        </v-tabs>

        <!-- Template List -->
        <div class="overflow-y-auto" style="height:26vh">
          <div v-if="loading" class="text-center mt-4">
            <v-progress-circular
                color="primary"
                indeterminate
            ></v-progress-circular>
          </div>
          <v-scale-transition v-else group>
            <template v-for="item in listTemplates" :key="item.id">
              <v-list-item link style="height:60px;">
                <v-lazy width="100%">
                  <v-row no-gutters>
                    <!-- Avatar -->
                    <v-col cols="auto" class="d-flex align-center mr-2">
                      <v-avatar class="mx-0" @click.stop="getTemplate(item.data)">
                        <v-icon color="primary" rounded>{{ item.icon }}</v-icon>
                      </v-avatar>
                    </v-col>
                    <!-- Content -->
                    <v-col class="flex-grow-1 text-truncate mr-1 d-flex align-center">
                      <v-list lines="one" @click="getTemplate(item.data)">
                        <v-list-item
                            class="body-2 font-weight-medium"
                            :class="item.gr == 1 ? 'primary--text' : ''"
                            :title="item.nm"
                            :subtitle="item.text"
                        ></v-list-item>
                      </v-list>
                    </v-col>
                    <!-- Actions -->
                    <v-col cols="auto" class="flex-shrink-0 d-flex align-center">
                      <v-list-item-action class="mr-0">
                        <div class="d-flex align-center pl-1">
                          <v-btn v-if="item.clid && !mobile" :disabled="!user.tarif.type" variant="text" color="error" class="font-weight-regular text-lowercase" @click.stop="delTemplate(item.data)">
                            {{ t('common.delete') }}
                          </v-btn>
                          <v-btn v-if="item.clid" :disabled="!user.tarif.type" variant="text" color="error" @click.stop="delTemplate(item.data)">
                            <v-icon>{{ icons.trashCan }}</v-icon>
                          </v-btn>
                          <v-btn v-if="!mobile" variant="text" class="font-weight-regular text-lowercase" color="primary" @click.stop="getTemplate(item.data)">
                            {{ t('common.add') }}
                          </v-btn>
                          <v-btn variant="text" color="primary" @click.stop="getTemplate(item.data)">
                            <v-icon rounded>{{ icons.rightArrowCircle }}</v-icon>
                          </v-btn>
                        </div>
                      </v-list-item-action>
                    </v-col>
                  </v-row>
                </v-lazy>
              </v-list-item>
            </template>
          </v-scale-transition>

          <!-- No Data Text -->
          <v-card-text v-if="!listTemplates.length && !loading" class="pb-4 justify-center d-flex fill-height">
            <div class="text-caption text-uppercase grey--text font-weight-regular align-self-center">{{ t('common.nodata') }}</div>
          </v-card-text>
        </div>
      </v-card>

      <!-- Sort Options -->
      <div v-if="!mobile">
        <div v-if="listTemplates.length || Boolean(search)" class="mb-0 px-0 d-flex align-center">
          <v-chip-group v-model="sort" active-class="primary--text" mandatory>
            <template v-for="(i, x) in sortList" :key="x">
              <v-chip :value="i.value" outlined small>{{ i.name }}</v-chip>
            </template>
          </v-chip-group>
          <v-spacer></v-spacer>
        </div>
      </div>

      <!-- Promo Dialog -->
      <PromoDialog ref="promo" :head="t('message.loads.add.head')" :call="pc" :text="pt" />
    </v-col>
  </v-row>
</template>


<script setup lang="ts">
import {ref, computed, onMounted, Ref} from 'vue'
import { trucks, containers, pallet } from '../../configs/templates/loads.js'
import { getText } from '../../configs/functions/gettext.js'
import { getVolume } from '../../configs/functions/getvolume.js'
import { getLoadsIcon } from '../../configs/functions/geticon.js'
import {useI18n} from "vue-i18n";
import {useProjectStore} from "../../stores/project";
import {useUserStore} from "../../stores/user";
import {useAppStore} from "../../stores/app";
import {useDisplay} from "vuetify";
import icons from "../../configs/constants/icons";
import {useRouter} from "vue-router";
import {useLoadsStore} from "../../stores/load";
import PromoDialog from "../../components/dialogs/PromoDialog.vue"
import useMessages from "../../hooks/useMessages";
import {LoadInterface} from "../../interfaces/ProjectInterface";
import SearchField from "../../components/forms/SearchField.vue";
import useTemplateName from "../../hooks/useTemplateName";

const {t} = useI18n()

const {mobile} = useDisplay()

const router = useRouter()

const projectStore = useProjectStore()
const userStore = useUserStore()
const appStore = useAppStore()
const loadsStore = useLoadsStore()

const loading = computed(() => {
  return Boolean(appStore.loading)
})


const { getMessage } = useMessages()
const { getName } = useTemplateName();

const pt = ref('')
const pc = ref('')
const templates = ref([])
const search = ref('')
const tab = ref(0)
const sort = ref(3)

const promoRef: Ref<PromoDialog> = ref(null)

// Computed Properties
const getLoadsCount = computed(() => loadsStore.getLoadsCount);
const config = computed(() => userStore.config);
const user = computed(() => userStore.user);

const typeList = computed(() => [
  { text : t('templates.tabs.all'), value: -1, tab: 0 },
  { text : t('templates.tabs.truck'), value: 0, tab: 1 },
  { text : t('templates.tabs.contr'), value: 1, tab: 2 },
  { text : t('templates.tabs.pallet'), value: 2, tab: 3 }
])

const sortList = computed(() => [
  { name: t('project.sort.name'), value: 1 },
  { name: t('project.sort.add_time'), value: 2 },
  { name: t('project.sort.volume'), value: 3 }
])

const dataList = computed(() => {
  const arr = Object.values(loadsStore.getLoadsById)
  return arr.length ? arr : []
})

const dataTemplates = computed(() => {
  if (!templates.value.length) return [];

  return templates.value.map(i => {
    const nm = getName(i);
    const icon = getLoadsIcon(i.data.tp);
    let text = t('area.tp.' + i.data.tp);
    let size = getText(
        i.data.base,
        t('units.size.' + loadsStore.unitsLoads.size),
        t('units.wght.' + loadsStore.unitsLoads.wght),
        loadsStore.unitsLoads
    );
    let vol = Number(getVolume(i.data.base));

    if (Number(i.data.tp) === 3 || Number(i.data.tp) === 4) {
      text += ': ' + t('area.ex.' + i.data.tpex).toLowerCase();
      size += ' * ' + getText(
          i.data.adds,
          t('units.size.' + loadsStore.unitsLoads.size),
          t('units.wght.' + loadsStore.unitsLoads.wght),
          loadsStore.unitsLoads
      );
      vol += Number(getVolume(i.data.adds));
    }

    text += ', ' + size + ', ' + vol + ' ' + t('units.m3');

    return {
      ...i,
      nm,
      icon,
      text,
      size,
      vol,
      type: i.data.tp
    };
  });
});

const listTemplates = computed(() => {
  /** search */
  const searchResult = dataTemplates.value.filter(i => {
    if (search.value)  {
      return String(i.nm).toLowerCase().includes(String(search.value).toLowerCase())
    } else {
      return true
    }
  })

  /** type */
  let filteredResult
  if (tab.value === 0)  {
    filteredResult = searchResult
  } else {
    filteredResult = searchResult.filter(i => Number(i.type) === tab.value - 1)
  }

  /** sort */
  let field
  switch (sort.value) {
    case 1:
      field = 'nm'
      break
    case 2:
    default:
      field = 'add_time'
      break
    case 3:
      field = 'vol'
      break
  }

  const sortedResult = filteredResult.sort((a, b) => {
    let at, bt
    if (field === 'add_time') {
      at = new Date(a[field]).getTime()
      bt = new Date(b[field]).getTime()
    }
    if (field === 'nm') {
      at = a[field].toUpperCase()
      bt = b[field].toUpperCase()
    }
    if (field === 'vol') {
      at = Number(a[field])
      bt = Number(b[field])
    }
    if (at > bt) {
      return -1
    }
    if (at < bt) {
      return 1
    }
    return 0
  })

  for (const p of sortedResult) sortedResult[p] = sortedResult[p]
  return sortedResult
})

const sync = () => {
  projectStore.putProject({ alias: 'loads' })
}

const rem = (id: number) => {
  loadsStore.removeLoad(id)
  sync()
}

const copy = (id: number) => {
  if (!loadsStore.checkCountLoads) return limitMessage()
  loadsStore.copyLoad(id)
  sync()
}

const add = () => {
  if (!loadsStore.checkCountLoads) return limitMessage()
  router.push('/load/area')
}

const getTemplate = (i) => {
  const data = submit(i)
  if (!data) return
  if (loadsStore.checkCountLoads) {
    loadsStore.addLoad(data)
    sync()
  } else {
    limitMessage()
  }
}

const saveTemp = async (id) => {
  const data = loadsStore.getLoadsById[id]
  return projectStore.addTemplate({ type: 'l', name: data.nm, data })
      .then(() => {
        appStore.showSuccess(t('templates.add'))
        // $metrika.reachGoal('add.template.load')
        // index()
      }, (message) => {
        if (message) {
          message = JSON.parse(message)
          if (message.type === 'maxTemplate') {
            if (!user.value.tarif.type) {
              appStore.hideToast()
              pc.value = t('message.templates.add.call')
              pt.value = t('message.templates.add.text')
              promo()
            }
          }
          message = getMessage(message)
        } else {
          message = t('scene.valid.error')
        }
        appStore.showError(message)
      })
      .finally(() => {
        load()
      })
}

const load = async () => {
  appStore.setLoading(true)
  const loadedTemplates = []
  for (const i of [...trucks, ...containers, ...pallet]) {
    for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
    loadedTemplates.push(i)
  }
  await projectStore.getTemplateList('l')
      .then((r: any) => {
        if (r.length) r.map((i) => {
          for (const p of Object.keys(i)) i[p] = Object.freeze(i[p])
          return loadedTemplates.push(i)
        })
      })
      .finally(() => {
        appStore.setLoading(false)
      })
  for (let x = 0; x < loadedTemplates.length; x ++) {
    loadedTemplates[x].id = x + 1
  }
  templates.value = [...loadedTemplates]
}

const delTemplate = (clid) => {
  const index = templates.value.findIndex((i) => String(i.clid) === String(clid))
  templates.value.splice(index, 1)
  projectStore.remTemplate({ type: 'l', clid })
  load()
}

const submit = (i: LoadInterface) => {
  const data =  {
    id: null,
    nm: getName(i),
    tp: Number(i.tp),
    un: i.un ? i.un : { size: String(loadsStore.unitsLoads.size), wght: String(loadsStore.unitsLoads.wght) },
    base: {
      ln: Number(i.base.ln),
      wd: Number(i.base.wd),
      hg: Number(i.base.hg),
      wg: Number(i.base.wg)
    },
    adds: {
      ln: i?.adds?.ln ? Number(i.adds.ln) : 0,
      wd: i?.adds?.wd ? Number(i.adds.wd) : 0,
      hg: i?.adds?.hg ? Number(i.adds.hg) : 0,
      wg: i?.adds?.wg ? Number(i.adds.wg) : 0
    },
    ax: i.ax ? true : false,
    ex: i.ex ? Number(i.ex) : 1,
    as: {
      base: {
        tt: {
          wg: i?.as?.base?.tt?.wg ? Number(i.as.base.tt.wg) : 0,
          a:  i?.as?.base?.tt?.a  ? Number(i.as.base.tt.a)  : 0,
          l:  i?.as?.base?.tt?.l  ? Number(i.as.base.tt.l)  : 0,
          l1: i?.as?.base?.tt?.l1 ? Number(i.as.base.tt.l1) : 0,
          n1: i?.as?.base?.tt?.n1 ? Number(i.as.base.tt.n1) : 0,
          n2: i?.as?.base?.tt?.n2 ? Number(i.as.base.tt.n2) : 0,
          n1max: i?.as?.base?.tt?.n1max ? Number(i.as.base.tt.n1max) : 0,
          n2max: i?.as?.base?.tt?.n2max ? Number(i.as.base.tt.n2max) : 0
        },
        pp: {
          wg: i?.as?.base?.pp?.wg ? Number(i.as.base.pp.wg) : 0,
          a:  i?.as?.base?.pp?.a  ? Number(i.as.base.pp.a)  : 0,
          l2: i?.as?.base?.pp?.l2 ? Number(i.as.base.pp.l2) : 0,
          l3: i?.as?.base?.pp?.l3 ? Number(i.as.base.pp.l3) : 0,
          n2: i?.as?.base?.pp?.n2 ? Number(i.as.base.pp.n2) : 0,
          n2max: i?.as?.base?.pp?.n2max ? Number(i.as.base.pp.n2max) : 0
        }
      }
    }
  }
  return data
}

const promo = () => {
  promoRef.value.open()
}

const limitMessage = () => {
  if (!user.value.tarif.type) {
    pc.value = t('message.loads.add.call')
    pt.value = t('message.loads.add.text')
    promo()
  }
  return appStore.showError(t('message.loads.add.text'))
}

onMounted(() => {
  appStore.hideToast()
  load()
})

</script>
