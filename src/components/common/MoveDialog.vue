<template>
  <v-dialog
    v-model="dialog"
    max-width="439"
  >
    <v-card
      class="rounded-lg"
    >
      <v-subheader>
        {{ $t('cargo.move.header') }}
      </v-subheader>

      <v-form @submit.prevent="submit">
        <v-card-text class="pb-0">
          <v-select
            v-model="select"
            :items="points"
            :label="$t('common.select')"
            required
            dense
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary lighten-1"
            text
            @click="close"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary lighten-1"
            text
            type="submit"
          >
            {{ $t('common.ok') }}
          </v-btn>
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MoveDialog',
  data() {
    return {
      dialog: false,
      select: null,
      clid: null
    }
  },
  computed: {
    ...mapGetters('cargo', ['getPoints', 'getPointOrder']),
    points() {
      const pointsList = this.getPoints.map((i) => {
        const order = this.getPointOrder[i.id] ? this.getPointOrder[i.id] + '.' : this.$t('common.off')

        return { text: order + ': ' + i.name, value: i.id, disabled: Boolean(String(i.id) === String(this.clid)) }
      })

      pointsList.push({ text: '... ' + this.$t('cargo.move.new').toLowerCase(), value: 'new', disabled: false })

      return pointsList
    }
  },
  methods: {
    submit() {
      this.dialog = false
      this.resolve(this.select)
    },
    open(clid) {
      this.clid = clid
      this.dialog = true

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
// lang ok