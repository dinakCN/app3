<template>
  <div>
    <!-- UNIT -->
    <div class="d-flex align-center py-0 pl-1">
      <radio-group v-model:value="un.size" :items="unitSizeArray" inline />

      <v-spacer></v-spacer>

      <radio-group v-model:value="un.wght" :items="unitWeightArray" inline />
    </div>

    <!-- DATA -->
    <v-form @submit.prevent="submit">
      <v-simple-table dense fixed-header height="62vh" class="mb-2 mt-1">
        <template v-slot:default>
          <thead>
          <tr>
            <th class="px-0">
              <v-toolbar elevation="6" color="primary lighten-3" rounded>
                <v-row dense align="center" class="text-subtitle-2 font-weight-bold px-0">
                  <v-col v-show="!mobile" cols="1" class="px-1">№</v-col>
                  <v-col cols="2" class="px-2">{{ t('common.name') }}</v-col>
                  <v-col cols="2" lg="1" class="px-2">{{ t('item.ln.label') }}</v-col>
                  <v-col cols="2" lg="1" class="px-2">{{ t('item.wd.label') }}</v-col>
                  <v-col cols="2" lg="1" class="px-2">{{ t('item.hg.label') }}</v-col>
                  <v-col cols="2" lg="1" class="px-2">{{ t('item.wg.label') }}</v-col>
                  <v-col cols="1" class="px-2">{{ t('item.cn.label') }}</v-col>
                  <v-col v-show="!mobile" cols="1" class="px-2">{{ t('item.pg.label') }}</v-col>
                  <v-col v-show="!mobile" cols="1" class="px-2">{{ t('item.st.label') }}</v-col>
                  <v-col v-show="!mobile" cols="1" class="px-2">{{ t('item.lm.label') }}</v-col>
                  <v-col cols="1"></v-col>
                </v-row>
              </v-toolbar>
            </th>
          </tr>
          </thead>
          <transition-group name="scale-transition" hide-on-leave>
            <tbody>
            <tr v-for="(item, index) in items" :key="item.id" style="height:104px">
              <td :id="'vrow-' + item.id" style="height:104px" :class="light === item.id && 'red lighten-5'">
                <v-lazy>
                  <v-row dense align="center">
                    <v-col v-show="!mobile" cols="1">{{ Number(index) + 1 }}</v-col>
                    <v-col cols="2">
                      <text-field
                        v-model:value="item.nm"
                        cls="pt-3"
                        :config="{
                            max: start.nm.max
                        }"
                      />
                    </v-col>
                    <v-col cols="2" lg="1">
                        <number-field
                           v-model:value="item.ln"
                           :step="0.1"
                           cls="pt-3"
                        />
                    </v-col>
                    <v-col cols="2" lg="1">
                        <number-field
                                v-model:value="item.wd"
                                :step="0.1"
                                cls="pt-3"
                        />
                    </v-col>
                    <v-col cols="2" lg="1">
                        <number-field
                                v-model:value="item.hg"
                                :step="0.1"
                                cls="pt-3"
                        />
                    </v-col>
                    <v-col cols="2" lg="1">
                        <number-field
                                v-model:value="item.wg"
                                :step="0.1"
                                cls="pt-3"
                        />
                    </v-col>
                    <v-col cols="1">
                        <number-field
                                v-model:value="item.cn"
                                :step="1"
                                cls="pt-3"
                        />
                    </v-col>
                    <v-col v-show="!mobile" cols="1">
                        <select-field
                                v-model:value="item.pg"
                                cls="pt-3"
                                :items="packingList"
                        />
                    </v-col>
                    <v-col v-show="!mobile" cols="1">
                        <select-field
                                v-model:value="item.st"
                                cls="pt-3"
                                :items="stuckList"
                        />
                    </v-col>
                    <v-col v-show="!mobile" cols="1">
                        <number-field
                                v-model:value="item.lm"
                                :step="1"
                                cls="pt-3"
                        />
                    </v-col>
                    <v-col cols="1" class="text-right">
                      <v-btn @click="deleteRow(item.id)">
                        <v-icon>{{ icons.trashCan }}</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-lazy>
              </td>
            </tr>
            </tbody>
          </transition-group>

          <v-divider></v-divider>
        </template>
      </v-simple-table>

      <!-- BTN -->
      <div class="d-flex align-center">
        <v-btn rounded variant="text" class="button grey--text text-darken-3" @click="$emit('back')">
          {{ t('common.back') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn elevation="6" color="primary" rounded class="px-2" type="submit">
          <span v-show="!isFormError">{{ t('common.add') }}</span>
          <span v-show="isFormError">{{ t('common.check') }}</span>
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import useVuelidate from '@vuelidate/core'
import { getWght, getSize } from '@/configs/functions/getunits.js'
import { useDisplay } from 'vuetify'
import {unitSizeArray, unitWeightArray} from "../../configs/units";
import icons from "../../configs/constants/icons";
import {cn, hg, lm, ln, nm, ov, pg, rt, st, wd, wg} from "../../configs/items";
import {useCargoStore} from "../../stores/cargo";

const { t } = useI18n()
const appStore = useAppStore()
const cargoStore = useCargoStore()
const { mobile } = useDisplay()

const emit = defineEmits(['submit'])

const un = ref({ size: 1, wght: 0 })
const light = ref(null)
const items = ref([])

const start = {
    nm, ln, wd, hg, wg, cn, pg, st, lm, rt, ov
};

const stuckList = computed(() => cargoStore.stuckList)
const packingList = computed(() => cargoStore.packingList)


const $v = useVuelidate()

const isFormError = computed(() => $v.value.$error)

const submit = () => {
  if (!items.value.length) {
    appStore.showError(t('import.data.empty'))
    return
  }

  $v.value.$touch()

  if (isFormError.value) {
    appStore.showError(t('import.data.rowsInvalid'))
    return
  }

  const data = items.value.map((item) => ({
    id: null,
    nm: item.nm,
    ln: getSize(item.ln, un.value.size),
    wd: getSize(item.wd, un.value.size),
    hg: getSize(item.hg, un.value.size),
    wg: getWght(item.wg, un.value.wght),
    cn: item.cn,
    pg: item.pg !== null && packingList.value.includes(item.pg) ? item.pg : start.pg.val,
    st: item.st !== null && stuckList.value.includes(item.st) ? item.st : start.st.val,
    lm: Number(item.lm) > 0 && (Number(item.st) === 1 || Number(item.st) === 3) ? getWght(item.lm, un.value.wght) : 0,
    rt: item.rt !== null && [0, 1].includes(Number(item.rt)) ? Number(item.rt) : Number(start.rt.val),
    ov: item.ov !== null && [0, 1].includes(Number(item.ov)) && Number(item.pg) !== 1 ? Number(item.ov) : Number(start.ov.val),
    cr: null,
    un: un.value,
  }))

  emit('submit', data)
}

const deleteRow = (id) => {
  const index = items.value.findIndex((i) => String(i.id) === String(id))
  items.value.splice(index, 1)
}
</script>
