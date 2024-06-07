<template>
  <div>
    <v-card
      v-show="!filter || filter && item.length !== 0"
      class="rounded-lg"
      style="z-index: 1"
    >
      <!-- COMMAND -->
      <v-card-actions>
        <v-row no-gutters>

          <v-col cols="auto d-flex align-center">

            <v-scale-transition group hide-on-leave>
              <v-chip
                v-show="order"
                key="order"
                :color="point[clid].color"
                class="text-caption font-weight-medium"
              >
                <span v-if="!mobile">{{ t('cargolist.header') }} # </span>{{ order ? order : '...' }}
              </v-chip>
              <v-chip
                v-if="!order"
                key="!order"
                class="text-caption white--text"
                color="red lighten-1"
                close
                close-icon="mdi-close"
                @click:close="changeView()"
              >
                {{ t('cargolist.disable') }}
              </v-chip>
            </v-scale-transition>

          </v-col>

          <v-col class="flex-grow-1 d-flex align-center">
            <v-btn
              variant="text"
              rounded
              class="ml-1"
              :class="[order ? point[clid].color : 'white']"
              :style="(!order && mobile) && 'display:none;'"
              @click="renamePoint()"
            >
              <span
                class="text-truncate text-caption font-weight-medium"
                :style="mobile && 'max-width:120px'"
              >
                {{ point[clid]['name'] }}
              </span>
              <v-icon v-if="!mobile" small right >mdi mdi-form-textbox</v-icon>
            </v-btn>
          </v-col>

          <v-col cols="auto">
            <v-btn
              :disabled="item.length === 0"
              @click="changeMini()"
            >
              <v-icon small>{{ logoMini }}</v-icon>
            </v-btn>
            <v-btn
              :disabled="item.length === 0"
              @click="changeView()"
            >
              <v-icon small>{{ logoView }}</v-icon>
            </v-btn>
            <v-btn
              :icon="icons.close"
              @click="removePoint()"
            >
            </v-btn>
          </v-col>

        </v-row>
      </v-card-actions>

      <!-- MINI -->
      <v-card-text
        v-if="point[clid].mini && item.length > 0"
        class="d-flex align-center caption black--text lighten-3"
      >
        <div>{{ t('cargolist.windoff') }}</div>
        <v-btn
          variant="text"
          small
          class="caption mx-1"
          color="primary"
          @click="changeMini()"
        >
          {{ t('cargolist.windon') }}
        </v-btn>
        <v-spacer></v-spacer>
        <div>
          {{ subResult }}
        </div>
      </v-card-text>

      <!-- BODY -->
      <div v-if="!point[clid].mini">

        <v-card-text v-show="item.length" class="py-0">
          <v-row no-gutters>

            <v-col cols="auto" class="d-flex align-center">
              <v-checkbox
                :value="selectAll"
                :indeterminate="selectAlmostAll"
                @click.stop="onSelectAll(selectAll)"
              ></v-checkbox>
            </v-col>

            <v-col v-if="selected.length == 0 && !mobile && item.length" cols="auto" class="d-flex align-center">
              <div class="caption mx-1">
                {{ t('common.selectall') }}
              </div>
            </v-col>

            <v-col v-if="selected.length > 0" cols="auto" class="align-self-center">
              <div class="d-flex align-center">
                <v-btn
                  variant="text"
                  small
                  color="primary"
                  class="font-weight-medium px-1"
                  @click="editItems()"
                >
                  <v-icon left>mdi mdi-square-edit-outline</v-icon>
                  <span>{{ t('common.edit') }}</span>
                </v-btn>

                <v-btn
                  variant="text"
                  small
                  color="primary"
                  class="font-weight-medium px-1"
                  @click="moveItems()"
                >
                  <v-icon left>mdi mdi-repeat</v-icon>
                  <span>{{ t('common.move') }}</span>
                </v-btn>

                <v-btn
                  variant="text"
                  small
                  color="primary"
                  class="font-weight-medium px-1"
                  @click="setTemplate()"
                >
                  <v-icon left>mdi mdi-content-save-outline</v-icon>
                  <span>{{ t('templates.tempsave') }}</span>
                </v-btn>

                <v-btn
                  variant="text"
                  small
                  color="primary"
                  class="font-weight-medium px-1"
                  @click="removeItemsSelected()"
                >
                  <v-icon left>mdi mdi-trash-can-outline</v-icon>
                  <span >{{ t('common.delete') }}</span>
                </v-btn>
              </div>
            </v-col>

            <v-col class="ml-1 d-flex align-center justify-end">
              <div class="text-caption" :class="selected.length > 0 && 'primary--text font-weight-medium'">
                {{ subResult }}
              </div>
            </v-col>

          </v-row>
        </v-card-text>

        <!-- LIST -->
        <v-list color="transparent pt-0">
          <v-scale-transition group>
            <template
              v-for="(i) in item"
              :key="i.id"
            >

              <v-list-item
                :class="selectedById[i.id] && 'v-list-item--active primary--text'"
                :link="!mobile"
                style="height:76px;"
              >
                <v-lazy width="100%">
                  <v-row no-gutters>
                    <v-col cols="auto" class="d-flex align-center">
                      <v-checkbox v-model="selected" :value="i.id"></v-checkbox>
                    </v-col>
                    <v-col cols="auto" class="d-flex align-center mx-1">
                      <v-list-item-avatar
                        class="mx-0"
                        :color="i.cr"
                        @click.stop="router.push(`/cargo/item/${clid}/${i.id}`)"
                      >
                        <v-icon
                          color="grey darken-4"
                          rounded
                        >
                          {{ i.icon }}
                        </v-icon>
                      </v-list-item-avatar>
                    </v-col>
                    <v-col class="flex-grow-1 text-truncate mx-1 d-flex align-center">

                      <v-list-item-content
                        @click="$router.push(`/cargo/item/${clid}/${i.id}`)"
                      >

                        <v-list-item-title class="body-2 font-weight-medium">
                          <span v-if="i.id < 10000">{{ i.id }}. </span>{{ i.nm }}
                        </v-list-item-title>

                        <v-list-item-subtitle :class="selectedById[i.id] && 'primary--text'">
                          {{ i.tt }} {{ i.sz }}, {{ i.cn }} {{ t('units.co') }}
                        </v-list-item-subtitle>

                        <v-list-item-subtitle>

                          <v-icon
                            :color="i.st ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi mdi-layers-outline
                          </v-icon>

                          <span
                            :class="i.st ? 'grey--text text-darken-3' : 'grey--text text-lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ t('item.st.label') }}: {{ i.attr.st }}
                          </span>

                          <v-icon
                            :color="i.lm && i.st === 1 ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi mdi-plus
                          </v-icon>

                          <span
                            :class="i.lm && i.st === 1 ? 'grey--text text-darken-3' : 'grey--text text-lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ t('item.lm.label') }}: {{ i.attr.lm }}
                          </span>

                          <v-icon
                            :color="i?.rt ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi mdi-swap-horizontal
                          </v-icon>

                          <span
                            :class="i?.rt ? 'grey--text text-darken-3' : 'grey--text text-lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ t('item.rt.label') }}: {{ i.attr.rt }}
                          </span>

                          <v-icon
                            :color="i?.ov ? 'grey darken-3' : 'grey lighten-1'"
                            small
                          >
                            mdi mdi-swap-vertical
                          </v-icon>

                          <span
                            :class="i?.ov ? 'grey--text text-darken-3' : 'grey--text text-lighten-1'"
                            class="mr-1 font-weight-thin text-lowercase"
                           >
                            {{ t('item.ov.label') }}: {{ i.attr.ov }}
                          </span>

                        </v-list-item-subtitle>
                      </v-list-item-content>

                    </v-col>
                    <v-col cols="auto" class="d-flex align-center">
                      <v-list-item-action class="mr-0">
                        <div class="d-flex align-center">
                          <v-btn
                            :icon="icons.editOutline"
                            @click="router.push(`/cargo/item/${clid}/${i.id}`)"
                          >
                          </v-btn>
                          <v-btn
                            :icon="icons.saveOutline"
                            @click.stop="setTemplateOne(i.id)"
                          >
                          </v-btn>
                          <v-btn
                            :icon="icons.copyContent"
                            @click.stop="copyItem(i.id)"
                          >
                          </v-btn>
                          <v-btn
                            :icon="icons.trashCan"
                            @click.stop="removeItem(i.id)"
                          >
                          </v-btn>
                        </div>
                      </v-list-item-action>
                    </v-col>
                  </v-row>
                </v-lazy>
              </v-list-item>

            </template>

          </v-scale-transition>
        </v-list>

        <template v-if="item.length === 0">
          <div class="text-body-2 grey--text text-darken-2 mx-3 mt-4 mb-5 text-center">
            <div class="font-weight-bold mb-1">... {{ t('cargolist.no-items') }} ...</div>
            <div class="d-flex justify-center font-weight-thin">
              <div>{{ t('cargolist.no-items-description-1') }}</div>
              <div class="mx-1 text-teal font-weight-bold">{{ t('common.or') }}</div>
              <div>{{ t('cargolist.no-items-description-2') }}</div>
              <div class="mx-1 text-teal font-weight-bold">{{ t('common.or') }}</div>
              <div>{{ t('cargolist.no-items-description-3') }}</div>
            </div>
          </div>
        </template>

        <!-- BUTTONS -->
        <v-card-actions>
          <v-row dense>

            <v-col class="text-right">

              <v-badge
                color="error"
                dot
                :value="!userPro && hover.file"
              >

                <v-hover v-model="hover.file">
                  <v-btn
                    rounded
                    variant="text"
                    class="text-caption text-uppercase"
                    @click="getFile()"
                  >
                    <v-icon left>
                      mdi mdi-file-table-outline
                    </v-icon>
                    <span>{{ t('cargolist.addfromfile') }}</span>
                  </v-btn>
                </v-hover>

              </v-badge>
            </v-col>

            <v-col cols="auto" class="text-center">

              <v-badge
                color="error"
                dot
                :value="!userPro && hover.custom"
              >

                <v-hover v-model="hover.custom">
                  <v-btn
                    rounded
                    class="px-2 font-weight-regular"
                    variant="flat"
                    color="primary"
                    @click="addItem()"
                  >
                    <v-icon left>
                      mdi mdi-plus-circle-outline
                    </v-icon>
                    <span>
                      {{ t('cargolist.addcargo') }}
                    </span>
                  </v-btn>
                </v-hover>
              </v-badge>
            </v-col>

            <v-col class="text-left">
              <v-btn
                rounded
                variant="text"
                class="text-caption text-uppercase"
                @click="getTemplates()"
              >
                <v-icon left>
                  mdi mdi-content-save-outline
                </v-icon>
                <span>{{ t('cargolist.addfromtemplate') }}</span>
              </v-btn>
            </v-col>

          </v-row>

        </v-card-actions>

      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { getDigits } from '@/configs/functions/getDigits.js'
