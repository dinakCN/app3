<template>
  <span>

    <v-btn 
      icon
      @click.stop="brief()"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
          >
            bx-help-circle
          </v-icon>
        </template>
        <span class="text-caption">{{ $t('common.help') }}</span>
      </v-tooltip>
    </v-btn>

    <!-- BRIEF -->
    <brief-dialog ref="briefs" />

  </span>
</template>

<script>
import links from '@/configs/video.js'

export default {
  name: 'Help',
  components: {
    BriefDialog: () => import(/* webpackPrefetch: true */'@/components/common/BriefDialog.vue')
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      v: links
    }
  },  
  methods: {
    brief() {
      const current = this.v.find((i) => i.page.includes(String(this.$route.name)))

      if (current?.link) this.$refs.briefs.show(current.link)
    }
  }
}  
</script>          