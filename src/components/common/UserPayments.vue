<template>
  <v-card v-if="user">
    <!-- TYPE -->
    <v-row dense class="mx-1">
      <v-col cols="12" sm="6">
        <v-card
            class="rounded-lg"
            :class="type === 'expir' ? 'primary lighten-4 elevation-14' : ''"
            style="height: 100%"
            :disabled="loading"
            @click="type = 'expir'"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-button font-weight-bold pt-1">
                {{ t('payment.types.expir.head') }}
                <v-icon small>bx bx-pin</v-icon>
              </v-list-item-title>
              <v-list-item-content class="text-body-2 grey--text text-darken-2 pb-0">
                {{ t('payment.types.expir.desc') }}
              </v-list-item-content>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6">
        <v-card
            rounded="lg"
            :color="type === 'count' ? 'success lighten-3 elevation-14' : ''"
            style="height: 100%"
            :disabled="loading"
            @click="type = 'count'"
        >
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-button font-weight-bold pt-1">
                {{ t('payment.types.count.head') }}
                <v-icon small>bx bx-pin</v-icon>
              </v-list-item-title>
              <v-list-item-content class="text-body-2 grey--text text-darken-2 pb-0">
                {{ t('payment.types.count.desc') }}
              </v-list-item-content>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- BODY -->
    <v-card :disabled="loading" class="mx-2 mt-2 rounded-lg">
      <div class="d-flex align-top my-1 py-1">
        <!-- periods -->
        <div class="text-button font-weight-bold mx-2">
          Описание тарифа
        </div>
        <v-spacer></v-spacer>
        <!-- discount -->
        <v-chip
            :color="user.discount ? 'red lighten-1' : 'secondary lighten-4'"
            outlined
            class="px-2 mx-1 mt-0 font-weight-bold text-button"
        >
          <v-icon small class="pr-1">mdi-gift-outline</v-icon>
          <span class="px-1">Cкидка</span>
          <span>{{ user.discount }}%</span>
          <div v-if="user.discount">
            <span class="px-1">=</span>
            <span>{{ format.format(discountInt) }}</span>
          </div>
        </v-chip>
      </div>

      <!-- users -->
      <div v-if="usersList.length" class="mx-2">
        <v-radio-group
            v-model="users"
            :disabled="type !== 'expir' && selectedProducts?.type !== 'month'"
            row
        >
          <v-radio
              v-for="u in usersList"
              :key="u.id"
              :label="u.text"
              :value="u.id"
          ></v-radio>
        </v-radio-group>
      </div>

      <v-toolbar height="auto" flat>
        <v-chip-group v-model="tarif" :color="chipsClass" column mandatory>
          <template v-for="i in products" :key="i?.id">
            <v-chip :value="i?.id" filter outlined>
              <span class="font-weight-regular">
                {{ i.period }} {{ t('payment.period.' + i.type, { n: i.period }) }}
              </span>
              <span class="pl-1">
                <div>
                  <v-icon small>bx bx-user</v-icon>
                  {{ usersSelected?.text ? usersSelected.text : 1 }}
                </div>
              </span>
              <span class="pl-1"> / {{ format.format(i.price) }}</span>
            </v-chip>
          </template>
        </v-chip-group>
      </v-toolbar>

      <!-- amount -->
      <div class="d-flex mx-2 pb-2 font-weight-light">
        <v-spacer></v-spacer>
        <div>
          <div class="text-right">итого к оплате</div>
          <div class="text-h4 py-1 font-weight-light">
            {{ format.format(toPayDiscount) }}
          </div>
        </div>
      </div>
    </v-card>

    <!-- BUTTONS -->
    <div class="pt-2 mx-2 text-right">
      <v-btn
          color="primary"
          rounded
          large
          class="px-3 font-weight-regular"
          :disabled="!tarif || loading"
          @click="dataDialog = true"
      >
        Выписать счет
      </v-btn>
    </div>

    <!-- DIALOG -->
    <v-dialog v-model="dialog" max-width="590" persistent>
      <v-card rounded="lg" class="pa-2">
        <v-row dense>
          <v-col v-if="!mobile" cols="auto" class="align-center">
            <!--logo -->
            <v-img
                :src="require('@/assets/images/jets/start.svg')"
                max-width="128"
                min-height="128"
                alt="You are lucky!"
                class="mt-2 mx-2"
                style="margin:0 auto"
            ></v-img>
          </v-col>
          <v-col>
            <h4 class="text-uppercase justify-center text-center">
              Спасибо за заказ
            </h4>
            <div class="grey--text text-body-1 text-darken-3 font-weight-regular text-center self-justify-center">
              <div class="my-1 text-center">{{ t('payment.valid.company.submit', { email: e.value }) }}</div>
            </div>
          </v-col>
        </v-row>
      </v-card>
      <div class="d-flex align-bottom mt-2">
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            rounded
            class="font-weight-medium px-2"
            @click="dialog = false"
        >
          {{ t('common.ok') }}
        </v-btn>
      </div>
    </v-dialog>

    <!-- USER DATA -->
    <v-dialog v-model="dataDialog" max-width="590" persistent>
      <v-card rounded="lg" class="px-1">
        <div class="d-flex align-center">
          <!-- PAY DATA HEADER -->
          <div class="text-button font-weight-bold my-1 mx-1">
            {{ t('payment.userdata.label') }}
          </div>
          <v-spacer></v-spacer>
          <v-btn icon color="red" @click="dataDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <!-- FORM -->
        <v-form ref="form" v-model="valid" :disabled="loading" class="pb-1">
          <!-- RESIDENT OF COMPANY -->
          <v-radio-group v-model="c.redn" row dense class="mx-2">
            <v-radio :value="true">
              <template #label>
                <div>{{ t('payment.userdata.resident.in') }}</div>
              </template>
            </v-radio>
            <v-radio :value="false">
              <template #label>
                <div>{{ t('payment.userdata.resident.out') }}</div>
              </template>
            </v-radio>
          </v-radio-group>

          <v-row dense class="mt-1 mx-2">
            <v-scale-transition>
              <v-col v-if="c.redn" cols="12">
                <v-row dense>
                  <v-col>
                    <v-text-field
                        v-model="c.regn"
                        :label="t('payment.userdata.inn.label')"
                        :rules="[rules.required]"
                        dense
                        required
                        clearable
                        type="text"
                        @keypress="NumbersOnly"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn
                        outlined
                        color="primary"
                        block
                        rounded
                        :disabled="loading || !c.regn"
                        @click="getDataByRegn"
                    >
                      Заполнить поля по ИНН
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-scale-transition>

            <v-col cols="12">
              <v-text-field
                  v-model="c.name"
                  :label="t('payment.userdata.name.label')"
                  :rules="[rules.required]"
                  dense
                  required
                  clearable
                  type="text"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                  v-model="c.address"
                  :label="t('payment.userdata.address.label')"
                  :rules="[rules.required]"
                  dense
                  required
                  clearable
                  type="text"
              ></v-text-field>
            </v-col>

            <v-col v-if="c.redn" cols="12 d-none">
              <v-text-field
                  v-model="c.ogrn"
                  :label="t('payment.userdata.ogrn.label')"
                  dense
                  type="text"
                  @keypress="NumbersOnly"
              ></v-text-field>
            </v-col>

            <v-scale-transition>
              <v-col v-if="!c.redn" cols="12">
                <v-textarea
                    v-model="c.longtext"
                    :label="t('payment.userdata.longtext.label')"
                    dense
                    auto-grow
                    clearable
                ></v-textarea>
              </v-col>
            </v-scale-transition>

            <!-- EMAIL -->
            <v-col v-if="e.show" cols="12">
              <v-text-field
                  v-model="e.value"
                  label="Email"
                  :rules="[rules.required, rules.email]"
                  dense
                  required
                  clearable
                  type="email"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>

        <div class="d-flex justify-center py-2 px-2">
          <v-btn
              block
              color="primary"
              rounded
              large
              class="font-weight-medium px-2"
              :disabled="loading"
              @click="validate"
          >
            Выписать счет
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores/app'
import { useCargoStore } from '@/stores/cargo'
import { useDisplay } from 'vuetify'
import {useUserStore} from "../../stores/user";

