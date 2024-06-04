const useTemplateName = () => {
  const getName = (i) => {
      let nm

        if (i.nm && !Array.isArray(i.nm)) {
            nm = i.nm
        } else if (i.nm && Array.isArray(i.nm)) {

            /** для грузов и транспорта */
            if (i.nm.length === 2) nm = this.$t(i.nm[0], { n: i.nm[1] })

            /** для транспорта */
            if (i.nm.length === 4) nm = this.$t(i.nm[0], { n: i.nm[1] }) + ' + ' + this.$t(i.nm[2], { n: i.nm[3] })

        } else {
            nm = this.$t('templates.noname')
        }

        return nm
  }

  return {
      getName,
  }
}

export default useTemplateName;
