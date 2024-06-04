<template>
  <v-row justify="center" no-gutters>
    <v-col
      cols="12"
      lg="8"
    >
      <!-- HEADER -->
      <v-scale-transition>
        <v-card
          v-show="Object.values(item).length"
          class="rounded-lg "
        >
          <!-- COMMAND -->
          <v-card-actions class="d-flex align-start">

            <div
              class="d-sm-flex align-self-start"
            >
              <div class="text-button font-weight-bold ml-1">
                {{ t('cargo.header') }}
              </div>

              <div class="text-button mx-1 d-flex">

                <div :class="[itemsCount >= config.limit.items ? 'red--text text--lighten-2' : '']">
                  {{ itemsCount }} / {{ config.limit.items }}
                  <!-- <span class="text-lowercase font-weight-light">{{ $t('cargo.items') }}</span> -->
                </div>

              </div>
            </div>

            <v-spacer></v-spacer>

            <div class="text-center ml-1">
              <!-- HELP -->
              <help-button />
            </div>
          </v-card-actions>

          <!-- FILTER -->
          <v-text-field
            v-model="value"
            :placeholder="$t('common.search')"
            prepend-inner-icon="mdi-magnify"
            hide-details
            block
            clearable
            solo
            flat
            :outlined="Boolean(value)"
            :max-length="35"
            :disabled="!Object.keys(item).length"
          ></v-text-field>
        </v-card>
      </v-scale-transition>

      <div v-if="scrollView" class="d-flex justify-center align-center my-1 mt-2">
        <v-btn
          icon
          color="primary"
          @click="scrollUpDown(false)"
        >
          <v-icon>bx bx-chevrons-down</v-icon>
        </v-btn>
      </div>

      <div v-if="!points.length && !filter" class="mt-7 mb-1 text-center text-body-2 grey--text text--darken-2">
        <div class="font-weight-bold mb-1">... {{ t('cargolist.no-point') }} ...</div>
        <div>{{ t('cargolist.no-point-description') }}</div>
      </div>

      <div v-if="filter && JSON.stringify(filterItems) === '{}'">
        <v-subheader class="justify-center mt-4 text-lowercase text-center">
          ... {{ t('common.noresult') }} ...
        </v-subheader>
      </div>

      <!-- GROUP -->
      <div class="my-2">
        <v-scale-transition group hide-on-leave>
          <template v-for="(point, index) in points" :key="point.id">
            <CargoList
              :ref="point.id"
              :clid="Number(point.id)"
              :order="pointOrder[point.id]"
              :item="filterItems[point.id]"
              :filter="filter"
              class="list-item"
              @moveitems="itemsMove"
              @edititems="itemsEdit"
              @removeitems="itemsRemove"
              @additem="itemAdd"
              @copyitem="itemCopy"
              @removeitem="itemRemove"
              @removepoint="pointRemove"
              @renamepoint="pointRename"
              @changepointmini="pointChangeMini"
              @changepointview="pointChangeView"
              @settemplate="templateSet"
              @settemplateone="templateSetOne"
              @gettemplate="templateGet"
              @getfile="fileGet"
              @showlimitbuttons="showLimitButtons"
            />
            <div
              class="my-1"
              style="z-index: 0"
            >
              <div
                v-if="index + 1 < points.length && !filter"
                class="d-flex justify-center list-item"
              >
                <v-btn
                  icon
                  @click="pointRotate(point.id)"
                >
                  <v-icon>bx-repost</v-icon>
                </v-btn>
              </div>
            </div>
          </template>
        </v-scale-transition>
      </div>

      <div v-if="scrollView" class="d-flex justify-center align-center mt-2">
        <v-btn
          icon
          color="primary"
          @click="scrollUpDown(true)"
        >
          <v-icon>bx bx-chevrons-up</v-icon>
        </v-btn>
      </div>

      <!-- NEW POINT -->
      <div class="py-2 d-flex justify-center">
        <v-btn
          v-if="!filter"
          ref="addGroup"
          class="px-2 font-weight-medium"
          outlined
          rounded
          color="primary"
          @click="pointAdd()"
        >
          <v-icon left>
            bx-add-to-queue
          </v-icon>
          {{ t('cargo.new') }}
        </v-btn>
      </div>

    </v-col>

    <!-- MOVE -->
    <MoveDialog ref="dialogMove" />

    <!-- EDIT -->
    <EditDialog ref="dialogEdit" />

    <!-- EDIT NAME -->
    <ReName
      ref="dialogReName"
      icon="bx bxs-check-circle"
      color="primary"
    />

    <CargoTemplates ref="templates" />

    <!-- PROMO -->
    <PromoDialog
      ref="promo"
      :head="$t('message.cargo.add.head')"
      :text="promo"
      :call="call"
    />

    <!-- UNSAFE -->

  </v-row>
