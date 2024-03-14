<template>
  <v-dialog
    v-model="dialog"
    max-width="560px"
    @click:outside="close()"
  >
    <div class="text-right pb-1">
      <v-btn
        icon
        color="white"
        @click="close()"
      >
        <v-icon>bx bx-x</v-icon>
      </v-btn>
    </div>

    <v-card>

      <LazyYoutube
        ref="youtube"
        max-width="560px"
        :src="url"
      />

    </v-card>
  </v-dialog>
</template>

<script>
import { LazyYoutube } from 'vue-lazytube'

export default {
  name: 'BriefDialog',
  components: {
    LazyYoutube
  },
  data() {    
    return {
      dialog: false,
      url: null
    }
  },

  methods: {
    show(url) {
      if (!url) return

      this.url = url

      this.dialog = true
    },

    close() {
      this.$refs.youtube.stopVideo()
      this.dialog = false
    }

  }
}
</script>
