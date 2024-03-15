const getDigits = (int) => {
  int = Number(parseFloat(int))

  if (int >= 10) int = int.toFixed(1)
  if (int >= 1 && int < 10)  int = int.toFixed(2)
  if (int < 1) int = int.toFixed(3) 

  int = Number(parseFloat(int))

  if (Number.isInteger(int)) int = int.toFixed(0)
  
  return Number(int)
}

export { getDigits }