</template>

<script setup lang="ts">
    import {ref, computed, watch, onMounted, onBeforeUnmount, Ref} from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import _debounce from 'lodash/debounce'
    import {useCargoStore} from "../stores/cargo";
    import {useUserStore} from "../stores/user";
    import {useI18n} from "vue-i18n";
    import {useProjectStore} from "../stores/project";
    import {useAppStore} from "../stores/app";
    import useMessages, {IMessage} from "../hooks/useMessages";
    import { useGoTo } from 'vuetify'
    import ReNameDialog from "../components/dialogs/ReNameDialog.vue";
    import PromoDialog from "../components/dialogs/PromoDialog.vue";
    import MoveDialog from "../components/common/MoveDialog.vue";
    import EditDialog from "../components/common/EditDialog.vue";
    import CargoList from "../components/cargo/CargoList.vue";
    import CargoTemplates from "../components/templates/CargoTemplates.vue";

    /**
     * hooks
     */

    const {getMessage} = useMessages()

    const { t } = useI18n()
    const goTo = useGoTo()

    /**
     * stores
     */

    const cargoStore = useCargoStore()
    const userStore = useUserStore()
    const projectStore = useProjectStore()
    const appStore = useAppStore()
    const route = useRoute()
    const router = useRouter()

    /**
     * refs
     */

    const dialogReName: Ref<typeof ReNameDialog> = ref(null)
    const dialogMove: Ref<typeof MoveDialog> = ref(null)
    const promo: Ref<typeof PromoDialog> = ref(null)
    const dialogEdit: Ref<typeof EditDialog> = ref(null)
    const cargoList: Ref<typeof CargoList[]> = ref([])
    const addGroup = ref<HTMLElement | null>(null)
    const templates: Ref<typeof CargoTemplates> = ref([])


    /**
     * data
     */

    const filter = ref('')
    const value = ref('')
    const call = ref('')

    const points = computed(() => cargoStore.points)
    const pointOrder = computed(() => cargoStore.pointOrder)
    const item = computed(() => cargoStore.item)
    const user = computed(() => userStore.user)
    const config = computed(() => userStore.config)

    const itemsCount = computed(() => cargoStore.itemsCount)

    const filterItems = computed(() => {
      const arr = Object.values(item.value)
      if (!arr.length) return {}

      return arr.reduce((o, itm) => {
        if (filter.value) {
          if (String(itm.nm).toLowerCase().indexOf(String(filter.value).toLowerCase()) === -1) {
            return o
          }
        }

        if (!(itm.point in o)) o[itm.point] = []

        o[itm.point].push(Object.freeze(itm))

        return o
      }, {})
    })

    const getPointsById = computed(() => {
      return points.value.reduce((out, itm) => {
        out[itm.id] = Object.freeze(itm)
        return out
      }, {})
    })

    const scrollView = computed(() => {
      return !filter.value && points.value.length > 2
    })

    const filterValue = _debounce(() => {
        filter.value = value.value
    }, 400)

    watch(value, () => {
      filterValue()
    })

    const filterValueClear = () => {
        filter.value = ''
    }

    onBeforeUnmount(() => {
      filterValueClear()
    })

    onMounted(() => {
      if (!points.value.length) pointAdd()
      scrollTo()
      appStore.hideToast()
      firstVisit()
    })

    const pointAdd = () => {
      cargoStore.addPoint(`${t('point.new')} ${points.value.length + 1}...`)
      sync()
        if (addGroup.value) {
            goTo(addGroup.value, { duration: 400 })
        }
    }

    const pointRotate = (id: number) => {
      cargoStore.rotatePoint(id)
      sync()
    }

    const pointChangeMini = (id: number) => {
      cargoStore.changePointMini(id)
      sync()
    }

    const pointChangeView = (id: number) => {
      cargoStore.changeViewPoint(id)
      sync()
    }

    const pointRemove = async (obj) => {
      const { clid, length } = obj
      if (length) {
        const isApply = confirm(`${t('common.delete')}?`)
        if (isApply) {
          cargoStore.removePoint(clid)
          sync()
        }
      } else {
        cargoStore.removePoint(clid)
        sync()
      }
    }

    const pointRename = async (obj) => {
      const { clid, name } = obj
      const update = await dialogReName.value.open(name)
      if (update) {
        getPointsById.value[clid].name = update
        sync()
      }
    }

    const itemCopy = (id: number) => {
      const data = item.value[id]
      if (!cargoStore.checkCountRow(1)) return false
      if (!cargoStore.checkCountCargo(data.cn)) return limitMessage(data.cn)
      cargoStore.copyItem(id)
      sync()
    }

    const itemAdd = (id: number) => {
      if (!cargoStore.checkCountRow(1)) return false
      if (!cargoStore.checkCountCargo(1)) return limitMessage(1)
      router.push(`/cargo/item/${id}`)
    }

    const itemRemove = (id: number) => {
      cargoStore.removeItem(id)
      sync()
    }

    const itemsRemove = async (obj) => {
      const isApply = confirm(`${t('common.delete')}?`)
      if (isApply) {
        const { clid, selected } = obj
        if (selected.length) selected.forEach((id: number) => cargoStore.removeItem(id))
        cargoList.value[0].clearSelected()
        sync()
      }
    }

    const itemsMove = async (obj) => {
      const { clid, selected } = obj
      let update = await dialogMove.value.open(clid)
      if (!update) return

      if (update === 'new') {
        pointAdd()
        update = pointOrder.value[points.value.length - 1].id
      }

      if (update && selected.length) selected.forEach((id: number) => cargoStore.moveItem({ id, clid: update }))

      cargoList.value[0].clearSelected()
      sync()
    }

    const itemsEdit = async (obj) => {
      const { selected } = obj
      const update = await dialogEdit.value.open()
      if (!update) return
      if (update && selected.length) selected.forEach((id: number) => cargoStore.editItem({ id, data: update }))
      sync()
    }

    const sync = () => {
      projectStore.putProject({ alias: 'cargo' })
    }

    const templateSet = async (obj) => {
      const name = await dialogReName.value.open()
      if (!name) return
      const { clid, selected } = obj
      const data = selected.map((i) => item.value[i])
      cargoList.value[0].clearSelected()
      projectStore.addTemplate({ type: 'c', name, data }).then(templateSetSuccess, templateSetError)
    }

    const templateSetOne = (id: number) => {
      const data = item.value[id]
      if (!id || !data) return
      projectStore.addTemplate({ type: 'c', name: data.nm, data: [data] }).then(templateSetSuccess, templateSetError)
    }

    const templateSetSuccess = () => {
      appStore.showSuccess(t('templates.add'))
    }

    const templateSetError = (message: string) => {
      const msg: IMessage = JSON.parse(message)
      if (!user.value.tarif.type && msg.type === 'maxTemplate') {
        promo.value = t('message.templates.add.text')
        call.value = t('message.templates.add.call')
        appStore.hideToast()
        return showPromo()
      }

      if (msg) {
        message = getMessage(msg)
      } else {
        message = t('scene.valid.error')
      }

      return appStore.showError(message)
    }

    const templateGet = async (clid) => {
      const data = await templates.value.open()
      if (!data) return false

      const count = data.reduce((o, i) => Number(o) + Number(i.cn), 0)
      if (!cargoStore.checkCountRow(data.length)) return false
      if (!cargoStore.checkCountCargo(count)) return limitMessage(count)

      for (const i of data) {
        i.point = clid
        cargoStore.addItem(i)
      }
      appStore.hideToast()
      sync()
      return false
    }

    const fileGet = (clid) => {
      if (!cargoStore.checkCountRow(1)) return false
      if (!cargoStore.checkCountCargo(1)) return limitMessage(1)
      router.push(`/cargo/imports/${clid}`)
    }

    const scrollTo = () => {
      let offset = 0
      if (Number(localStorage.getItem('CargoPageYOffset_' + user.value.id)) > 0) {
        offset = Number(localStorage.getItem('CargoPageYOffset_' + user.value.id))
      }
      window.scrollTo(0, offset)
    }

    const scrollUpDown = (type) => {
      if (type) {
        goTo(0, { duration: 800 })
      } else {
          if (addGroup.value) {
              goTo(addGroup.value, { duration: 800 })
          }
      }
    }

    const showLimitButtons = () => {
      promo.value = t('message.cargo.button.text')
      call.value = t('message.cargo.button.call')
      promo.value.open()
    }

    const showPromo = () => {
        promo.value.open()
    }

    const limitMessage = (n) => {
      let limit = Number(userStore.config.limit.items) - Number(itemsCount.value)
      if (limit < 0) limit += n
      if (n < 0 || !limit) n = 0
      limit = n - limit

      if (!user.value.tarif.type) {
        promo.value = `${t('message.cargo.add.text')}, ${limit}, { n: ${limit} })`
        call.value = t('message.cargo.add.call')
        showPromo()
      }

      return appStore.showError(`${t('message.cargo.add.text')}, ${limit}, { n: ${limit} })`)
    }

    const firstVisit = () => {
      if (Object.values(item.value).length === 1 && user.value.tarif.type !== 2) {
        appStore.showInfo(t('promtp.page.cargo'))
      }
    }
</script>

<style scoped>
.list-item {
  transition: all 0.55s ease;
}
</style>
