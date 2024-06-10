<script setup lang="ts">
import {ref, computed, onMounted, watch, reactive, Ref} from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { tt as ttVal , pp as ppVal , nm as nmVal , ln as lnVal , wd as wdVal , hg as hgVal , wg as wgVal , ex as exVal , tp as tpVal , ax as axVal  } from '@/configs/items.js'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { setWght, setSize } from '@/configs/functions/setunits.js'
import { useAppStore } from "../../stores/app"
import { useI18n } from "vue-i18n"
import { useProjectStore } from "../../stores/project"
import { useLoadsStore } from "../../stores/load"
import icons from "@/configs/constants/icons"
import {useRoute, useRouter} from "vue-router";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog.vue";
import {areaArray, unitSizeArray, unitWeightArray} from "../../configs/units";

const { t } = useI18n()
const router = useRouter()
const rout = useRoute()

const appStore = useAppStore()
const projectStore = useProjectStore()
const loadStore = useLoadsStore()

const confirmRef: Ref<ConfirmDialog> = ref(null)

const id = computed(() => rout.params.id ? +rout.params.id : null)

const start = reactive({tt: ttVal, pp: ppVal, nm: nmVal, ln: lnVal, wd: wdVal, hg: hgVal, wg: wgVal, ex: exVal, tp: tpVal, ax: axVal})

const nm = ref('')
const tp = ref(0)
const ax = ref(false)
const axinverse = ref(true)
const ln = ref<number | null>(null)
const wd = ref<number | null>(null)
const hg = ref<number | null>(null)
const wg = ref<number | null>(null)
const ex = ref(1)
const twg = ref<number | null>(null)
const ta = ref(ttVal.a.val)
const tl = ref<number | null>(null)
const tl1 = ref<number | null>(null)
const tn1 = ref<number | null>(null)
const tn2 = ref<number | null>(null)
const tn1max = ref<number | null>(null)
const tn2max = ref<number | null>(null)
const pwg = ref<number | null>(null)
const pa = ref(ppVal.a.val)
const pl2 = ref<number | null>(null)
const pl3 = ref<number | null>(null)
const pn2 = ref<number | null>(null)
const pn2max = ref<number | null>(null)
const un = ref({ size: 2, wght: 1 })

const state = () => {
  nm.value = start.nm.val
  ln.value = start.ln.val
  wd.value = start.wd.val
  hg.value = start.hg.val
  wg.value = start.wg.val
  ex.value = start.ex.val
  ax.value = start.ax.val
  twg.value = start.tt.wg.val
  ta.value = start.tt.a.val
  tl.value = start.tt.l.val
  tl1.value = start.tt.l1.val
  tn1.value = start.tt.n1.val
  tn2.value = start.tt.n2.val
  tn1max.value = start.tt.n1max.val
  tn2max.value = start.tt.n2max.val
  pwg.value = start.pp.wg.val
  pa.value = start.pp.a.val
  pl2.value = start.pp.l2.val
  pl3.value = start.pp.l3.val
  pn2.value = start.pp.n2.val
  pn2max.value = start.pp.n2max.val
  un.value.size = loadStore.unitsLoads.size
  un.value.wght = loadStore.unitsLoads.wght
}

const lnValues = computed(() => ({
  min: {
    0: getSize(start.ln.min, '0'),
    1: getSize(start.ln.min, '1'),
    2: getSize(start.ln.min, '2')
  },
  max: {
    0: getSize(start.ln.max, '0'),
    1: getSize(start.ln.max, '1'),
    2: getSize(start.ln.max, '2')
  }
}))

const wdValues = computed(() => ({
  min: {
    0: getSize(start.wd.min, '0'),
    1: getSize(start.wd.min, '1'),
    2: getSize(start.wd.min, '2')
  },
  max: {
    0: getSize(start.wd.max, '0'),
    1: getSize(start.wd.max, '1'),
    2: getSize(start.wd.max, '2')
  }
}))

const hgValues = computed(() => {
  return {
    min: {
      0: getSize(start.hg.min, '0'),
      1: getSize(start.hg.min, '1'),
      2: getSize(start.hg.min, '2')
    },
    max: {
      0: getSize(start.hg.max, '0'),
      1: getSize(start.hg.max, '1'),
      2: getSize(start.hg.max, '2')
    }
  }
})

const wgValues = computed(() => {
  return {
    min: {
      0: getWght(start.wg.min, '0'),
      1: getWght(start.wg.min, '1')
    },
    max: {
      0: getWght(start.wg.max, '0'),
      1: getWght(start.wg.max, '1')
    }
  }
})

