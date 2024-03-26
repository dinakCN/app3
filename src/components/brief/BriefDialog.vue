<template>
  <v-dialog
    v-model="dialog.open"
    max-width="560px"
    @click:outside="close()"
  >
    <div class="text-right pb-1">
      <v-btn
        icon
        color="white"
        @click="close()"
      >
        <v-icon>mdi:mdi mdi-close</v-icon>
      </v-btn>
    </div>

    <v-card>

      <!-- <LazyYoutube
        ref="youtube"
        max-width="560px"
        :src="url"
      /> -->

    </v-card>
  </v-dialog>
</template>

<script
  lang="ts"
  setup
>
import { ref, reactive } from "vue"
// import { LazyYoutube } from 'vue-lazytube'

const dialog = reactive({
  open: false
})

const url = ref('')

const show = (url: string) => {
  if (!url) return

  url = url

  dialog.open = true
}

const close = () => {
  // this.$refs.youtube.stopVideo()
  dialog.open = false
}
</script>