const { t } = useI18n()
const appStore = useAppStore()
const cargoStore = useCargoStore()
const userStore = useUserStore()
const { mobile } = useDisplay()

const type = ref('expir')
const tarif = ref(null)
const users = ref(null)
const valid = ref(false)
const typeUserPayment = ref(1)
const dialog = ref(false)
const dataDialog = ref(false)

const loading = computed(() => appStore.loading)
const user = computed(() => userStore.user)

const c = ref({
  redn: true,
  name: null,
  regn: null,
  ogrn: null,
  address: null,
  manager: null,
  longtext: null,
})

const e = ref({
  value: null,
  show: true,
})

const rules = {
  required: (value: string) => !!value || t('common.validation.required'),
  email: (value: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || t('common.validation.email')
  },
}

const formatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
})

const format = formatter

const chipsClass = computed(() => {
  return type.value === 'count' ? 'success accent-4' : 'primary accent-4'
})

const products = computed(() => {
  const p = tarifList.value[type.value]
  if (!p.length) return []
  return p.map((i) => {
    const o = {
      id: i.id,
      type: i.type,
      price: i.price,
      period: i.period,
    }
    if (users.value !== 1 && usersSelected.value?.price) {
      o.price = Math.round(o.price + usersSelected.value.price * o.period)
    }
    return o
  })
})

const selectedProducts = computed(() => {
  if (appStore.loading && !tarif.value) return { id: 0, pay: null, type: null }
  if (tarif.value) return tarifList.value[type.value].filter((i) => String(i.id) === String(tarif.value))[0]
  return { id: 0, pay: null, type: null }
})