const typeList = computed(() => {
  return start.tp.default.map(item => ({ text: t(item.text), value: item.value }))
})

const paList = computed(() => {
  return start.pp.a.default.map(item => ({ text: item.text, value: item.value }))
})

const taList = computed(() => {
  return start.tt.a.default.map(item => ({ text: item.text, value: item.value }))
})

const pn2Values = computed(() => {
  return {
    min: {
      0: getWght(start.pp.n2.min, '0'),
      1: getWght(start.pp.n2.min, '1')
    },
    max: {
      0: getWght(start.pp.n2.max, '0'),
      1: getWght(start.pp.n2.max, '1')
    }
  }
})

const pn2maxValues = computed(() => {
  return {
    min: {
      0: getWght(start.pp.n2max.min, '0'),
      1: getWght(start.pp.n2max.min, '1')
    },
    max: {
      0: getWght(start.pp.n2max.max, '0'),
      1: getWght(start.pp.n2max.max, '1')
    }
  }
})

const pl3Values = computed(() => {
  return {
    min: {
      0: getSize(start.pp.l3.min, '0'),
      1: getSize(start.pp.l3.min, '1'),
      2: getSize(start.pp.l3.min, '2')
    },
    max: {
      0: getSize(start.pp.l3.max, '0'),
      1: getSize(start.pp.l3.max, '1'),
      2: getSize(start.pp.l3.max, '2')
    }
  }
})

const pl2Values = computed(() => {
  return {
    min:{
      0: getSize(start.pp.l2.min, '0'),
      1: getSize(start.pp.l2.min, '1'),
      2: getSize(start.pp.l2.min, '2')
    },
    max: {
      0: getSize(start.pp.l2.max, '0'),
      1: getSize(start.pp.l2.max, '1'),
      2: getSize(start.pp.l2.max, '2')
    }
  }
})

const pwgValues = computed(() => {
  return {
    min: {
      0: getWght(start.pp.wg.min, '0'),
      1: getWght(start.pp.wg.min, '1')
    },
    max: {
      0: getWght(start.pp.wg.max, '0'),
      1: getWght(start.pp.wg.max, '1')
    }
  }
})

const tn1maxValues = computed(() => {
  return {
    min: {
      0: getWght(start.tt.n1max.min, '0'),
      1: getWght(start.tt.n1max.min, '1')
    },
    max: {
      0: getWght(start.tt.n1max.max, '0'),
      1: getWght(start.tt.n1max.max, '1')
    }
  }
})

const tn1Values = computed(() => {
  return {
    min: {
      0: getWght(start.tt.n1.min, '0'),
      1: getWght(start.tt.n1.min, '1')
    },
    max: {
      0: getWght(start.tt.n1.max, '0'),
      1: getWght(start.tt.n1.max, '1')
    }
  }
})

const tn2maxValues = computed(() => {
  return {
    min: {
      0: getWght(start.tt.n2max.min, '0'),
      1: getWght(start.tt.n2max.min, '1')
    },
    max: {
      0: getWght(start.tt.n2max.max, '0'),
      1: getWght(start.tt.n2max.max, '1')
    }
  }
})

const tn2Values = computed(() => {
  return {
    min: {
      0: getWght(start.tt.n2.min, '0'),
      1: getWght(start.tt.n2.min, '1')
    },
    max: {
      0: getWght(start.tt.n2.max, '0'),
      1: getWght(start.tt.n2.max, '1')
    }
  }
})

const tlValues = computed(() => {
  return {
    min: {
      0: getSize(start.tt.l.min, '0'),
      1: getSize(start.tt.l.min, '1'),
      2: getSize(start.tt.l.min, '2')
    },
    max: {
      0: getSize(start.tt.l.max, '0'),
      1: getSize(start.tt.l.max, '1'),
      2: getSize(start.tt.l.max, '2')
    }
  }
})

const tl1Values = computed(() => {
  return {
    min: {
      0: getSize(start.tt.l1.min, '0'),
      1: getSize(start.tt.l1.min, '1'),
      2: getSize(start.tt.l1.min, '2')
    },
    max: {
      0: getSize(start.tt.l1.max, '0'),
      1: getSize(start.tt.l1.max, '1'),
      2: getSize(start.tt.l1.max, '2')
    }
  }
})

