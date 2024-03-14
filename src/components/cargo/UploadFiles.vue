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
        <template v-if="!uploadedFiles.length" >
          <div class="text-center dropzone py-2 mt-2">
            <v-icon :class="[dragover && 'mb-2']" size="60">
              mdi-cloud-upload
            </v-icon>
            <div class="text-caption text-uppercase">
              {{ $t('import.uploadfile.action') }}
            </div>
            <div class="text-caption text-uppercase">
              {{ $tc('import.uploadfile.filelimit', 1) }}
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
        <v-list 
          v-if="uploadedFiles.length > 0"
          rounded
          class="my-3 mb-4"
        >

          <template v-for="item in uploadedFiles">
            <v-list-item :key="item.name" class="primary lighten-4">
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ $tc('import.uploadfile.fileready', 1) }}
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action class="justify-end">
                <v-btn icon @click.stop="removeFile()">
                  <v-icon> mdi-close-circle </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>

        </v-list>
      </v-scale-transition>

    </div>    
  </div>

</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Upload',
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dragover: false,
      uploadedFiles: []
    }
  },
  methods: {
    ...mapActions('app', ['showError']),

    removeFile() {
      this.uploadedFiles = []

      this.$emit('filesClean')
    },

    onDrop(e, type) {
      let files

      switch (type) {
      case 'input':
        files = e.target.files
        break
      default:
        files = e.dataTransfer.files
      }

      // если нет файлов возврат ошибки
      if (!files.length) return this.showError(this.$t('import.file.empty'))

      // если файлов больше чем 1 возврат ошибки
      if (!this.multiple && files.length > 1) return this.showError(this.$t('import.file.nomulti')) 
      
      // если размер файла больше лимита
      if (!files[0].size > 1000000) return this.showError(this.$tc('import.file.limsize', 1, { n: 1 }))

      // 
      this.dragover = false

      // If there are already uploaded files remove them
      if (this.uploadedFiles.length > 0) this.uploadedFiles = []

      // Add each file to the array of uploaded files
      this.uploadedFiles.push(files[0])

      this.$emit('filesUploaded', this.uploadedFiles[0]) 

      return false
    }
  }
}
</script>

<style scoped>
.dropzone {
  position:relative;
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