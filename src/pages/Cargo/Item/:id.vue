<template>
  <v-row justify="center" no-gutters>
    <v-col
      col="12"
      lg="8"
    >
      <v-card
        class="rounded-lg mb-1"
      >
        <v-card-actions class="d-flex align-center">
          <!-- HEADER -->
          <div class="text-button font-weight-bold ml-1">
            {{ t('item.header') }}
          </div>

          <v-spacer></v-spacer>

          <!-- COMMAND -->
          <div class="ml-2 text-right">
            <!-- COLOR -->
            <v-menu
                v-model:opened="colorMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
            >
              <template #activator="{ props }">
                <v-btn v-bind="props">
                  <v-icon :color="color">
                    mdi mdi-circle
                  </v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-color-picker
                    v-model="color"
                    dot-size="25"
                    mode="hexa"
                ></v-color-picker>
              </v-card>
            </v-menu>

            <!-- RESET -->
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-btn v-bind="props" @click="clearForm">
                  <v-icon>mdi mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>{{ t('common.refresh') }}</span>
            </v-tooltip>

            <!-- REMOVE -->
            <template v-if="!newItem">
              <v-tooltip location="bottom">
                <template #activator="{ props }">
                  <v-btn v-bind="props" @click="rem">
                    <v-icon>mdi mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{ t('common.delete') }}</span>
              </v-tooltip>
            </template>

            <!-- HELP -->
            <HelpButton />
          </div>
        </v-card-actions>
      </v-card>

      <v-card class="rounded-lg">
        <v-card-text
          class="d-flex align-center py-0"
        >
          <v-radio-group
            v-model="un['size']"
            class="mr-3"
            mandatory
            inline
            hint="test"
          >
            <v-radio
              :label="t('units.mm')"
              value="0"
            ></v-radio>
            <v-radio
              :label="t('units.sm')"
              value="1"
            ></v-radio>
            <v-radio
              :label="t('units.m')"
              value="2"
            ></v-radio>
          </v-radio-group>

          <v-spacer></v-spacer>

          <v-radio-group
            v-model="un['wght']"
            inline
          >
            <v-radio
              :label="t('units.kg')"
              value="0"
            ></v-radio>
            <v-radio
              :label="t('units.tn')"
              value="1"
            ></v-radio>
          </v-radio-group>
        </v-card-text>

        <!-- FORM -->
        <v-form class="pt-2">
          <v-card-text>
            <v-row class="align-center">
              <v-col
                cols="12"
                sm="6"
                md="6"
                lg="9"
              >
                <v-text-field
                    v-model="nmVal"
                    :label="t('item.nm.label')"
                    :hint="t('item.nm.hint')"
                    :error-messages="errorMessages.nm"
                    :counter="start.nm.max"
                    :maxlength="start.nm.max"
                    required
                    dense
                    clearable
                    @click:clear="clearField"
                    @input="touchFiels('nm')"
                    @blur="touchFiels('nm')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="6"
                lg="3"
              >
                <v-text-field
                  v-model="cnVal"
                  :label="t('item.cn.label')"
                  class="centered-input"
                  dense
                  prepend-icon="bx-minus-circle"
                  append-outer-icon="bx-plus-circle"
                  :error-messages="errorMessages.cn"
                  required
                  type="number"
                  step="1"
                  @input="touchFiels('cn')"
                  @blur="touchFiels('cn')"
                  @click:append-outer="increment"
                  @click:prepend="decrement"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-text-field
                  v-model="lnVal"
                  :label="t('item.ln.label')"
                  prefix="$"
                  :suffix="t('units.size.' + un.size)"
                  dense
                  counter
                  step="0.1"
                  :counter-value="() => subFieldText(ln, start.ln.max)"
                  :error-messages="errorMessages.ln"
                  required
                  type="number"
                  @input="touchFiels('ln')"
                  @blur="touchFiels('ln')"
                ></v-text-field>
              </v-col>

              <v-col
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-text-field
                  v-model="wdVal"
                  :label="t('item.wd.label')"
                  :suffix="t('units.size.' + un.size)"
                  dense
                  counter
                  step="0.1"
                  :counter-value="() => subFieldText(wd, start.wd.max)"
                  :error-messages="errorMessages.wd"
                  required
                  type="number"
                  @input="touchFiels('wd')"
                  @blur="touchFiels('wd')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-text-field
                  v-model="hgVal"
                  :label="t('item.hg.label')"
                  :suffix="t('units.size.' + un.size)"
                  dense
                  counter
                  step="0.1"
                  :counter-value="() => subFieldText (hg, start.hg.max)"
                  :error-messages="errorMessages.hg"
                  required
                  type="number"
                  @input="touchFiels('hg')"
                  @blur="touchFiels('hg')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-text-field
                  v-model="wgVal"
                  :label="t('item.wg.label')"
                  :suffix="t('units.wght.' + un.wght)"
                  dense
                  :item-title="'text'"
                  step="0.1"
                  :error-messages="errorMessages.wg"
                  required
                  type="number"
                  @input="touchFiels('wg')"
                  @blur="touchFiels('wg')"
                ></v-text-field>
              </v-col>
              <v-col
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-select
                  v-model="pgVal"
                  dense
                  :item-title="'text'"
                  :items="packingList"
                  :label="t('item.pg.label')"
                  :error-messages="errorMessages.pg"
                  required
                >
                  <template v-slot:prepend>
                    <v-icon small>{{ pgIcon }}</v-icon>
                  </template>
                </v-select>
              </v-col>
              <v-col
                class="d-flex"
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-select
                  v-model="stVal"
                  dense
                  :item-title="'text'"
                  :label="t('item.st.label')"
                  :items="stuckList"
                  :error-messages="errorMessages.st"
                  required
                >
                  <template v-slot:prepend>
                    <v-icon small>mdi mdi-layers-outline</v-icon>
                  </template>
                </v-select>
              </v-col>

              <!-- LIMIT -->
              <v-fade-transition>
                <v-col
                  v-if="stVal === 1"
                  cols="12"
                  sm="6"
                  md="3"
                  lg="3"
                >
                  <v-text-field
                    v-model="lmVal"
                    dense
                    :label="t('item.lm.label')"
                    :suffix="t('units.wght.' + un.wght)"
                    :error-messages="errorMessages.lm"
                    :hint="t('item.lm.hint')"
                    persistent-hint
                    step="1"
                    type="number"
                    @input="touchFiels('lm')"
                    @blur="touchFiels('lm')"
                  >
                    <template v-slot:prepend>
                      <v-icon small>mdi mdi-plus</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-fade-transition>

            </v-row>
            <v-row class="align-center">

              <v-col
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-select
                  v-model="rtVal"
                  dense
                  :item-title="'text'"
                  :label="t('item.rt.label')"
                  :items="rotateList"
                  required
                >
                  <template v-slot:prepend>
                    <v-icon small>mdi mdi-swap-horizontal</v-icon>
                  </template>
                </v-select>
              </v-col>

              <v-col
                cols="6"
                sm="6"
                md="3"
                lg="3"
              >
                <v-select
                  v-model="ovVal"
                  :disabled="pg.value === 1"
                  dense
                  :item-title="'text'"
                  :label="t('item.ov.label')"
                  :items="overList"
                  required
                >
                  <template v-slot:prepend>
                    <v-icon small>mdi mdi-swap-vertical</v-icon>
                  </template>
                </v-select>
              </v-col>

            </v-row>
          </v-card-text>
        </v-form>
      </v-card>

      <!-- BUTTONS -->
      <div class="d-flex alig-center mt-1">
        <v-btn
          rounded
          class="button grey--text text--darken-3 px-2"
          @click="back()"
        >
          {{ t('common.cancel') }}
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          elevation="6"
          color="primary"
          rounded
          class="px-2"
          @click="submit()"
        >
          {{ t('common.save') }}
        </v-btn>
      </div>

      <!-- PROMO -->
      <PromoDialog
        ref="promoRef"
        :head="t('message.cargo.add.head')"
        :text="promo"
        :call="t('message.cargo.add.call')"
      />

    </v-col>
  </v-row>