const twgValues = computed(() => {
  return {
    min: {
      0: getWght(start.tt.wg.min, '0'),
      1: getWght(start.tt.wg.min, '1')
    },
    max: {
      0: getWght(start.tt.wg.max, '0'),
      1: getWght(start.tt.wg.max, '1')
    }
  }
})

const validate = useVuelidate()

const rem = async () => {
  const confirm = await confirmRef.value.open(t('common.delete') + '?')

  if (confirm) {
    loadStore.removeLoad(id.value)
    sync()

    router.go(-1)
  }
}

const setData = (data?: any) => {
  if (!data) return

  if (data.un) {
    un.value.size = data.un.size
    un.value.wght = data.un.wght
  }

  nm.value = String(data.nm)
  tp.value = Number(data.tp)

  ln.value = getSize(data.base.ln, un.value.size)
  wd.value = getSize(data.base.wd, un.value.size)
  hg.value = getSize(data.base.hg, un.value.size)
  wg.value = getWght(data.base.wg, un.value.wght)

  ax.value = data?.ax ? true : false

  ex.value = Number(data.ex) ? Number(data.ex) : 1

  const tt = data?.as?.base?.tt

  twg.value = tt?.wg ? getWght(tt.wg, un.value.wght) : getWght(start.tt.wg.val, un.value.wght)
  ta.value = tt?.a ? Number(tt.a) : Number(start.tt.a.val)
  tl.value = tt?.l ? getSize(tt.l, un.value.size) : getSize(start.tt.l.val, un.value.size)
  tl1.value = tt?.l1 ? getSize(tt.l1, un.value.size) : getSize(start.tt.l1.val, un.value.size)

  tn1.value = tt?.n1 ? getWght(tt.n1, un.value.wght) : getWght(start.tt.n1.val, un.value.wght)
  tn2.value = tt?.n2 ? getWght(tt.n2, un.value.wght) : getWght(start.tt.n2.val, un.value.wght)
  tn1max.value = tt?.n1max ? getWght(tt.n1max, un.value.wght) : getWght(start.tt.n1max.val, un.value.wght)
  tn2max.value = tt?.n2max ? getWght(tt.n2max, un.value.wght) : getWght(start.tt.n2max.val, un.value.wght)

  const pp = data?.as?.base?.pp

  pwg.value = pp?.wg ? getWght(pp.wg, un.value.wght) : getWght(start.pp.wg.val, un.value.wght)
  pa.value = pp?.a ? Number(pp.a) : Number(start.pp.a.val)
  pl2.value = pp?.l2 ? getSize(pp.l2, un.value.size) : getSize(start.pp.l2.val, un.value.size)
  pl3.value = pp?.l3 ? getSize(pp.l3, un.value.size) : getSize(start.pp.l3.val, un.value.size)
  pn2.value = pp?.n2 ? getWght(pp.n2, un.value.wght) : getWght(start.pp.n2.val, un.value.wght)
  pn2max.value = pp?.n2max ? getWght(pp.n2max, un.value.wght) : getWght(start.pp.n2max.val, un.value.wght)
}

const getData = () => {
  return {
    id: id.value,
    nm: nm.value,
    tp: tp.value,
    ex: ex.value,
    ax: ax.value ? 1 : 0,
    un: un.value,
    base: {
      ln: setSize(ln.value, un.value.size),
      wd: setSize(wd.value, un.value.size),
      hg: setSize(hg.value, un.value.size),
      wg: setWght(wg.value, un.value.wght)
    },
    adds: {
      ln: 0,
      wd: 0,
      hg: 0,
      wg: 0
    },
    as: {
      base: {
        tt: {
          wg: setWght(twg.value, un.value.wght),
          a: ta.value,
          l: setSize(tl.value, un.value.size),
          l1: setSize(tl1.value, un.value.size),
          n1: setWght(tn1.value, un.value.wght),
          n2: setWght(tn2.value, un.value.wght),
          n1max: setWght(tn1max.value, un.value.wght),
          n2max: setWght(tn2max.value, un.value.wght)
        },
        pp: {
          wg: setWght(pwg.value, un.value.wght),
          a: pa.value,
          l2: setSize(pl2.value, un.value.size),
          l3: setSize(pl3.value, un.value.size),
          n2: setWght(pn2.value, un.value.wght),
          n2max: setWght(pn2max.value, un.value.wght)
        }
      }
    }
  }
}

const sync = () => {
  projectStore.putProject({ alias: 'loads' })
}

const clearForm = () => {
  state()
  appStore.showSuccess(t('item.message.clear'))
}

