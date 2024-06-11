<template>
    <div>
        <div class="mt-1 text-center grey--text text-darken-1 text-subtitle-2 text-uppercase font-weight-regular">
            <div>{{ t('tarif.current') }}: {{ license }}</div>
            <div v-if="user.tarif.type === 2">
                {{ t('tarif.expir') }}: {{ licExpir }}
            </div>
        </div>

        <v-row dense class="mt-3 px-3">
            <v-col v-for="(plan, i) in plans" :key="i" cols="12" md="6">
                <v-card
                        class="text-body-1"
                        rounded="lg"
                        :class="plan.highlight && 'elevation-19'"
                        :dark="plan.highlight"
                        :color="plan.highlight ? 'primary darken-3' : ''"
                >
                    <v-card-text :class="plan.highlight ? 'white--text' : ''" class="mb-0 pt-4 text-center">
                        <div class="text-h6 text-md-h5 text-xl-h4 font-weight-bold text-uppercase mb-1">
                            {{ plan.title }}
                        </div>
                        <div :class="plan.highlight ? 'white--text' : 'grey--text text-darken-1'" class="overline">
                            {{ plan.subtitle }}
                        </div>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-text :class="plan.highlight ? 'white--text' : ''" class="pa-3 pb-1 text-subtitle-1">
                        <div v-for="(feat, j) in plan.features" :key="j" class="d-flex align-center my-1">
                            <v-icon v-if="feat.status" color="success" class="mr-2">bx bx-check</v-icon>
                            <v-icon v-else color="error" class="mr-2">bx bx-x</v-icon>
                            <span v-if="feat.value && feat.showvalue" class="font-weight-black mr-1">{{ feat.value }}</span>
                            <span class="font-weight-regular" :class="[!feat.status && 'grey--text text-darken-1']">{{ feat.label }}</span>
                        </div>
                    </v-card-text>

                    <v-card-actions class="px-2 pb-2">
                        <v-btn
                                v-if="plan.highlight"
                                x-large
                                block
                                rounded
                                outlined
                                dark
                                class="px-2 no-uppercase"
                                to="/user#user-payments"
                        >
                            <span>{{ t('tarif.type.1.button') }}</span>
                        </v-btn>
                        <v-btn
                                v-if="!plan.highlight"
                                x-large
                                block
                                variant="text"
                                rounded
                                disabled
                                class="px-2 no-uppercase"
                        >
                            {{ t('tarif.type.0.button') }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '../../stores/app'
import {useUserStore} from "../../stores/user";

const { t } = useI18n()
const appStore = useAppStore()
const userStore = useUserStore()

// Computed property to get the user from the store
const user = computed(() => userStore.user)

// Computed property to determine the current license
const license = computed(() => {
    if (!user.value) {
        return ''
    }
    return user.value.tarif.type ? t('tarif.type.1.title') : t('tarif.type.0.title')
})

// Computed property to format the license expiration date
const licExpir = computed(() => {
    if (!user.value) {
        return ''
    }
    if (Date.parse(user.value.tarif.expir) >= Date.now()) {
        const date = new Date(user.value.tarif.expir)
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    }
    return ''
})

// Initial plans setup
const plans = ref([
    {
        highlight: false,
        title: t('tarif.type.0.title'),
        subtitle: t('tarif.tarif'),
        features: [
            { value: 7, status: true, showvalue: true, label: t('tarif.options.items') },
            { value: 1, showvalue: true, status: true, label: t('tarif.options.project', 1) },
            { value: 0, showvalue: false, status: false, label: t('tarif.options.templates.cargo') },
            { value: 0, showvalue: false, status: false, label: t('tarif.options.templates.loads') },
            { value: 0, showvalue: false, status: false, label: t('tarif.options.cargo-size') }
        ]
    },
    {
        highlight: true,
        title: t('tarif.type.1.title'),
        subtitle: t('tarif.tarif'),
        features: [
            { value: 7000, showvalue: true, status: true, label: t('tarif.options.items') },
            { value: 300, showvalue: true, status: true, label: t('tarif.options.project', 300) },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.templates.cargo', 0) },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.templates.loads', 0) },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.pdf') },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.cargo-size') },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.loads-size') },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.transport-counts') },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.transport-many') },
            { value: 0, showvalue: false, status: true, label: t('tarif.options.move') }
        ]
    }
])

// Function to fetch and update tariff plans
const getTariffs = async () => {
    try {
        const r = await appStore.getTariffs()
        const index = [0, 1]
        const array = ['max_items', 'max_projects', 'max_cargo_t', 'max_loads_t']

        index.forEach((tp) => {
            array.forEach((i, index) => {
                plans.value[tp].features[index].value = r[tp][i]
                plans.value[tp].features[index].status = Boolean(r[tp][i])
            })
        })
    } catch (error) {
        console.error('Error fetching tariffs:', error)
    }
}

// Fetch tariffs when the component is mounted
onMounted(() => {
    getTariffs()
})
</script>
