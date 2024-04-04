import * as validators from '@vuelidate/validators'
import i18n from './vue-i18n.ts'

const { createI18nMessage } = validators
const withI18nMessage = createI18nMessage({ t: i18n.global.t.bind(i18n) })

export const required = withI18nMessage(validators.required)
export const minLength = withI18nMessage(validators.minLength, { withArguments: true })
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true })
export const minValue = withI18nMessage(validators.minValue, { withArguments: true })
export const maxValue = withI18nMessage(validators.maxValue, { withArguments: true })
export const integer = withI18nMessage(validators.integer)
export const decimal = withI18nMessage(validators.decimal)
export const numeric = withI18nMessage(validators.numeric)
export const alphaNum = withI18nMessage(validators.alphaNum)