</template>

<script setup lang='ts'>
import {computed, ref, reactive, onMounted, watch, Ref} from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, maxLength, integer, decimal, maxValue, minValue } from '@vuelidate/validators';
import { nm, ln, wd, hg, wg, cn, pg, st, lm, rt, ov } from '@/configs/items.js';
import { getRandomColor } from '@/configs/getcolor.js';
import { getWght, getSize } from '@/configs/functions/getunits.js';
import { setWght, setSize } from '@/configs/functions/setunits.js';
import { getCargoIcon } from '@/configs/functions/geticon.js';
import PromoDialog from '@/components/dialogs/PromoDialog.vue';
import {useCargoStore} from "../../../stores/cargo";
import {useUserStore} from "../../../stores/user";
import {useAppStore} from "../../../stores/app";
import {useProjectStore} from "../../../stores/project";
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";

const props = withDefaults(defineProps<{
  clid: string,
  id: string,
}>(),{
  clid: '',
  id: ''
});

const {t} = useI18n();
const router = useRouter();

const promoRef: Ref<PromoDialog> = ref(null)

const cargoStore = useCargoStore();
const userStore = useUserStore();
const appStore = useAppStore();
const projectStore = useProjectStore();

const nmVal = ref(nm.val);
const lnVal = ref(ln.val);
const wdVal = ref(wd.val);
const hgVal = ref(hg.val);
const wgVal = ref(wg.val);
const cnVal = ref(cn.val);
const pgVal = ref(pg.val);
const stVal = ref(st.val);
const lmVal = ref(lm.val);
const rtVal = ref(rt.val);
const ovVal = ref(ov.val);
const color = ref(null);

