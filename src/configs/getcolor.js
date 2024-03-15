export function getRandomColor() {

  const min_s = 30
  const max_s = 70

  const min_l = 60
  const max_l = 90

  const h = Math.floor(Math.random() * 360) // 0-360 градусов цвета
  const s = Math.floor(Math.random() * (max_s - min_s) + min_s) // 30-70% насыщенности
  let l = Math.floor(Math.random() * (max_l - min_l) + min_l) // 70-100% яркости
  
  l /= 100

  const a = s * Math.min(l, 1 - l) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

    return Math.round(255 * color).toString(16).padStart(2, '0')   // convert to Hex and prefix "0" if needed
  }
  
  return `#${f(0)}${f(8)}${f(4)}`
}