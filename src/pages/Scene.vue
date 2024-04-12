<template>
  <v-container fluid>
    <div
      style="width:100%;"
      :style="drawerStyle"
    >

      <!-- CANVAS -->
      <div
        class="canvas"
        style="position:relative;"
        :style="canvasMaxHeight"
      >

        <!-- TOP LEFT -->
        <v-sheet
          v-show="!sceneMaxPage"
          rounded="xl"
          color="white"
          elevation="6"
          density="compact"
          position="absolute"
          style="z-index: 1; top: 500; left: 0;"
        >

          <HelpButton />

          <v-btn
            icon
            variant="text"
            size="40"
            @click.stop="screen()"
          >
            <v-icon>mdi:mdi mdi-download</v-icon>
            <v-tooltip
              activator="parent"
              location="start"
            >
              {{ t('tooltips.scene.download') }}
            </v-tooltip>
          </v-btn>

          <v-btn
            v-if="user.tarif?.type && route.name === 'scene'"
            icon
            variant="text"
            size="40"
            @click.stop="share()"
          >
            <v-icon>mdi:mdi mdi-share</v-icon>
            <v-tooltip
              activator="parent"
              location="start"
            >
              {{ t('tooltips.scene.share') }}
            </v-tooltip>
          </v-btn>

          <v-btn
            v-if="route.name === 'scene'"
            icon
            variant="text"
            size="40"
            @click.stop="reset()"
          >
            <v-icon>mdi:mdi mdi-share</v-icon>
            <v-tooltip
              activator="parent"
              location="start"
            >
              {{ t('tooltips.scene.reset') }}
            </v-tooltip>
          </v-btn>
        </v-sheet>

        <!-- TOP RIGHT -->
        <v-sheet
          v-if="!sceneMaxPage"
          color="transparent"
          class="d-flex align-center"
          style="position: absolute; z-index: 1; right: 48px; top: 0;"
        >

          <v-btn
            v-if="route.name === 'scene' && !mobile"
            variant="text"
            rounded
            size="small"
            color="primary"
            prepend-icon="mdi:mdi mdi-cog"
            :disabled="Boolean(step.value) || setting.value"
            @click="setting.value = true"
          >
            Настройки
          </v-btn>

          <v-btn
            variant="text"
            rounded
            size="small"
            color="primary"
            prepend-icon="mdi:mdi mdi-cog"
            :disabled="Boolean(step.value) || setting.value"
            @click="startStep()"
          >
            {{ t('scene.step.label') }}
          </v-btn>

        </v-sheet>

        <!-- MENU BTN -->
        <v-btn
          v-show="!sceneMaxPage"
          rounded="pill"
          icon
          size="40"
          variant="text"
          style="position: absolute; z-index: 1; right: 0; top: 0;"
          @click="setDrawer()"
        >
          <v-icon>
            mdi:mdi mdi-menu
          </v-icon>
        </v-btn>

      </div>

    </div>
  </v-container>
</template>

<route lang="yaml">
  name: 'scene'
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

/**
 * Router
 */
const route = useRoute()

/**
 * Lang
 */
const { t } = useI18n()

onMounted(() => {
  console.log(route.name)
})

/**
 * Drawer
 */
const drawer = mobile ? false : true
const drawerMargin = 380 - 18
const drawerStyle = computed(() => {
  if (mobile) return ''
  if (drawer) return `max-width:calc(100% - ${drawerMargin}px)`
  return ''
})

/**
 * Canvas
 */
const canvasMaxHeightCalc = computed(() => {
  if (route.name === 'share') return canvasMaxHeight.value - 50
  return canvasMaxHeight
})
const canvasMaxHeight = computed(() => {
  return `height:calc(100vh - ${canvasMaxHeightCalc.value}px);`
})

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
const user = computed(() => appUser.user)

/**
 * Project store
 */
const appProject = useProjectStore()
const project_id = computed(() => appProject.project.id)

/**
 * Data
 */
const sceneMaxPage = ref(0)

/**
 * Настройки сцены
 */
const setting = reactive({
  value: false,
  settingValue: [],
  settingList: [{
    value: 'snap',
    text: t('scene.snap'),
    desc: 'При перемешении места вручную, оно будет притягиваться к соседним местам или границам транспорта автоматически'
  }, {
    value: 'hang',
    text: t('scene.hang'),
    desc: ''
  }]
})

/**
 * Режим шагов загрузки
 */
const step = reactive({
  value: 0,
  stepMax: null,
  stepType: 2,
  stepTypeList: [
    { value: 0, text: 'Верхняя загрузка' },
    { value: 1, text: 'Боковая загрузка' },
    { value: 2, text: 'Задняя загрузка' }
  ]
})

const startStep = () => {
  // this.step = 1
  // this.makeStep()
}

/**
 * Toolbar top
 */
const reset = async () => {

  // if (this.$route.name === 'share') return

  // /**
  //  * Жесткая перезагрузка сцены
  //  */
  // const confirm = await this.$confirm('<b>' + this.$t('tooltips.scene.reset') + '?</b> Позиции грузов перемещенных вручную не будут сохранены')

  // if (confirm) {

  //   this.putProject({ alias: 'loads' })
  //     .then(() => {

  //       this.stopStep()
  //       this.clearItems()
  //       this.clearTransport()
  //       this.getData()

  //     })

  // }
}

const screen = () => {

  // if (!sceneCreate?.setup) return false

  // return sceneCreate.screen()
  //   .then((img) => {
  //     const a = document.createElement('a')

  //     a.href = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream')
  //     a.download = 'scene.png'
  //     a.click()
  //     a.remove()
  //   })
}

const share = () => {

  // if (!this.project.id || !sceneData) return this.showError(this.$t('common.validation.error'))

  // return this.setShare({ scene: sceneData, project: this.project.id })
  //   .then((id) => {

  //     if (!id) return this.showError(this.$t('common.validation.error'))

  //     let url

  //     if (process.env.NODE_ENV === 'production') {

  //       url = 'https://app2.jload.me/'

  //     } else {

  //       url = 'http://localhost:8080/'

  //     }

  //     const link = url + 'share/' + this.project.id + '/' + id

  //     /**
  //      * to buffer and message
  //      *
  //      */

  //     this.$clipboard(link, this.$t('clipboard.copylink'))

  //     /**
  //      * $metrika
  //      *
  //      */

  //     return this.$metrika.reachGoal('set.share')

  //   },
  //   () => this.showError(this.$t('common.validation.error')))

}

</script>
