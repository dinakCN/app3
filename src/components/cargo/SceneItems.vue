<template>
  <span>    
    <v-list-item
      :id="id"
      dense
      link
      class="px-1"
      @click="$emit('selectedOnDrawer', id)"
    >   

      <v-list-item-avatar class="mx-2" :color="color">
        <v-icon 
          v-if="icon"
          color="grey darken-4"
          rounded
        >
          {{ icon }}
        </v-icon>

        <slot name="icon"></slot>

      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title class="body-2 font-weight-medium text-truncate grey--text text--darken-3">
          
          <span v-if="Number(id) < 10000">{{ id }}</span><span v-else>{{ sb }}</span>. {{ name }}

          <slot name="name"></slot>

        </v-list-item-title>
        <v-list-item-subtitle class="text-truncate font-weight-regular"> 
          
          {{ text }}

          <slot name="text"></slot>         

        </v-list-item-subtitle>

        <slot name="subline"></slot>
        <slot name="adds"></slot> 
          
      </v-list-item-content>

    </v-list-item>    
    
  </span>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    sb: {
      type: Number,
      default: 10001
    },
    color: {
      type: String,
      default: '#cccccc'
    },
    name: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'bx-square'
    },
    select: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    select(a) {
      if (a) this.ripple(document.getElementById(this.id))
    }
  },
  methods: {

    ripple($el) {
      const ev = new Event('mousedown')
      const offset = $el.getBoundingClientRect()

      ev.clientX = offset.left + offset.width / 2
      ev.clientY = offset.top + offset.height / 2

      $el.dispatchEvent(ev)

      setTimeout(() => {
        $el.dispatchEvent(new Event('mouseup'))
      }, 550)
    }

  }
}
</script>
