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
        <div :class="mobile ? 'd-none' : 'd-block'">
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
            <div class="mt-1">
              После изменения данных проект будет полностью пересчитан
            </div>
            <div class="mt-1 font-weight-bold">
              Грузовые места перемещаемые вручную потеряют изменят свое положение
            </div>
          </v-card-text>
        </div>
      </div>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
            color="grey darken-3"
            variant="text"
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
            @click="submit"
        >
          Продолжить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useDisplay} from "vuetify";

const {mobile} = useDisplay()

const dialog = ref(false)
const state = reactive({
  resolve: null as any,
  reject: null as any
})

const open = (): Promise<boolean> => {
  dialog.value = true
  return new Promise((resolve, reject) => {
    state.resolve = resolve
    state.reject = reject
  })
}

const close = () => {
  dialog.value = false
  state.resolve(false)
}

const submit = () => {
  dialog.value = false
  state.resolve(true)
}

defineExpose({
  open,
  close
})
</script>

<style scoped>
.v-card-title {
  color: red;
  text-align: center;
}
.v-card-actions {
  justify-content: flex-end;
}
</style>