import {useI18n} from "vue-i18n";
import {computed, ref, watch, nextTick} from "vue";
import {useUserStore} from "../../stores/user";
import {useCargoStore} from "../../stores/cargo";
import {useDisplay} from "vuetify";
import {useRouter} from "vue-router";
import icons from "../../configs/constants/icons";

type PropsType = {
  item: any[],
  clid: number,
  order: number,
  filter: string
}

  const {mobile} = useDisplay();
  const router = useRouter();

  const props = withDefaults(defineProps<PropsType>(), {
    item: () => [],
    clid: 0,
    order: 0,
    filter: ''
  })
// Define Emits
const emit = defineEmits([
    'edititems', 'moveitems', 'removeitems', 'removeitem', 'copyitem',
    'additem', 'renamepoint', 'removepoint', 'changepointmini',
    'changepointview', 'getfile', 'gettemplate', 'settemplate', 'settemplateone'
]);

const { t } = useI18n();
const userStore = useUserStore();
const cargoStore = useCargoStore();

const point = computed(() => cargoStore.point)

const selectAll = ref(false);
const selectAlmostAll = ref(false);
const selected = ref<any[]>([]);
const hover = ref({
    custom: false,
    file: false,
});

const userPro = computed(() => Boolean(userStore.user.tarif.type));

