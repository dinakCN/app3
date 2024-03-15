import { getWght, getSize } from '@/configs/functions/getunits.js'

const getText = (i, unitSizeText, unitWeightText, config) => {
  return getSize(Number(i.ln), config.size) + ' x ' + 
  getSize(Number(i.wd), config.size) + ' x ' + 
  getSize(Number(i.hg), config.size) + ' ' + 
  unitSizeText + ', ' +
  getWght(Number(i.wg), config.wght) + ' ' + 
  unitWeightText
}

export { getText }