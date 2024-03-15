const setSize = (int = 0, size = 0) => {

  if (!int) return 0

  switch (size) {
  case '1':
    int = parseFloat(int) * 10
    break
  case '2':
    int = parseFloat(int) * 1000
    break
  }

  int = parseFloat(int)

  if (Number.isInteger(int)) int = int.toFixed()
  
  return Number(int)
}

const setWght = (int = 0, wght = 0) => {

  if (!int) return 0

  switch (wght) {
  case '0':
    int = parseFloat(int).toFixed(1)
    break
  case '1':
    int = parseFloat(int * 1000).toFixed(3)
    break
  }

  int = parseFloat(int)

  if (Number.isInteger(int)) int = int.toFixed()
  
  return Number(int)
}

export { setSize, setWght }