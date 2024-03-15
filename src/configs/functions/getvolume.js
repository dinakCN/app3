import { getDigits } from '@/configs/functions/getDigits.js'

const getVolume = (i = { ln: 0, wd: 0, hg: 0 }) => {
  const vol = Number(((i.ln * i.wd * i.hg) * 0.000000001))

  return getDigits(vol)
}

const setVolume = (i = 0) => {
  const vol = Number(i) / 1000000000

  return getDigits(vol)
}

export { getVolume, setVolume }