const toPay = computed(() => {
  if (!selectedProducts.value.price) return null
  let { price } = selectedProducts.value
  if (usersSelected.value) price += selectedProducts.value.period * usersSelected.value.price
  return Number(price)
})

const discountInt = computed(() => {
  if (!toPay.value || !appStore.user.discount) return 0
  return Math.round(toPay.value * (appStore.user.discount / 100))
})

const toPayDiscount = computed(() => {
  if (!toPay.value) return 0
  return Number(toPay.value - discountInt.value)
})

const usersList = computed(() => {
  if (!tarifList.value.optns.length) return []
  return tarifList.value.optns
})

const usersSelected = computed(() => {
  if (!usersList.value.length || !users.value) return null
  return usersList.value.filter((i) => String(i.id) === String(users.value))[0]
})

const tarifList = ref({
  count: [],
  expir: [],
  optns: [],
})

watch(type, () => {
  users.value = 1
  tarif.value = tarifList.value[type.value][0].id
})

watch(typeUserPayment, (type) => {
  if (!type) valid.value = true
})

const getPaymentsList = async () => {
  const r = await cargoStore.getPaymentsList()
  const { expir, count } = r

  r.expir = expir.sort((e1, e2) => (e1.price > e2.price ? 1 : -1))
  r.count = count.sort((e1, e2) => (e1.price > e2.price ? 1 : -1))

  const types = ['count', 'expir']

  types.forEach((type) => {
    if (r[type].length) {
      r[type].forEach((i) => {
        tarifList.value[type].push({
          id: i.id,
          type: i.type,
          price: i.price,
          period: i.period,
          text: '',
        })
      })
    }
  })

  if (r.users.length) {
    r.users = r.users.sort((a, b) => (a.price > b.price ? 1 : -1))
    r.users.forEach((i) => {
      tarifList.value.optns.push({
        id: Number(i.id),
        type: i.type,
        price: Number(i.price),
        period: Number(i.period),
        text: `${i.period} ${t('payment.period.' + i.type, { n: i.period })}`,
      })
    })
  }

  tarifList.value.optns.unshift({
    id: 1,
    type: 'users',
    price: 0,
    period: 1,
    text: `1 ${t('payment.period.users', { n: 1 })}`,
  })

  users.value = 1
  appStore.setLoading(false)
}

const getConfig = async () => {
  const r = await cargoStore.getConfig()
  const { company, user } = r
  const { email } = user
  const { redn, name, regn, ogrn, address, manager, longtext } = company

  if (rules.required(email) && rules.email(email)) {
    e.value = email
  } else {
    e.show = true
  }

  c.value = {
    redn: redn !== null ? redn : true,
    name: name || null,
    regn: regn || null,
    ogrn: ogrn || null,
    address: address || null,
    manager: manager || null,
    longtext: longtext || null,
  }

  appStore.setLoading(false)
}

const validate = async () => {
  if (!form.value.validate()) {
    appStore.showError(t('item.message.form_error'))
    return
  }

  const data = {
    types: typeUserPayment.value ? 'company' : 'default',
    prods: tarif.value,
    optns: [],
    email: e.value,
    company: null,
  }

  if (users.value && users.value !== 1) data.optns.push(users.value)

  if (typeUserPayment.value === 1) data.company = { ...c.value }

  dataDialog.value = false

  const r = await cargoStore.postPayments(data)
  if (typeUserPayment.value) {
    if (r?.data?.msorder) dialog.value = true
    else appStore.showError(t('payment.valid.default.error'))
  } else {
    if (r.data.redirect) window.location.replace(r.data.redirect)
    else appStore.showError(t('payment.valid.default.error'))
  }
}

const NumbersOnly = (evt: KeyboardEvent) => {
  evt = evt || window.event
  const charCode = evt.which || evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
    evt.preventDefault()
  }
  return true
}

const getDataByRegn = async () => {
  if (!c.value.regn) {
    appStore.showError(t('payment.userdata.data.error.inn'))
    return
  }

  const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/findById/party'
  const token = '669c0e8dacfa788e342c0a9ba47cb849248e7f93'

  const users = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      query: c.value.regn,
      count: 2,
    }),
  }

  const result = await fetch(url, users).then((response) => response.json())

  appStore.hideToast()

  if (!result?.suggestions?.length) {
    appStore.showError(t('$vuetify.dataIterator.noResultsText'))
    return
  }

  const [i] = result.suggestions
  const { value, data } = i
  const { inn, ogrn, address, management } = data
  const { value: addr } = address
  const { name: dirr } = management

  c.value = {
    redn: true,
    name: value,
    regn: inn,
    ogrn: ogrn,
    address: addr,
    manager: dirr,
    longtext: null,
  }
}

onMounted(() => {
  getPaymentsList()
  appStore.setLoading(true)
  getConfig()
})
</script>
