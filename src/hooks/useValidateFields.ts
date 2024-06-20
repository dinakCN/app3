import {computed} from "vue";
import {cn, hg, lm, ln, nm, ov, pg, rt, st, wd, wg} from "../configs/items";
import { getWght, getSize } from '@/configs/functions/getunits.js'
import {useI18n} from "vue-i18n";

const useValidateFields = () => {

    const {t} = useI18n()

    const start = {
        nm, ln, wd, hg, wg, cn, pg, st, lm, rt, ov
    }

    const lnValues = {
        min: {
            '0': getSize(start.ln.min, '0'),
            '1': getSize(start.ln.min, '1'),
            '2': getSize(start.ln.min, '2'),
        },
        max: {
            '0': getSize(start.ln.max, '0'),
            '1': getSize(start.ln.max, '1'),
            '2': getSize(start.ln.max, '2'),
        },
    }

    const wdValues = {
        min: {
            '0': getSize(start.wd.min, '0'),
            '1': getSize(start.wd.min, '1'),
            '2': getSize(start.wd.min, '2'),
        },
        max: {
            '0': getSize(start.wd.max, '0'),
            '1': getSize(start.wd.max, '1'),
            '2': getSize(start.wd.max, '2'),
        },
    }

    const hgValues = {
        min: {
            '0': getSize(start.hg.min, '0'),
            '1': getSize(start.hg.min, '1'),
            '2': getSize(start.hg.min, '2'),
        },
        max: {
            '0': getSize(start.hg.max, '0'),
            '1': getSize(start.hg.max, '1'),
            '2': getSize(start.hg.max, '2'),
        },
    }

    const wgValues = {
        min: {
            '0': getWght(start.wg.min, '0'),
            '1': getWght(start.wg.min, '1'),
        },
        max: {
            '0': getWght(start.wg.max, '0'),
            '1': getWght(start.wg.max, '1'),
        },
    }

    const lmValues = {
        min: {
            '0': getWght(start.lm.min, '0'),
            '1': getWght(start.lm.min, '1'),
        },
        max: {
            '0': getWght(start.lm.max, '0'),
            '1': getWght(start.lm.max, '1'),
        },
    }

    const dataErrors = (data, min, max, unit = '', required = true) => {
        const errors = []

        if (!data.$dirty) return errors
        if (required) !data.required && errors.push(t('common.validation.required'))
        !data.decimal && errors.push(t('common.validation.decimal'))
        !data.minValue && errors.push(t('common.validation.minValue') + ' ' + min + ' ' + unit)
        !data.maxValue && errors.push(t('common.validation.maxValue') + ' ' + max + ' ' + unit)

        return errors
    }

    const nameErrors = (data) => {
        const errors = []
        if (!data.$dirty) return errors
        !data.maxLength && errors.push(t('common.validation.maxLength') + ' ' + start.nm.max)
        !data.required && errors.push(t('common.validation.required'))

        return errors
    }

    const countErrors = (data, min, max) => {
        const errors = []

        if (!data.$dirty) return errors
        !data.required && errors.push(t('common.validation.required'))
        !data.integer && errors.push(t('common.validation.integer'))
        !data.minValue && errors.push(t('common.validation.minValue') + ' ' + min)
        !data.maxValue && errors.push(t('common.validation.maxValue') + ' ' + max)

        return errors
    }

    const selectErrors = (data) => {
        const errors = []

        if (!data.$dirty) return errors
        !data.required && errors.push(t('common.validation.required'))

        return errors
    }

    return {
        dataErrors,
        selectErrors,
        countErrors,
        nameErrors,
        lnValues,
        lmValues,
        wgValues,
        hgValues,
        wdValues,
    }
};

export default useValidateFields;
