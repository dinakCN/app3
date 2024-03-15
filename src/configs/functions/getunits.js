const getSize = (int, size) => {

  if (!int) return 0
  
  switch (Number(size)) {
  case 0:
    int = parseFloat(int).toFixed(0)
    break
  case 1:
    int = parseFloat(int / 10).toFixed(1)
    break
  case 2:
    int = parseFloat(int / 1000).toFixed(3)
    break
  }

  int = parseFloat(int)

  if (Number.isInteger(int)) int = int.toFixed()
  
  return Number(int)
}

const translate = (int, type, unit) => {
  
  if (type === 'size') {

    switch (Number(unit)) {
    case 0:
      int = parseFloat(int).toFixed(0)
      break
    case 1:
      int = parseFloat(int).toFixed(1)
      break
    case 2:
      int = parseFloat(int).toFixed(3)
      break
    case 3:
      int = parseFloat(int).toFixed(4)
      break 
    case 4:
      int = parseFloat(int).toFixed(5)
      break  
    }

  }

  int = parseFloat(int)

  if (Number.isInteger(int)) int = int.toFixed()
  
  return Number(int)  
}

const getWght = (int, wght) => {

  if (!int) return 0

  switch (Number(wght)) {
  case 0:
    int = parseFloat(int).toFixed(1)
    break
  case 1:
    int = parseFloat(int / 1000).toFixed(3)
    break
  case 2:
    int = parseFloat(int).toFixed(2)
    break
  }

  int = parseFloat(int)

  if (Number.isInteger(int)) int = int.toFixed()

  return Number(int)
}

export { getSize, getWght, translate }