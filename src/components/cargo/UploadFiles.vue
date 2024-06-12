<template>
  <div
      :class="{ 'primary lighten-4': dragover }"
      @drop.prevent="onDrop($event, 'drop')"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
  >
    <div>
      <v-fade-transition hide-on-leave>
        <template v-if="!uploadedFiles.length">
          <div class="text-center dropzone py-2 mt-2">
            <v-icon :class="[dragover && 'mb-2']" size="60">
              mdi-cloud-upload
            </v-icon>
            <div class="text-caption text-uppercase">
              {{ t('import.uploadfile.action') }}
            </div>
            <div class="text-caption text-uppercase">
              {{ t('import.uploadfile.filelimit') }}
            </div>
            <input
                type="file"
                :multiple="multiple"
                accept=".csv, .xlsx"
                @change="onDrop($event, 'input')"
            >
          </div>
        </template>
      </v-fade-transition>

      <v-scale-transition hide-on-leave>
        <v-list v-if="uploadedFiles.length > 0" rounded class="my-3 mb-4">
          <template v-for="item in uploadedFiles" :key="item.name">
            <v-list-item class="primary lighten-4">
              <v-list-item>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ t('import.uploadfile.fileready') }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item-action class="justify-end">
                <v-btn @click.stop="removeFile">
                  <v-icon>{{ icons.close }}</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-scale-transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import icons from "../../configs/constants/icons";

const { t } = useI18n()
const appStore = useAppStore()

const dragover = ref(false)
const uploadedFiles = ref([])

const emit = defineEmits(['filesClean', 'filesUploaded'])

const multiple = defineProps({
  multiple: {
    type: Boolean,
    default: false,
  },
})

const removeFile = () => {
  uploadedFiles.value = []
  emit('filesClean')
}

const onDrop = (e, type) => {
  let files

  switch (type) {
    case 'input':
      files = e.target.files
      break
    default:
      files = e.dataTransfer.files
  }

  if (!files.length) return appStore.showError(t('import.file.empty'))

  if (!multiple.multiple && files.length > 1) return appStore.showError(t('import.file.nomulti'))

  if (files[0].size > 1000000) return appStore.showError(t('import.file.limsize'))

  dragover.value = false

  if (uploadedFiles.value.length > 0) uploadedFiles.value = []

  uploadedFiles.value.push(files[0])

  emit('filesUploaded', uploadedFiles.value[0])

  return false
}
</script>

<style scoped>
.dropzone {
  position: relative;
  border: 2px dashed #eee;
}
.dropzone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>
