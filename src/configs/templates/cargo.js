import { getCargoIcon } from '@/configs/functions/geticon.js'

const icon = getCargoIcon(1)
const pallet = [{ 
  add_time: 1,
  gr: 0,
  nm: ['templates.pallet', 'Euro'],
  icon: icon,
  data: [{
    id: null,
    nm: ['templates.pallet', 'Euro'],
    cn: 1,
    pg: 1,
    st: 0,
    ln: 1200,
    wd: 800,
    hg: 1500,
    wg: 600,
    lm: 0,
    rt: 1,
    ov: 0,
    cr: null,
    point: null
  }]  
}, { 
  add_time: 2,
  gr: 0,
  nm: ['templates.pallet', 'Finland'],
  icon: icon,
  data: [{
    id: null,
    nm: ['templates.pallet', 'Finland'],
    cn: 1,
    pg: 1,
    st: 0,
    ln: 1200,
    wd: 1000,
    hg: 1500,
    wg: 600,
    lm: 0,
    rt: 1,
    ov: 0,
    cr: null,
    point: null
  }]
}, { 
  add_time: 3,
  gr: 0,
  nm: ['templates.pallet', 'America'],
  icon: icon,
  data: [{
    id: null,
    nm: ['templates.pallet', 'America'],
    cn: 1,
    pg: 1,
    st: 0,
    ln: 1200,
    wd: 1200,
    hg: 1500,
    wg: 600,
    lm: 0,
    rt: 1,
    ov: 0,
    cr: null,
    point: null
  }]
}]

export { pallet }
