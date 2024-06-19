<template>
    <v-card class="mb-3">
        <v-card-actions>
      <span class="text-button font-weight-bold ml-1">
        {{ t('templates.header') }}
      </span>
            <v-spacer></v-spacer>
            <v-btn
                    rounded
                    small
                    variant="text"
                    color="red"
                    class="text-caption text-uppercase px-1"
                    @click="close()"
            >
                {{ t('$vuetify.close') }}
            </v-btn>
        </v-card-actions>

        <v-data-iterator
                :items="filterData"
                v-model:page="page"
                :search="search"
                v-model:items-per-page="itemsPerPage"
                disable-sort
        >
            <template v-slot:header>
                <v-toolbar
                        :elevation="4"
                        color="blue-darken-3"
                        class="mb-1 py-1 px-2"
                >
                  <v-select
                      v-model="value"
                      flat
                      variant="solo-filled"
                      hide-details
                      bg-color="blue-darken-1"
                      :items="filter"
                      item-title="text"
                      :prepend-inner-icon="icons.magnify"
                      :label="t('common.filter')"
                      class="mr-1"
                      style="max-width:25em"
                  ></v-select>
                  <v-text-field
                      v-model="search"
                      clearable
                      flat
                      variant="solo-filled"
                      bg-color="blue-darken-1"
                      hide-details
                      :prepend-inner-icon="icons.magnify"
                      :label="t('common.search')"
                  ></v-text-field>
                </v-toolbar>
            </template>

            <template v-slot:default="props">
                <v-list>
                    <v-scale-transition group>
                        <v-list-item
                                v-for="({raw}, index) in props.items"
                                :key="index"
                                link
                        >
                          <template v-slot:prepend>
                            <v-avatar>
                              <v-icon
                                  rounded
                                  color="primary"
                              >
                                {{ raw.icon }}
                              </v-icon>
                            </v-avatar>
                          </template>

                          <template v-slot:append>
                            <v-list-item-action>
                              <div class="d-flex align-center pl-2">
                                <v-btn
                                    v-if="raw.clid"
                                    :disabled="!user.tarif.type"
                                    @click.stop="del(raw.clid)"
                                >
                                  <v-icon>{{ icons.trashCan }}</v-icon>
                                </v-btn>
                                <v-btn
                                    @click.stop="submit(raw.data, raw.clid)"
                                >
                                  <v-icon>{{ icons.arrowRightCircle }}</v-icon>
                                </v-btn>
                              </div>
                            </v-list-item-action>
                          </template>
                            <v-list-item
                                    :class="[raw.gr == 1 ? 'primary--text' : '']"
                                    @click="submit(raw.data, raw.clid)"
                            >
                                <v-list-item-title class="body-2 font-weight-medium">
                                    {{ raw.nm }}
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    {{ raw.text }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list-item>
                    </v-scale-transition>
                </v-list>
            </template>

            <template v-slot:no-data>
                <v-card-text class="mt-4 text-center">
                    <span class="text-body-2 grey--text font-weight-regular">... {{ t('common.nodata') }} ...</span>
                </v-card-text>
            </template>

            <template v-slot:no-results>
                <v-card-text class="mt-4 text-center">
                    <span class="text-body-2 grey--text font-weight-regular">... {{ t('common.noresult') }} ...</span>
                </v-card-text>
            </template>
        </v-data-iterator>

        <!-- PROMO -->
        <PromoDialog
                ref="promo"
                :head="t('message.templates.set.head')"
                :text="t('message.templates.set.text')"
                :call="t('message.templates.set.call')"
        />
    </v-card>
</template>

<script setup lang="ts">
import {computed, onMounted, Ref, ref} from 'vue'
import {useI18n} from "vue-i18n";
import {useUserStore} from "../../stores/user";
import {useAppStore} from "../../stores/app";
import PromoDialog from "../dialogs/PromoDialog.vue";
import icons from "../../configs/constants/icons";

const { t } = useI18n()
const props = withDefaults(defineProps<{ data: string[] }>(), {
    data: () => []
})
const filter = ref([
    { text: t('templates.filter.all'), value: -1 },
    { text: t('templates.filter.default'), value: 0 },
    { text: t('templates.filter.mine'), value: 1 }
])
const value = ref(-1)
const page = ref(1)
const search = ref('')
const itemsPerPage = ref(10)

const userStore = useUserStore()
const appStore = useAppStore()

const promo: Ref<typeof PromoDialog> = ref(null)

const emit = defineEmits(['close', 'del', 'submit'])

const user = computed(() => userStore.user)

const filterData = computed(() => {
  if (value.value === -1) return props.data
  return props.data.filter(i => String(i.gr) === String(value.value))
})

const close = () => {
    emit('close')
}

const del = (clid) => {
    if (!clid) return false
    if (!checkPermission()) return showPromo()
    return emit('del', clid)
}

const submit = (data, clid) => {
    if (!checkPermission() && clid) return showPromo()
    return emit('submit', data)
}

const checkPermission = () => {
    return [1, 2].includes(Number(user.value.tarif.type))
}

const showPromo = () => {
    promo.value.open()
}

onMounted(() => {
    appStore.hideToast()
})
</script>

<style scoped>
.select-w {
  max-width:25em
}
</style>