const logoMini = computed(() => point.value[props.clid]?.mini ? 'mdi mdi-window-maximize' : 'mdi mdi-window-minimize');

const logoView = computed(() => props.order ? 'mdi mdi-eye-off' : 'mdi mdi-eye-outline');

const subResult = computed(() => {
    if (!props.item.length) return '';

    let array = props.item;

    if (selected.value.length) {
        array = selected.value.map((i) => props.item.find((item) => item.id === i));
    }

    const result = array.reduce(
        (o, i) => {
            o['cn'] += Number(i.cn);
            o['wg'] += Number(i.wf);
            o['vl'] += Number(i.vl);

            return o;
        },
        { cn: 0, wg: 0, vl: 0 }
    );

    result.wg = getDigits(result.wg);
    result.vl = getDigits(result.vl);

    return `${result.cn} ${t('units.co')}, ${result.wg} ${t('units.wght.' + userStore.config.units.cargo.wght)}, ${result.vl} ${t('units.m3')}`;
});

const selectedById = computed(() => {
    if (!selected.value.length) return {};

    return selected.value.reduce((out, item) => {
        out[item] = true;
        return out;
    }, {});
});

watch(selected, (val) => {
    nextTick(() => {
        if (selectAll.value) {
            if (val.length === 0) {
                selectAll.value = false;
                selectAlmostAll.value = false;
            } else {
                if (props.item.length === val.length) {
                    selectAlmostAll.value = false;
                } else {
                    selectAlmostAll.value = true;
                }
            }
        }
    });
});

