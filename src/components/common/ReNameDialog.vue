<template>
  <v-dialog
    v-model="dialog"
    max-width="439"
  >
    <ReName 
      :key="name"
      :name="name"
      :icon="icon"
      :color="color"
      :head="head"
      :label="label"
      @submit="submit" 
      @close="close"
    />
  </v-dialog>
</template>

<script>
import ReName from '@/components/common/ReName'
export default {
  components: {
    ReName
  },
  props: {
    icon: { 
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    head: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'common.name'
    }
  },
  data() {
    return {
      dialog: false,
      name: '',
      resolve: null,
      reject: null
    }
  },
  methods: {
    submit(name) {
      this.dialog = false
      this.resolve(name)
    },
    open(name) {
      this.dialog = true
      this.name = name

      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close() {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>