import {useI18n} from "vue-i18n";

const useTemplateName = () => {
    const {t} = useI18n()
    const getName = (i) => {
        let nm

        if (i.nm && !Array.isArray(i.nm)) {
            nm = i.nm
        } else if (i.nm && Array.isArray(i.nm)) {

            /** для грузов и транспорта */
            if (i.nm.length === 2) nm = t(i.nm[0], { n: i.nm[1] })

            /** для транспорта */
            if (i.nm.length === 4) nm = t(i.nm[0], { n: i.nm[1] }) + ' + ' + t(i.nm[2], { n: i.nm[3] })

        } else {
            nm = t('templates.noname')
        }

        return nm
    }

    return {
        getName,
    }
}

export default useTemplateName;
