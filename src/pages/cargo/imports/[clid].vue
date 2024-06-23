<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col
        cols="12"
        lg="12"
        xl="10"
      >
        <v-card class="rounded-lg mb-1">
          <!-- COMMAND -->
          <v-card-actions class="d-flex align-start">
            <div class="d-sm-flex align-self-start">
              <div class="text-button font-weight-bold ml-1">
                {{ t('import.header') }}
              </div>
              <div v-if="step" class="text-button mx-1 d-flex">
                <div :class="[subItemsTotal.row >= maxRow ? 'red--text text--lighten-2' : '']">
                  {{ subItemsTotal.row }} / {{ maxRow }} <span class="text-lowercase font-weight-light">{{ t('cargo.row') }}</span>,
                </div>
                <div class="pl-1" :class="[subItemsTotal.cn >= maxItems ? 'red--text text--lighten-2' : '']">
                  {{ subItemsTotal.cn }} / {{ maxItems }} <span class="text-lowercase font-weight-light">{{ t('cargo.items') }}</span>
                </div>
              </div>
            </div>
            <v-spacer></v-spacer>
            <div class="text-center ml-1">
              <!-- HELP -->
              <HelpButton />
            </div>
          </v-card-actions>
        </v-card>
        <v-stepper v-model="step" rounded="lg" :items="['', '']" >
          <template v-slot:item.1>
            <v-stepper-window :value="1" class="pt-1">
              <v-tabs v-model="tabs" centered>
                <v-tab v-for="(n, index) in 2" :key="index">
                  <div class="text-button font-weight-bold ml-1">
                    {{ t('import.subheader-' + n) }}
                  </div>
                </v-tab>
              </v-tabs>

              <v-tabs-window v-model="tabs" style="background-color:transparent">
                <v-tabs-window-item>
                  <!-- FILE -->
                  <v-form class="mt-3 mx-auto" @submit.prevent="submitFile">
                    <div class="d-flex align-center">
                      <div>
                        <v-icon size="large" color="primary">{{ icons.information}}</v-icon>
                      </div>
                      <div class="body-2 black--text text-left ml-2">
                        <div>
                          {{ t('import.file.faq.1') }}
                          <a class="success--text" :href="`${publicPath}files/example.csv`">{{ t('import.file.example') }}.csv</a>
                          {{ t('common.or') }}
                          <a class="red--text" :href="`${publicPath}files/example.xlsx`">{{ t('import.file.example') }}.xlsx</a>
                        </div>
                        <div>
                          {{ t('import.file.faq.2') }}
                        </div>
                      </div>
                    </div>
                    <upload-files
                      :multiply="false"
                      class="mx-auto mt-3"
                      @filesUploaded="processUpload"
                      @filesClean="setDefault"
                    />
                    <div class="d-flex align-center mt-3">
                      <v-btn rounded variant="text" @click="router.go(-1)">
                        {{ t('common.cancel') }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" type="submit" rounded>
                        {{ t('common.add') }}
                      </v-btn>
                    </div>
                  </v-form>
                </v-tabs-window-item>

                <v-tabs-window-item>
                  <!-- TEXT -->
                  <v-form class="mt-3 mx-auto" @submit.prevent="submitText">
                    <div class="d-flex align-center">
                      <div>
                        <v-icon size="large" color="primary">{{ icons.information }}</v-icon>
                      </div>
                      <div class="body-2 black--text text-left ml-2">
                        <div>
                          {{ t('import.text.faq.1') }}: <span class="primary--text">{{ t('import.text.faq.2') }}</span>
                        </div>
                        <div>
                          {{ t('import.text.faq.3') }}
                        </div>
                      </div>
                    </div>
                    <v-textarea
                      v-model="text"
                      class="mt-3"
                      :label="t('import.text.textarea.label')"
                      outlined
                      auto-grow
                      clearable
                      :clear-icon="icons.close"
                      required
                      rows="4"
                    ></v-textarea>
                    <div class="d-flex align-center mt-3">
                      <v-btn rounded variant="text" @click="router.go(-1)">
                        {{ t('common.cancel') }}
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" type="submit" rounded>
                        {{ t('common.add') }}
                      </v-btn>
                    </div>
                  </v-form>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-stepper-window>
          </template>
          <template v-slot:item.2>
            <v-stepper-window :value="2" class="pt-1">
              <import-data
                v-if="step === 2"
                :items="items"
                @submit="submitDataTable"
                @back="backStep"
              />
            </v-stepper-window>
          </template>
          <template v-slot:next></template>
          <template v-slot:prev></template>
        </v-stepper>
      </v-col>

      <!-- PROMO -->
      <PromoDialog
        ref="promoRef"
        :head="t('message.cargo.add.head')"
        :text="promo"
        :call="t('message.cargo.add.call')"
      />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router'
import { useCargoStore } from '@/stores/cargo'
import { useAppStore } from '@/stores/app'
import PromoDialog from '@/components/dialogs/PromoDialog.vue'
import HelpButton from '@/components/brief/HelpButton.vue'
import UploadFiles from '@/components/cargo/UploadFiles.vue'
import ImportData from '@/components/cargo/ImportData.vue'
import Papa from 'papaparse'
import readXlsxFile from 'read-excel-file'
import { getDigits } from '@/configs/functions/getDigits'
import {pg, st, rt, ov, nm, stList, rtList, pgList, ovList} from "../../../configs/items";
import {useUserStore} from "../../../stores/user";
import icons from "../../../configs/constants/icons";
import {useProjectStore} from "../../../stores/project";

const { t } = useI18n()
const router = useRouter()
const rout = useRoute()
const cargoStore = useCargoStore()
const projectStore = useProjectStore()
const appStore = useAppStore()
const userStore = useUserStore()

const promoRef = ref(null)

const start = {
  pg, st, rt, ov, stList, rtList, pgList, ovList, nm
};

const tabs = ref(0)
const step = ref(1)
const file = ref(null)
const text = ref(`${t('common.name')}, 120, 80, 160, 650, 1`)
const items = ref([])
const read = ref(600)
const promo = ref('')
const publicPath = computed(() => import.meta.env.VITE_BASE_URL)

const maxRow = computed(() => Number(userStore.config.limit.irows) - Number(cargoStore.getItemsRowCount))
const maxItems = computed(() => Number(userStore.config.limit.items) - Number(cargoStore.getItemsCount))

const subItemsTotal = computed(() => {
  if (step.value === 1) return { cn: 0, row: 0 }
  if (!items.value.length) return { cn: 0, row: 0 }
  const result = items.value.reduce((o, item) => {
    o.cn = Number(o.cn) + Number(item.cn)
    o.row += 1
    return o
  }, { cn: 0, row: 0 })
  result.cn = getDigits(result.cn)
  result.row = getDigits(result.row)
  return result
})

const setDefault = () => {
  file.value = null
  text.value = ''
  items.value = []
}

const processUpload = (e) => {
  file.value = e
}

const submitFile = () => {
  if (!file.value) return appStore.showError(t('import.file.nofile'))
  if (!goFormat(file.value) || !checkFormat(file.value)) return appStore.showError(t('import.file.bformat'))
  appStore.setLoading(true)
  setTimeout(() => {
    if (getFormat(file.value) === 'xlsx') return parseXLSX()
    if (getFormat(file.value) === 'csv') return parseCSV()
    return appStore.showError(t('import.file.bformat'))
  }, 400)
}

const submitText = () => {
  if (!text.value) return appStore.showError(t('import.text.empty'))
  appStore.setLoading(true)
  setTimeout(() => parseTXT(), 300)
}

const parseXLSX = () => {
  return readXlsxFile(file.value).then((rows) => {
    appStore.setLoading(false)
    if (rows.length) {
      rows = rows.splice(0, read.value)
      rows = rows.filter((i) => !String(i[0]).startsWith('/*', 0))
      rows = rows.filter((i) => i.some(cell => cell))
      rows.shift()
      return pushItems(rows)
    } else {
      return appStore.showError(t('import.file.empty'))
    }
  }, () => {
    appStore.setLoading(false)
    return appStore.showError(t('import.file.empty'))
  })
}

const parseCSV = () => {
  return Papa.parse(file.value, {
    dynamicTyping: true,
    comments: '/*',
    preview: read.value,
    complete: (results) => {
      appStore.setLoading(false)
      if (results.data.length) {
        results.data.shift()
        return pushItems(results.data)
      } else {
        return appStore.showError(t('import.file.empty'))
      }
    },
    error: () => {
      appStore.setLoading(false)
      return appStore.showError(t('import.file.empty'))
    },
    skipEmptyLines: 'greedy'
  })
}

const parseTXT = () => {
  return Papa.parse(text.value, {
    dynamicTyping: true,
    comments: '/*',
    preview: read.value,
    complete: (results) => {
      appStore.setLoading(false)
      if (results.data.length) {
        return pushItems(results.data)
      } else {
        return appStore.showError(t('import.text.notext'))
      }
    },
    error: () => {
      appStore.setLoading(false)
      return appStore.showError(t('import.text.error'))
    },
    skipEmptyLines: 'greedy'
  })
}

const pushItems = (rows) => {
  items.value = []
  for (let x = 0; x < rows.length; x++) {
    if (x === maxRow.value) {
      appStore.showError(t('import.data.rowsLimit', { n: maxRow.value }))
      break
    }
    const nm = String(rows[x][0]).replace(/[^a-zа-яё0-9\s,-]/gi, '')
    const ln = Number(String(rows[x][1]).replace(/[^0-9,.]/g, ''))
    const wd = Number(String(rows[x][2]).replace(/[^0-9,.]/g, ''))
    const hg = Number(String(rows[x][3]).replace(/[^0-9,.]/g, ''))
    const wg = Number(String(rows[x][4]).replace(/[^0-9,.]/g, ''))
    const cn = Number(String(rows[x][5]).replace(/[^0-9,.]/g, ''))
    const pg = String(rows[x][6]).replace(/[^0-9,.]/g, '')
    const st = String(rows[x][7]).replace(/[^0-9,.]/g, '')
    const lm = Number(String(rows[x][8]).replace(/[^0-9,.]/g, ''))
    const rt = String(rows[x][9]).replace(/[^0-9,.]/g, '')
    const ov = String(rows[x][10]).replace(/[^0-9,.]/g, '')

    const i = {
      id: x + 1,
      nm: nm || start.nm.val,
      ln: ln || 0,
      wd: wd || 0,
      hg: hg || 0,
      wg: wg || 0,
      cn: cn || 0,
      pg: pg !== null && pg !== '' && start.pgList.includes(Number(pg)) ? Number(pg) : start.pg.val,
      st: st !== null && st !== '' && start.stList.includes(Number(st)) ? Number(st) : start.st.val,
      lm: lm || 0,
      rt: rt !== null && rt !== '' && start.rtList.includes(Number(rt)) ? Number(rt) : start.rt.val,
      ov: ov !== null && ov !== '' && start.ovList.includes(Number(ov)) ? Number(ov) : start.ov.val
    }
    items.value.push(i)
  }
  step.value = 2
}

const submitDataTable = (data = []) => {
  if (!cargoStore.checkCountCargo(subItemsTotal.value.cn)) return limitMessage(subItemsTotal.value.cn)
  if (!cargoStore.checkCountRow(items.value.length)) return false
  for (const i of data) {
    i.point = rout.params.clid
    cargoStore.addItem(i)
  }
  sync()
  appStore.hideToast()
  router.push('/cargo')
}

const sync = () => {
  projectStore.putProject({ alias: 'cargo' })
}

const backStep = () => {
  step.value = 1
}

const limitMessage = (n) => {
  let limit = Number(appStore.config.limit.items) - Number(cargoStore.getItemsCount)
  if (n < 0) n = 0
  limit = n - limit
  if (limit < 0) limit = 0
  if (!appStore.user.tarif.type) {
    promo.value = `${t('message.cargo.add.text')}, ${limit}, { n: ${limit} })`
    promoRef.value.open()
  }
  return appStore.showError(`${t('message.cargo.add.text')}, ${limit}, { n: ${limit} })`)
}

const checkFormat = (f) => {
  const types = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  return types.includes(String(f?.type))
}

const goFormat = (f) => {
  const types = ['csv', 'xlsx']
  const ext = getFormat(f)
  return types.includes(String(ext))
}

const getFormat = (f) => {
  return String(f?.name).split('.').pop()
}

onMounted(() => {
  if (!rout.params.clid) router.push('/cargo')
})
</script>