const colorMenu = ref(false);

const promo = ref('');

const start = {
  nm, ln, wd, hg, wg, cn, pg, st, lm, rt, ov
};

const un = reactive({
  size: '',
  wght: ''
});

const overList = computed(() => cargoStore.overList)
const rotateList = computed(() => cargoStore.rotateList)
const stuckList = computed(() => cargoStore.stuckList)
const packingList = computed(() => cargoStore.packingList)

const rules = {
  nm: { required, maxLength: maxLength(start.nm.max) },
  ln: { required, decimal, minValue: minValue(getSize(start.ln.min, un.size)), maxValue: maxValue(getSize(start.ln.max, un.size)) },
  wd: { required, decimal, minValue: minValue(getSize(start.wd.min, un.size)), maxValue: maxValue(getSize(start.wd.max, un.size)) },
  hg: { required, decimal, minValue: minValue(getSize(start.hg.min, un.size)), maxValue: maxValue(getSize(start.hg.max, un.size)) },
  wg: { required, decimal, minValue: minValue(getWght(start.wg.min, un.wght)), maxValue: maxValue(getWght(start.wg.max, un.wght)) },
  cn: { required, integer, minValue: minValue(start.cn.min), maxValue: maxValue(start.cn.max) },
  pg: { required },
  st: { required },
  lm: computed(() => {
    if (stVal.value === 1) {
      return {
        decimal,
        minValue: minValue(getWght(start.lm.min, un.wght)),
        maxValue: maxValue(getWght(start.lm.max, un.wght))
      };
    }
    return {};
  })
};

const v$ = useVuelidate({ rules }, { nm, lm, ln, wd, hg, wg, cn, pg, st }, { $lazy: true });

const errorMessages = computed(() => {
  return {
    nm: v$.value.nm?.$error ? v$.value.nm.$errors.map(e => e.$message) : [],
    ln: v$.value.nm?.$error ? v$.value.ln.$errors.map(e => e.$message) : [],
    lm: v$.value.nm?.$error ? v$.value.lm.$errors.map(e => e.$message) : [],
    wd: v$.value.nm?.$error ? v$.value.wd.$errors.map(e => e.$message) : [],
    hg: v$.value.nm?.$error ? v$.value.hg.$errors.map(e => e.$message) : [],
    wg: v$.value.nm?.$error ? v$.value.wg.$errors.map(e => e.$message) : [],
    cn: v$.value.nm?.$error ? v$.value.cn.$errors.map(e => e.$message) : [],
    pg: v$.value.nm?.$error ? v$.value.pg.$errors.map(e => e.$message) : [],
    st: v$.value.nm?.$error ? v$.value.st.$errors.map(e => e.$message) : [],
  };
});

const touchFiels = (field: string) =>{
    v$.value[field].$touch()
};

const clearField = () => {
  nmVal.value = '';
  v$.value.nm.$reset();
};

