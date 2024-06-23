import {computed} from "vue";
import {nm, ln, wd, hg, wg, cn, pg, st, lm, rt, ov, tt , pp, ex , tp , ax} from "../configs/items";
import { getWght, getSize } from '@/configs/functions/getunits.js'
import {useI18n} from "vue-i18n";

const useValidateFields = () => {

    const {t} = useI18n()

    const start = {
        nm, ln, wd, hg, wg, cn, pg, st, lm, rt, ov, tt , pp , ex , tp , ax
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

  const pn2Values = computed(() => {
    return {
      min: {
        0: getWght(start.pp.n2.min, '0'),
        1: getWght(start.pp.n2.min, '1')
      },
      max: {
        0: getWght(start.pp.n2.max, '0'),
        1: getWght(start.pp.n2.max, '1')
      }
    }
  })

  const pn2maxValues = computed(() => {
    return {
      min: {
        0: getWght(start.pp.n2max.min, '0'),
        1: getWght(start.pp.n2max.min, '1')
      },
      max: {
        0: getWght(start.pp.n2max.max, '0'),
        1: getWght(start.pp.n2max.max, '1')
      }
    }
  })

  const pl3Values = computed(() => {
    return {
      min: {
        0: getSize(start.pp.l3.min, '0'),
        1: getSize(start.pp.l3.min, '1'),
        2: getSize(start.pp.l3.min, '2')
      },
      max: {
        0: getSize(start.pp.l3.max, '0'),
        1: getSize(start.pp.l3.max, '1'),
        2: getSize(start.pp.l3.max, '2')
      }
    }
  })

  const pl2Values = computed(() => {
    return {
      min:{
        0: getSize(start.pp.l2.min, '0'),
        1: getSize(start.pp.l2.min, '1'),
        2: getSize(start.pp.l2.min, '2')
      },
      max: {
        0: getSize(start.pp.l2.max, '0'),
        1: getSize(start.pp.l2.max, '1'),
        2: getSize(start.pp.l2.max, '2')
      }
    }
  })

  const pwgValues = computed(() => {
    return {
      min: {
        0: getWght(start.pp.wg.min, '0'),
        1: getWght(start.pp.wg.min, '1')
      },
      max: {
        0: getWght(start.pp.wg.max, '0'),
        1: getWght(start.pp.wg.max, '1')
      }
    }
  })

  const tn1maxValues = computed(() => {
    return {
      min: {
        0: getWght(start.tt.n1max.min, '0'),
        1: getWght(start.tt.n1max.min, '1')
      },
      max: {
        0: getWght(start.tt.n1max.max, '0'),
        1: getWght(start.tt.n1max.max, '1')
      }
    }
  })

  const tn1Values = computed(() => {
    return {
      min: {
        0: getWght(start.tt.n1.min, '0'),
        1: getWght(start.tt.n1.min, '1')
      },
      max: {
        0: getWght(start.tt.n1.max, '0'),
        1: getWght(start.tt.n1.max, '1')
      }
    }
  })

  const tn2maxValues = computed(() => {
    return {
      min: {
        0: getWght(start.tt.n2max.min, '0'),
        1: getWght(start.tt.n2max.min, '1')
      },
      max: {
        0: getWght(start.tt.n2max.max, '0'),
        1: getWght(start.tt.n2max.max, '1')
      }
    }
  })

  const tn2Values = computed(() => {
    return {
      min: {
        0: getWght(start.tt.n2.min, '0'),
        1: getWght(start.tt.n2.min, '1')
      },
      max: {
        0: getWght(start.tt.n2.max, '0'),
        1: getWght(start.tt.n2.max, '1')
      }
    }
  })

  const tlValues = computed(() => {
    return {
      min: {
        0: getSize(start.tt.l.min, '0'),
        1: getSize(start.tt.l.min, '1'),
        2: getSize(start.tt.l.min, '2')
      },
      max: {
        0: getSize(start.tt.l.max, '0'),
        1: getSize(start.tt.l.max, '1'),
        2: getSize(start.tt.l.max, '2')
      }
    }
  })

  const tl1Values = computed(() => {
    return {
      min: {
        0: getSize(start.tt.l1.min, '0'),
        1: getSize(start.tt.l1.min, '1'),
        2: getSize(start.tt.l1.min, '2')
      },
      max: {
        0: getSize(start.tt.l1.max, '0'),
        1: getSize(start.tt.l1.max, '1'),
        2: getSize(start.tt.l1.max, '2')
      }
    }
  })

  const twgValues = computed(() => {
    return {
      min: {
        0: getWght(start.tt.wg.min, '0'),
        1: getWght(start.tt.wg.min, '1')
      },
      max: {
        0: getWght(start.tt.wg.max, '0'),
        1: getWght(start.tt.wg.max, '1')
      }
    }
  })

    return {
        lnValues,
        lmValues,
        wgValues,
        hgValues,
        wdValues,
        twgValues,
        tl1Values,
        tlValues,
        tn2Values,
        tn2maxValues,
        tn1Values,
        tn1maxValues,
        pwgValues,
        pl2Values,
        pl3Values,
        pn2maxValues,
        pn2Values,
    }
};

export default useValidateFields;