const onSelectAll = () => {
    if (selectAll.value) {
        selected.value = [];
    } else {
        selected.value = props.item.map((i) => i.id);
    }

    selectAlmostAll.value = false;
    selectAll.value = !selectAll.value;
};

const selectedObject = () => {
    return { clid: props.clid, selected: selected.value };
};

const clearSelected = () => {
    selected.value = [];
    selectAll.value = false;
    selectAlmostAll.value = false;
};

// ITEMS
const editItems = () => {
    emit('edititems', selectedObject());
};

const moveItems = () => {
    emit('moveitems', selectedObject());
};

const removeItemsSelected = () => {
    emit('removeitems', selectedObject());
};

const removeItem = (id: number) => {
    emit('removeitem', id);
    if (selected.value.includes(id)) {
        selected.value = selected.value.filter((i) => i !== id);
    }
};

const copyItem = (id: number) => {
    emit('copyitem', id);
};

const addItem = () => {
    emit('additem', props.clid);
};

// POINT
const renamePoint = () => {
    emit('renamepoint', {
        clid: props.clid,
        name: point.value[props.clid].name,
    });
};

const removePoint = () => {
    emit('removepoint', { clid: props.clid, length: props.item.length });
};

const changeMini = () => {
    emit('changepointmini', props.clid);
};

const changeView = () => {
    emit('changepointview', props.clid);
};

// FILE
const getFile = () => {
    emit('getfile', props.clid);
};

// TEMPLATES
const getTemplates = () => {
    emit('gettemplate', props.clid);
};

const setTemplate = () => {
    emit('settemplate', selectedObject());
};

const setTemplateOne = (id: number) => {
    emit('settemplateone', id);
};
</script>

<style scoped>
.scroller {
  height: 100%;
}

.item_list {
  height: 66px;
}
</style>
