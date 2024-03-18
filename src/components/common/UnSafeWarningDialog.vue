<template>
  <v-dialog
    v-model="dialog"
    max-width="590"
    persistent
  >
    <v-card rounded="lg" class="pa-1">

      <v-card-title class="text-h5 error--text text-justify-center text-center">
        Предупреждение
      </v-card-title>

      <div class="d-flex">

        <div :class="$vuetify.breakpoint.mobile ? 'd-none' : 'd-block'">

          <!--Icon -->
          <v-img
            :src="require('@/assets/images/jets/repair.svg')"
            max-width="256"
            min-height="256"
            alt="calculate error"
            class="mt-2"
            style="margin:0 auto"
          ></v-img>
        </div>

        <div>

          <v-card-text class="grey--text text-darken-3 font-weight-regular">

            <div class="mt-1">После изменения данных проект будет полностью пересчитан</div>
            <div class="mt-1 font-weight-bold">Грузовые места перемещаемые вручную потеряют изменят свое положение</div>

          </v-card-text>

        </div>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="grey darken-3"
          text
          class="font-weight-medium"
          @click="close"
        >
          Отменить
        </v-btn>

        <v-btn
          rounded
          color="primary"
          to="/user#user-tarif"
          class="px-2 font-weight-medium"
          type="submit"
        >
          Продолжить
        </v-btn>

      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UnSafeWarning',
  data() {
    return {
      dialog: false
    }
  },
  methods: {

    submit() {
      this.dialog = false
      this.resolve(this.select)
    },

    open() {
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
