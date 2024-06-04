<template>
  <v-dialog
    v-model="dialog"
    max-width="439"
  >
    <v-card
      class="rounded-lg"
    >
      <v-subheader>
        {{ t('cargo.move.header') }}
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
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary lighten-1"
            text
            type="submit"
          >
            {{ t('common.ok') }}
          </v-btn>
        </v-card-actions>
      </v-form>

    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
    import {computed, ref} from "vue";
    import {useCargoStore} from "../../stores/cargo";
    import {useI18n} from "vue-i18n";

    const cargoStore = useCargoStore()
    const {t} = useI18n()

    const dialog = ref(false)
    const select = ref(null)
    const clid = ref(null)
    const points = computed(() => {
      const pointsList = cargoStore.points.map((i) => {
        const order = cargoStore.pointOrder[i.id] ? cargoStore.pointOrder[i.id] + '.' : t('common.off')

        return { text: order + ': ' + i.name, value: i.id, disabled: Boolean(String(i.id) === String(clid)) }
      })

      pointsList.push({ text: '... ' + t('cargo.move.new').toLowerCase(), value: 'new', disabled: false })

      return pointsList
    })
    const submit = () => {
      dialog.value = false
    }
    const open = (clid) => {
      clid.value = clid
      dialog.value = true
    }
    const close = () => {
      dialog.value = false
    }
</script>
// lang ok
