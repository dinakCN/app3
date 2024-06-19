<template>
  <v-container fluid>
    <v-row justify="center" dense>
      <v-col
          v-for="(i, index) in data"
          :key="index"
          cols="12"
          sm="12"
          md="4"
          lg="3"
      >
        <v-card rounded="lg" style="position:relative">
          <v-card-actions>
            <div class="text-button font-weight-bold grey--text text--darken-3 mx-2 my-1">
              {{ index + 1 }}. {{ t(i.key) }}
            </div>
          </v-card-actions>

          <v-img
              aspect-ratio="1.7778"
              :src="'http://img.youtube.com/vi/' + i.id + '/maxresdefault.jpg'"
              alt="youtube video"
          ></v-img>

          <div class="text-right pr-1 pb-1" style="position:absolute; bottom: 0; right: 0;">
            <v-sheet
                dark
                class="px-1 text-subtitle-2"
            >
              {{ i.time }}
            </v-sheet>
          </div>

          <div class="text-center justify-center" style="position:absolute; top: 50%; width:100%;">
            <v-hover v-slot:default="{ isHovering }">
              <v-btn
                  height="70px"
                  width="70px"
                  :color="!isHovering ? 'grey darken-2' : 'black'"
                  @click="show(i)"
              >
                <v-icon size="90">{{ icons.play }}</v-icon>
              </v-btn>
            </v-hover>
          </div>
        </v-card>
      </v-col>

      <brief-dialog ref="briefDialogRef" />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import v from '@/configs/video.js'
import { onMounted, ref } from 'vue'
import BriefDialog from '@/components/dialogs/BriefDialog.vue'
import { useAppStore } from '../stores/app'
import icons from '../configs/constants/icons'
import { useI18n } from 'vue-i18n'
import {VideoInterface} from "../interfaces/VideoInterfaces";

const briefDialogRef = ref(null)
const data = ref(v)
const appStore = useAppStore()
const { t } = useI18n()
const show = (item: VideoInterface) => {
  briefDialogRef.value.show(item)
}

onMounted(() => {
  appStore.hideToast()
})
</script>

<style scoped>
.text-button {
  font-weight: bold;
}
</style>
