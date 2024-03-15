const getCargoIcon = (int) => {

  let icon

  switch (int) {
  case 0:
    icon = 'bx bx-cube'
    break
  case 1:
    icon = 'mdi-shipping-pallet'
    break
  case 2:
    icon = 'bx bx-package'
    break
  default:
    icon = 'bx bx-cube'
  }

  return icon
}

const getLoadsIcon = (int) => {

  let icon

  switch (int) {
  case -1:
    icon = 'mdi-truck-fast'
    break
  case 0:
  case 3:
    icon = 'mdi-truck-fast'
    break
  case 1:
  case 4:
    icon = 'mdi-train-car-container'
    break
  case 2:
    icon = 'mdi-shipping-pallet'
    break
  case 5:
    icon = 'mdi-train'
    break
  case 6:
    icon = 'mdi-airplane'
    break
  case 7:
    icon = 'mdi-warehouse'
    break
  default:
    icon = 'mdi-warehouse'
  }

  return icon
}

export { getCargoIcon, getLoadsIcon }