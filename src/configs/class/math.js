import { translate, getWght } from '@/configs/functions/getunits.js'

class SMath {

  static floorVector(v) {

    v.x = this.floor(v.x)
    v.y = this.floor(v.y)
    v.z = this.floor(v.z)

    return v
  }

  static floorVectorSize(v) {

    v.x = this.floorSize(v.x)
    v.y = this.floorSize(v.y)
    v.z = this.floorSize(v.z)

    return v
  }

  static floor(n) {

    return translate(n, 'size', 4)

  }

  static floorSize(n) {

    return translate(n, 'size', 2)

  }

  static getWght(n) {

    return getWght(n, 2)

  }

}

export { SMath }