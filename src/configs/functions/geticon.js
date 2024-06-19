const getCargoIcon = (int) => {

  let icon

  switch (int) {
  case 0:
    icon = 'mdi:mdi-cube-outline'
    break
  case 1:
    icon = 'mdi:mdi-shipping-pallet'
    break
  case 2:
    icon = 'mdi:mdi-package-variant'
    break
  default:
    icon = 'mdi:mdi-cube-outline'
  }

  return icon
}

const getLoadsIcon = (int) => {

  let icon

  switch (int) {
  case -1:
    icon = 'mdi:mdi-truck-fast'
    break
  case 0:
  case 3:
    icon = 'mdi:mdi-truck-fast'
    break
  case 1:
  case 4:
    icon = 'mdi:mdi-train-car-container'
    break
  case 2:
    icon = 'mdi:mdi-shipping-pallet'
    break
  case 5:
    icon = 'mdi:mdi-train'
    break
  case 6:
    icon = 'mdi:mdi-airplane'
    break
  case 7:
    icon = 'mdi:mdi-warehouse'
    break
  default:
    icon = 'mdi:mdi-warehouse'
  }

  return icon
}

export { getCargoIcon, getLoadsIcon }
