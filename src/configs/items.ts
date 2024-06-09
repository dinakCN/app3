const tp = {
  val: 0,
  default: [
    { text: 'area.tp.0', value: 0 },
    { text: 'area.tp.1', value: 1 },
    { text: 'area.tp.2', value: 2 },
    // { text: 'area.tp.3', value: 3 },
    // { text: 'area.tp.4', value: 4 }
    // { text: 'area.tp.5', value: 5 },
    // { text: 'area.tp.6', value: 6 },
    { text: 'area.tp.7', value: 7 }
  ]
}

const st = {
  val: 3,
  default: [
    { text: 'item.st.0', value: 0 },
    { text: 'item.st.3', value: 3 },
    { text: 'item.st.1', value: 1 },
    { text: 'item.st.2', value: 2 }    
  ]
}

const stList = st.default.map((i) => i.value)
const stByValue = st.default.reduce((o, i) => {

  o[i.value] = i.text

  return o
}, {})

/**
 * '0': 'Ящик',
 * '1': 'Паллет',
 * '2': 'Коробка'
 */

const pg = {
  val: 2,
  default: [
    { text: 'item.pg.0', value: 0 },
    { text: 'item.pg.1', value: 1 },
    { text: 'item.pg.2', value: 2 }
  ]
}

const pgList = pg.default.map((i) => i.value)
const pgByValue = pg.default.reduce((o, i) => {
  
  o[i.value] = i.text

  return o
}, {})

const cn = {
  val: 1,
  min: 1,
  max: 7000
}
const lm = {
  val: 0,
  min: 0,
  max: 50000000
}
const wg = {
  val: null,
  min: 0.1,
  max: 50000000
}
const hg = {
  val: null,
  min: 10,
  max: 50000
}
const wd = {
  val: null,
  min: 10,
  max: 50000
}
const ln = {
  val: null,
  min: 10,
  max: 500000
}
// name
const nm = {
  val: '',
  min: 1,
  max: 110
}

// rotate
const rt = {
  val: 1,
  default: [
    { text: 'item.rt.0', value: 0 },
    { text: 'item.rt.1', value: 1 }
  ]
}

const rtList = rt.default.map((i) => i.value)
const rtByValue = rt.default.reduce((o, i) => {
  
  o[i.value] = i.text

  return o
}, {})

// кантовать 
const ov = {
  val: 0,
  default: [
    { text: 'item.rt.0', value: 0 },
    { text: 'item.rt.1', value: 1 }
  ]
}

const ovList = ov.default.map((i) => i.value)
const ovByValue = ov.default.reduce((o, i) => {
  
  o[i.value] = i.text

  return o
}, {})

/**
 * осевая нагрузка
 * 
 */

const ax = {
  val: false
}

const ex = {
  val: 1,
  default: [
    { text: 'area.ex.1', value: 1 },
    { text: 'area.ex.2', value: 2 }
  ]
}

const tt = {
  a: {
    val: 2,
    min: 2,
    max: 3,
    default: [
      { text: 2, value: 2 },
      { text: 3, value: 3 }
    ]
  },
  wg: {
    val: 7906,
    min: 500,
    max: 40000
  },
  l:{
    val: 0,
    min: 1000,
    max: 40000
  },
  l1: {
    val: 0,
    min: 100,
    max: 40000
  },
  n1: {
    val: 5565,
    min: 700,
    max: 120000
  },
  n1max: {
    val: 7750,
    min: 1000,
    max: 18000
  },
  n2: {
    val: 2341,
    min: 600,
    max: 120000
  },
  n2max: {
    val: 10500,
    min: 1000,
    max: 18000
  }
}

const pp = {
  a: {
    val: 3,
    min: 1,
    max: 4,
    default: [
      { text: 1, value: 1 },
      { text: 2, value: 2 },
      { text: 3, value: 3 },
      { text: 4, value: 4 }
    ]
  },
  wg: {
    val: 6509,
    min: 3000,
    max: 40000
  },
  l2:{
    val: 0,
    min: 500,
    max: 40000
  },
  l3: {
    val: 0,
    min: 500,
    max: 40000
  },
  n2: {
    val: 5207,
    min: 500,
    max: 120000
  },
  n2max: {
    val: 24000,
    min: 500,
    max: 120000
  }
}

export { pp, tt, ax, tp, ex, lm, st, stList, stByValue, pg, pgList, pgByValue, cn, wg, hg, wd, ln, nm, rt, rtList, rtByValue, ov, ovList, ovByValue }
export default {
  values: {
    nm: nm,
    ln: ln,
    wd: wd,
    hg: hg,
    wg: wg,
    cn: cn,
    pg: pg,
    st: st,
    lm: lm,
    tp: tp,
    ex: ex,
    ax: ax,
    rt: rt,
    ov: ov
  }
}