const state = () => {
  nmVal.value = start.nm.val;
  lnVal.value = start.ln.val;
  wdVal.value = start.wd.val;
  hgVal.value = start.hg.val;
  wgVal.value = start.wg.val;
  cnVal.value = start.cn.val;
  pgVal.value = start.pg.val;
  stVal.value = start.st.val;
  lmVal.value = start.lm.val;
  rtVal.value = start.rt.val;
  ovVal.value = start.ov.val;
  un.size = String(userStore.config.units.cargo.size);
  un.wght = String(userStore.config.units.cargo.wght);
  v$.value.$reset();
};

const rem = () => {
  cargoStore.removeItem(+props.id)
  sync()
  back()
}

const setData = (data) => {
  if (!data) return;

  if (data.un) {
    un.size = data.un.size;
    un.wght = data.un.wght;
  }

  if (data.nm) nmVal.value = data.nm;
  lnVal.value = getSize(data.ln, un.size);
  wdVal.value = getSize(data.wd, un.size);
  hgVal.value = getSize(data.hg, un.size);
  wgVal.value = getWght(data.wg, un.wght);
  cnVal.value = Number(data.cn);
  pgVal.value = Number(data.pg);
  stVal.value = Number(data.st);
  lmVal.value = getWght(data.lm, un.wght);
  rtVal.value = Object.prototype.hasOwnProperty.call(data, 'rt') ? Number(data.rt) : start.rt.val;
  ovVal.value = Object.prototype.hasOwnProperty.call(data, 'ov') ? Number(data.ov) : start.ov.val;

  if (data.key && !nmVal.value) nmVal.value = t(data.key);
  if (data.cr) color.value = data.cr;
};

const getData = () => {
  return {
    id: props.id ? Number(props.id) : null,
    nm: String(nmVal.value),
    ln: setSize(lnVal.value, un.size),
    wd: setSize(wdVal.value, un.size),
    hg: setSize(hgVal.value, un.size),
    wg: setWght(wgVal.value, un.wght),
    cn: Number(cnVal.value),
    pg: Number(pgVal.value),
    st: Number(stVal.value),
    lm: stVal.value === 1 ? setWght(lmVal.value, un.wght) : 0,
    rt: Number(rtVal.value),
    ov: Number(pgVal.value) !== 1 ? Number(ovVal.value) : Number(start.ov.val),
    cr: String(color.value),
    un: {
      size: String(un.size),
      wght: String(un.wght)
    },
    point: Number(props.clid)
  };
};

const clearForm = () => {
  state();
  appStore.showSuccess(t('item.message.clear'));
};
const subFieldText = (int: number, max: number) => {
  int = int ? int : 0
  const size = getSize(max, un.size)
  return int/size
}

const increment = () => {
  if (cnVal.value < start.cn.max) cnVal.value++;
};

const decrement = () => {
  if (cnVal.value > start.cn.min) cnVal.value--;
};

const valid = () => {
  v$.value.$touch();
  return v$.value.$error;
};

const submit = () => {
  if (valid()) return appStore.showError(t('item.message.form_error'));

  let addItems = null;

  if (newItem.value) {
    addItems = cnVal.value;
  } else {
    addItems = cargoStore.item[props.id];
    addItems = cnVal.value - addItems.cn;
  }

  if (!cargoStore.checkCountCargo(addItems)) return limitMessage(addItems);

  const data = getData();

  cargoStore.addItem(data);
  sync();

  return back();
};

const sync = () => {
  projectStore.putProject({ alias: 'cargo' });
};

const back = () => {
  return router.push({ name: 'cargo' });
};

const limitMessage = (n) => {
  let limit = Number(userStore.config.limit.items) - Number(cargoStore.itemsCount);

  if (limit < 0) limit += n;
  if (n < 0 || !limit) n = 0;

  const up = n - limit;

  if (!userStore.user.tarif.type) {
    promo.value = t('message.cargo.add.text', up, { n: up });
    // Assume promo dialog has a ref
    promoRef.value.open();
  }

  return appStore.showError(t('message.cargo.add.text', up, { n: up }));
};

onMounted(() => {
  state();
  appStore.hideToast();

  if (!newItem.value) {
    setData(cargoStore.item[props.id]);
  } else {
    color.value = getRandomColor();
    nmVal.value = t('item.new_nm');
  }
});

const newItem = computed(() => !props.clid && !props.id);

const pgIcon = computed(() => getCargoIcon(pgVal.value));

watch(pgVal, (newVal) => {
  if (newVal === 1) ovVal.value = 0;
});
</script>

<style>
  .centered-input input {
    text-align: center !important;
  }
</style>
