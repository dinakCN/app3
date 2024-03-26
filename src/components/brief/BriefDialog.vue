<template>
  <v-dialog
    v-model="dialog.open"
    max-width="560px"
    @click:outside="close()"
  >
    <v-card
      width="100%"
      prepend-icon="mdi-update"
      text="Your application will relaunch automatically after the update is complete."
      title="Update in progress"
    >
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="Close"
          @click="close()"
        ></v-btn>
      </template>

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