const isFormError = () => {
  validate.value.$touch()
  return validate.value.$error
}

const submit = () => {
  if (isFormError()) return appStore.showError(t('item.message.form_error'))
  if (!loadStore.checkCountLoads && !id.value) return appStore.showError(t('load.valid.count'))

  const data = getData()

  loadStore.addLoad(data)
  sync()

  return router.go(-1)
}

onMounted(() => {
  state()
  appStore.hideToast()

  if (id.value) {
    setData(loadStore.getLoadsById)
  } else {
    nm.value = t('area.new_nm')
  }
})

watch(axinverse, (a) => {
  ax.value = Boolean(!a)
})

</script>


<template>
  <v-row justify="center" no-gutters>
    <v-col
        col="12"
        lg="8"
    >

      <!-- HEAD  -->

      <v-card class="rounded-lg mb-1">
        <v-card-actions class="d-flex align-center">

          <!-- HEADER -->
          <div class="text-button font-weight-bold ml-1">
            {{ t('item.header') }}
          </div>

          <v-spacer></v-spacer>

          <!-- COMMAND -->
          <div class="ml-2">
            <!-- RESET -->
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs }">
                <v-btn
                    v-bind="attrs"
                    @click="clearForm()"
                >
                  <v-icon>{{ icons.refresh }}</v-icon>
                </v-btn>
              </template>
              <span>{{ t('common.refresh') }}</span>
            </v-tooltip>

            <!-- REMOVE -->
            <template v-if="id">
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs }">
                  <v-btn
                      v-bind="attrs"
                      @click="rem()"
                  >
                    <v-icon>{{ icons.trashCan }}</v-icon>
                  </v-btn>
                </template>
                <span>{{ t('common.delete') }}</span>
              </v-tooltip>
            </template>

            <!-- HELP -->
            <HelpButton name="area"/>
          </div>
        </v-card-actions>
      </v-card>

      <!-- MAIN -->

      <v-card class="rounded-lg mb-1">

        <!-- UNIT -->
        <v-card-text
            class="d-flex align-center py-0"
        >
          <radio-group
              v-model:value="un['size']"
              :items="unitSizeArray"
              cls="mr-3"
              mandatory
              inline
          />

          <v-spacer></v-spacer>

          <radio-group
              v-model="un['wght']"
              :items="unitWeightArray"
              inline
          />
        </v-card-text>

        <!-- FORM -->
        <v-form>

          <v-card-text>

            <!-- BASE -->
            <v-row class="align-center">

              <!-- NAME -->
              <v-col
                  cols="12"
                  md="6"
                  lg="6"
                  dense
              >
                <text-field
                  v-model:value="nm"
                  label="item.nm.label"
                  hint="item.nm.hint"
                  :clearable="true"
                  :config="{
                      max: start.nm.max
                  }"
                />
              </v-col>

              <!-- TYPE -->
              <v-col
                  cols="12"
                  md="6"
                  lg="6"
                  dense
              >
                <select-field
                    v-model:value="tp"
                    :items="typeList"
                    :item-title="'text'"
                    label="area.tp.label"
                />
              </v-col>

              <!-- LENGTH 1-->
              <v-col
                  cols="6"
                  sm="3"
                  md="3"
                  lg="3"
                  dense
              >
                <number-field
                    v-model:value="ln"
                    label="item.ln.label"
                    suffix="units.size"
                    :size="un.size"
                    :step="0.1"
                    :config="{
                            max: lnValues.max[un.size],
                            min: lnValues.min[un.size]
                        }"
                />
              </v-col>

              <!-- WIDTH 1-->
              <v-col
                  cols="6"
                  sm="3"
                  md="3"
                  lg="3"
              >
                <number-field
                    v-model:value="wd"
                    label="item.wd.label"
                    suffix="units.size"
                    :size="un.size"
                    :step="0.1"
                    :config="{
                            max: wdValues.max[un.size],
                            min: wdValues.min[un.size]
                        }"
                />
              </v-col>

              <!-- HEIGHT 1-->
              <v-col
                  cols="6"
                  sm="3"
                  md="3"
                  lg="3"
              >
                <number-field
                    v-model:value="hg"
                    label="item.hg.label"
                    suffix="units.size"
                    :size="un.size"
                    :step="0.1"
                    :config="{
                            max: hgValues.max[un.size],
                            min: hgValues.min[un.size]
                        }"
                />
              </v-col>

              <!-- CAPACITY 1-->
              <v-col
                  cols="6"
                  sm="3"
                  md="3"
                  lg="3"
              >
                <number-field
                    v-model:value="wg"
                    label="item.wg.label"
                    suffix="units.wght"
                    :size="un.wght"
                    :step="0.1"
                    :is-size="false"
                    :config="{
                            max: wgValues.max[un.wght],
                            min: wgValues.min[un.wght]
                        }"
                />
              </v-col>

            </v-row>

          </v-card-text>

        </v-form>

      </v-card>

      <!-- AXIES -->
      <div v-if="tp === 0">

        <v-card
            class="rounded-lg mb-1"
        >
          <v-card-actions class="d-flex align-center">

            <div class="ml-1">

              <div class="text-button font-weight-bold">
                {{ t('area.ax.label') }}
              </div>

              <div v-show="!ax" class="grey--text text--darken-1 text-body-2 pb-1">
                {{ t('area.ax.text') }}
              </div>

              <radio-group
                v-show="ax"
                v-model:value="ex"
                :items="areaArray"
                mandatory
                inline
                class="pb-1 mt-0"
              />
            </div>

            <v-spacer></v-spacer>

            <v-switch
                v-model="axinverse"
                inset
                hide-details
                color="primary"
                :label="t('area.ax.auto')"
                class="mt-0 mx-1"
            ></v-switch>

          </v-card-actions>

        </v-card>

        <!-- PP -->

        <v-card
            v-if="ax && ex === 1"
            class="rounded-lg mb-1"
        >
          <v-card-actions class="ml-1 text-button font-weight-bold">
            {{ t('area.ax.pp.label') }}
          </v-card-actions>

          <v-card-text>

            <v-form>
              <v-row dense>
                <v-col cols="12" md="5">

                  <v-img
                      :src="'../../assets/images/area/1-2-' + pa + '-d150.png'"
                      max-height="auto"
                      max-width="300"
                      width="100%"
                      height="auto"
                      alt="trailer"
                      style="margin:0 auto; vertical-align: middle;"
                  ></v-img>

                </v-col>
                <v-col>

                  <v-row class="align-center">

                    <!-- PP A -->

                    <v-col
                        cols="6"
                        dense
                    >
                      <select-field
                          v-model="pa"
                          :items="paList"
                          label="area.ax.a"
                      />
                    </v-col>

                    <!-- PP WG-->

                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="pwg"
                          label="area.ax.wg"
                          suffix="units.wght"
                          :size="un.wght"
                          :step="0.1"
                          :is-size="false"
                          :config="{
                            max: pwgValues.max[un.wght],
                            min: pwgValues.min[un.wght]
                        }"
                      />
                    </v-col>

                    <!-- PP L2-->

                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="pl2"
                          label="area.ax.pp.l2"
                          suffix="units.size"
                          :size="un.size"
                          :step="1"
                          :config="{
                            max: pl2Values.max[un.size],
                            min: pl2Values.min[un.size]
                        }"
                      >
                          <span class="font-weight-bold">L2</span>
                      </number-field>
                    </v-col>

                    <!-- PP L3-->

                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="pl3"
                          label="area.ax.pp.l3"
                          suffix="units.size"
                          :size="un.size"
                          :step="1"
                          :config="{
                            max: pl3Values.max[un.size],
                            min: pl3Values.min[un.size]
                        }"
                      >
                          <span class="font-weight-bold">L3</span>
                      </number-field>
                    </v-col>

                    <!-- PP A1 MIN -->

                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="pn2"
                          label="area.ax.min"
                          suffix="units.wght"
                          :size="un.wght"
                          :is-size="false"
                          :step="1"
                          :config="{
                            max: pn2Values.max[un.size],
                            min: pn2Values.min[un.size]
                        }"
                      >
                          <span class="font-weight-bold">A2</span>
                      </number-field>
                    </v-col>

                    <!-- PP A1 MAX -->

                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="pn2max"
                          label="area.ax.max"
                          suffix="units.wght"
                          :size="un.wght"
                          :is-size="false"
                          :step="1"
                          :config="{
                            max: pn2maxValues.max[un.size],
                            min: pn2maxValues.min[un.size]
                        }"
                      >
                          <span class="font-weight-bold">A2</span>
                      </number-field>
                    </v-col>

                  </v-row>

                </v-col>
              </v-row>

            </v-form>

          </v-card-text>

        </v-card>

        <!-- TT -->

        <v-card
            v-if="ax"
            class="rounded-lg mb-1"
        >
          <v-card-actions class="ml-1 text-button font-weight-bold">
            {{ t('area.ax.tt.label_' + ex) }}
          </v-card-actions>

          <v-card-text>
            <v-form>
              <v-row dense>
                <v-col cols="12" md="5" class="d-flex align-center">

                  <v-img
                      :src="'../../assets/images/area/' + ex + '-1-' + ta + '-d150.png'"
                      max-height="auto"
                      max-width="300"
                      width="100%"
                      height="auto"
                      alt="truck wagon"
                      style="margin:0 auto; vertical-align: middle;"
                  ></v-img>

                </v-col>
                <v-col>

                  <v-row class="align-center">

                    <v-col
                        cols="6"
                        dense
                    >
                      <select-field
                          v-model:value="ta"
                          :is-need-translate="false"
                          :items="taList"
                          label="area.ax.a"
                      />
                    </v-col>

                    <!-- TT WG-->
                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="twg"
                          label="area.ax.wg"
                          suffix="units.wght"
                          :size="un.wght"
                          :is-size="false"
                          :step="1"
                          :config="{
                            max: twgValues.max[un.size],
                            min: twgValues.min[un.size]
                        }"
                      />
                    </v-col>

                    <!-- TT L-->
                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="tl"
                          label="area.ax.tt.l"
                          suffix="units.size"
                          :size="un.size"
                          :step="1"
                          :config="{
                            max: tlValues.max[un.size],
                            min: tlValues.min[un.size]
                        }"
                      >
                          <span class="font-weight-bold">L</span>
                      </number-field>
                    </v-col>

                    <!-- TT L1-->
                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="tl1"
                          :label="ex === 1 ? 'area.ax.tt.l1' : 'area.ax.pp.l3'"
                          suffix="units.size"
                          :size="un.size"
                          :step="1"
                          :config="{
                            max: tl1Values.max[un.size],
                            min: tl1Values.min[un.size]
                        }"
                      >
                        <span class="font-weight-bold">L1</span>
                      </number-field>
                    </v-col>

                    <!-- TT 1 MIN -->
                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="tn1"
                          label="area.ax.min"
                          suffix="units.wght"
                          :size="un.wght"
                          :step="1"
                          :is-size="false"
                          :config="{
                            max: tn1Values.max[un.size],
                            min: tn1Values.min[un.size]
                        }"
                      >
                        <span class="font-weight-bold">A1</span>
                      </number-field>
                    </v-col>

                    <!-- TT 1 max -->
                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="tn1max"
                          label="area.ax.max"
                          suffix="units.wght"
                          :size="un.wght"
                          :step="1"
                          :is-size="false"
                          :config="{
                            max: tn1maxValues.max[un.size],
                            min: tn1maxValues.min[un.size]
                        }"
                      >
                        <span class="font-weight-bold">A1</span>
                      </number-field>
                    </v-col>

                    <!-- TT 1 MIN -->
                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="tn2"
                          label="area.ax.min"
                          suffix="units.wght"
                          :size="un.wght"
                          :step="1"
                          :is-size="false"
                          :config="{
                            max: tn2Values.max[un.size],
                            min: tn2Values.min[un.size]
                        }"
                      >
                        <span class="font-weight-bold">A2</span>
                      </number-field>
                    </v-col>

                    <!-- TT 1 max -->
                    <v-col
                        cols="6"
                        dense
                    >
                      <number-field
                          v-model:value="tn2max"
                          label="area.ax.max"
                          suffix="units.wght"
                          :size="un.wght"
                          :step="1"
                          :is-size="false"
                          :config="{
                            max: tn2maxValues.max[un.size],
                            min: tn2maxValues.min[un.size]
                        }"
                      >
                        <span class="font-weight-bold">A2</span>
                      </number-field>
                    </v-col>

                  </v-row>

                </v-col>
              </v-row>

            </v-form>
          </v-card-text>

        </v-card>

      </div>

      <!-- BUTTONS -->
      <div class="d-flex alig-center mt-1">

        <v-btn
            rounded
            class="button grey--text text--darken-3"
            @click="router.push('/load')"
        >{{ t('common.cancel') }}</v-btn>

        <v-spacer></v-spacer>

        <v-btn
            elevation="6"
            color="primary"
            rounded
            class="px-2"
            @click="submit()"
        >{{ t('common.save') }}</v-btn>

      </div>

    </v-col>

  </v-row>
  <confirm-dialog
      ref="confirmRef"
  />
</template>

<style scoped>

</style>
