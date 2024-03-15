
const f = { name: 'front', length: SMath.floor(this.box[2].max.z - this.box[1].max.z), vector: new Vector3(), dinstance: 0 }
const l = { name: 'left', length: SMath.floor(this.box[2].max.x - this.box[1].max.x), vector: new Vector3(), dinstance: 0 }
const r = { name: 'right', length: SMath.floor(this.box[1].min.x - this.box[2].min.x), vector: new Vector3(), dinstance: 0 }
const b = { name: 'back', length: SMath.floor(this.box[1].min.z - this.box[2].min.z), vector: new Vector3(), dinstance: 0 }



snapToActiveBorder(object, array, grid = 0.6, move = 'front', activeHeight) {

  /**
   * функиця ищет пересечения между мешами и активными спейсами по нижней плоскости (фильтр по высоте от всех мешей)
   * и увеличенным box3 объекта в проверяемую сторону (fron / left ...)
   * 
   * результат функции - объект с параметрами
   * 
   * dinstance - длина до ближайшего объекта в сторону проверки
   * vector - вектор перемещения объекта до ближайшего объекта
   * 
   */

  let dinstance = 0

  const vector = new Vector3( 0, 0, 0 )

  /**
   * проверка параметров
   * 
   */

  if (grid < 0) return { vector: vector, dinstance: dinstance }

  /** 
   * box3 object
   * 
   */

  this.setBox3(object, 1)

  /**
   * уменьшаем размер чтоы исключить "прижатие" по другим сторонам
   * 
   */

  this.box[1].expandByScalar(-1 * 0.001)

  /**
   * понижаем высоту чтобы получить сопрокосновение по нижней плоскости
   * 
   */

  this.box[1].min.y = SMath.floor(this.box[1].min.y - 0.001)

  /**
   * растягиваем box3 object в направлении до grid 
   *  
   */

  switch (move) {

  case 'front':
    this.box[1].max.z += grid
    this.box[1].max.z = SMath.floor(this.box[1].max.z)
    break

  case 'right':
    this.box[1].min.x -= grid
    this.box[1].min.x = SMath.floor(this.box[1].min.x)      
    break

  case 'back':
    this.box[1].min.z -= grid
    this.box[1].min.z = SMath.floor(this.box[1].min.z)
    break

  case 'left':  
    this.box[1].max.x += grid
    this.box[1].max.x = SMath.floor(this.box[1].max.x)
    break

  }

  /**
   * проверяем на пересечение с другими позициями
   * 
   */

  const collision = []

  for (let x = 0; x < array.length; x ++) {

    /** filter */

    if (array[x].id === object.id) continue

    /** filter */

    if (this.getY(array[x], false) !== activeHeight) continue

    /** box3 of mesh */

    this.setBox3(array[x], 2)

    /** intersect of mesh */

    if (this.box[1].intersectsBox(this.box[2])) collision.push(array[x])
  }

  /**
   * debug
   * 
   */

  let dbg = []

  // dbg.push('front')
  // dbg.push('left')
  // dbg.push('back')
  // dbg.push('right')

  if (dbg.includes(move)) {

    console.log('move ' + move)
    console.log('collision')
    console.log(collision)

  }

  if (!collision.length) return { vector: vector, dinstance: dinstance }

  /**
   * расчет расстояния до мешей в зоне grid
   * 
   */

  const dinstanceToMeshes = []

  /** 
   * box3 object to default
   * 
   */

  this.setBox3(object, 1)

  /** 
   * стартовая максимальная дистанция равна grid
   * grid - проверяемое расстояние не больше расстояния до границы
   * 
   */

  for (let x = 0; x < collision.length; x ++) {

    /**
     * box3 of mesh
     * 
     */

    this.setBox3(collision[x], 2)

    /** расчет расстояния до ближайших объектов в строну move */

    let l = 0, direct = true

    switch (move) {

    case 'front':

      /**
       * определяем положение mesh выше /ниже origin вдоль длины ТС
       * 
       */

      if (this.box[2].max.z >= this.box[1].max.z) {

        /**
         *  прямое перемещение вдоль z
         * 
         */

        direct = true

      } else {

        /**
         *  обратное перемещение вдоль z
         * 
         */

        direct = false

      }

      l = SMath.floor(this.box[2].max.z - this.box[1].max.z)

      break

    case 'right':

      /**
       * определяем положение mesh выше /ниже origin обратно вдоль ширины ТС
       * 
       */

      if (this.box[1].min.x >= this.box[2].min.x) {

        /**
         *  обратное перемещение вдоль x
         * 
         */

        direct = true

      } else {

        /**
         *  прямое перемещение вдоль x
         * 
         */

        direct = false

      }

      l = SMath.floor(this.box[1].min.x - this.box[2].min.x)
  
      break

    case 'back':

      /**
       * определяем положение mesh выше /ниже origin обратно вдоль длины ТС
       * 
       */

      if (this.box[1].min.z >= this.box[2].min.z) {

        /**
         *  прямое перемещение вдоль z
         * 
         */

        direct = true

      } else {

        /**
         *  обратное перемещение вдоль z
         * 
         */

        direct = false

      }
      
      l = SMath.floor(this.box[1].min.z - this.box[2].min.z)

      break

    case 'left':

      /**
       * определяем положение mesh выше /ниже origin вдоль ширины ТС
       * 
       */

      if (this.box[2].max.x >= this.box[1].max.x) {

        /**
         *  прямое перемещение вдоль x
         * 
         */

        direct = true

      } else {

        /**
         *  обратное перемещение вдоль x
         * 
         */

        direct = false

      }
      
      l = SMath.floor(this.box[2].max.x - this.box[1].max.x)

      break
  
    }

    /**
     * установка l
     * 
     * l - расстояние до потенциальной границы для магнита
     * l должна быть меньше или равна grid по модулю
     * 
     * 
     */

    if (Math.abs(l) <= grid) dinstanceToMeshes.push({ length: Math.abs(l), direction: direct })

  }

  /**
   * если нет ближних границы
   * 
   */

  if (!dinstanceToMeshes.length) return { vector: vector, dinstance: dinstance }

  /**
   * найти наименьшее расстояние
   * 
   */

  dinstanceToMeshes.sort((a, b) => a.length > b.length ? -1 : 1)

  const [max] = dinstanceToMeshes

  const { length, direction } = max

  direction ? dinstance = length : dinstance = length * -1

  /**
   * debug
   * 
   */

  dbg = []

  // dbg.push('front')
  // dbg.push('left')
  // dbg.push('back')
  // dbg.push('right')

  if (dbg.includes(move)) {

    console.log('move ' + move)
    console.log('dinstanceToMeshes')
    console.log(dinstanceToMeshes)
    console.log(dinstance)

  }

  /**
   * set result
   * 
   */

  switch (move) {

  case 'front':

    vector['z'] = dinstance

    break

  case 'right':

    vector['x'] = dinstance * -1
    break

  case 'back':

    vector['z'] = dinstance * -1
    break

  case 'left':

    vector['x'] = dinstance
    break

  }

  return { vector: vector, dinstance: Math.abs(dinstance) }   

}

zoomAt (target) {

  // https://discourse.threejs.org/t/simple-zoom-to-selected-object-in-the-scene-with-controls-and-camera-and-tweenjs/38824/2

  const aabb = new Box3().setFromObject( target )
  const center = aabb.getCenter( new Vector3() )
  const size = aabb.getSize( new Vector3() )

  this.camera.position.x = center.x
  this.camera.position.y = center.y + 1
  this.camera.position.z = center.z + size.z + 1

  this.camera.lookAt( target.position )

  this.controls.target.x = center.x
  this.controls.target.x = center.x
  this.controls.target.x = center.x
  
  this.controls.enabled = true

}

scaleToFit(object, { l, w, h }) {

  let load, size

  load = new Box3().setFromObject(object)
  size = load.getSize(new Vector3())

  const sl = l / size.z
  const sw = w / size.x
  const sh = h / size.y

  object.scale.y = object.scale.y * sh
  object.scale.x = object.scale.x * sw
  object.scale.z = object.scale.z * sl

  object.traverse((i) => {        
    if (i.isMesh) {

      i.material = new MeshPhongMaterial()

      i.updateMatrix()
      i.matrixAutoUpdate = false

    }
  })
  
  load = new Box3().setFromObject(object)
  size = load.getSize(new Vector3())

  return size
}


MergeGeometry(geo1, geo2) {
  const attributes = ['normal', 'position', 'skinIndex', 'skinWeight']
  const dataLengths = [3, 3, 4, 4]
  const geo = new BufferGeometry()

  for (let attIndex = 0; attIndex < attributes.length; attIndex++) {
    const currentAttribute = attributes[attIndex]
    const geo1Att = geo1.getAttribute(currentAttribute)
    const geo2Att = geo2.getAttribute(currentAttribute)

    let currentArray = null

    if (currentAttribute === 'skinIndex') {
      currentArray = new Uint16Array(geo1Att.array.length + geo2Att.array.length)
    } else {
      currentArray = new Float32Array(geo1Att.array.length + geo2Att.array.length)
    }

    let innerCount = 0

    geo1Att.array.map((item) => {
      currentArray[innerCount] = item
      innerCount++

      return false
    })
    geo2Att.array.map((item) => {
      currentArray[innerCount] = item
      innerCount++

      return false
    })
    geo1Att.array = currentArray
    geo1Att.count = currentArray.length / dataLengths[attIndex]
    geo.setAttribute(currentAttribute, geo1Att)
  }

  return geo
}

sortSpace(object, inloads = []) {
    
  /**
   * массив площадей
   * 
   */

  let array = []
  let union = []

  /**
   * добор спейсов
   * 
   */

  if ([1, 2, 3].includes(object.userData.stuck)) {

    /**
     * фильтры
     * 
     */

    for (let x = 0; x < inloads.length; x ++) {

      /**
       * пропустить перемещаемый объект
       * 
       */

      if (inloads[x].id === object.id) continue

      /**
       * полное перекрытие
       * 
       */

      if (inloads[x].userData._isCoverFull) continue

      /**
       * возможность штабелирования
       * 
       */

      if (![1, 3].includes(inloads[x].userData.stuck)) continue

      /**
       * фильтр по максимальной высоте
       * 
       */

      if (object.scale.y > this.frameY - this.getY(inloads[x], true)) continue

      /**
       * фильтр по нагрузке
       * 
       */

      if (object.userData.weight > inloads[x].userData._limit) continue

      /**
       * add
       * 
       */

      stuck.push(inloads[x])

    }

    /**
     * сортировка по площади
     * 
     */

    for (let x = 0; x < stuck.length; x ++) {

      /**
       * проверка на площадь основания
       * 
       */

      if (object.userData._square <= stuck[x].userData._square) {

        if (stuck[x].scale.x >= object.scale.x && stuck[x].scale.z >= object.scale.z) {
          
          /**
           * add to space
           * 
           */

          array.push({ mesh: stuck[x], type: false })

          continue
        }

      }

      /**
       * add to union make
       * 
       */

      union.push(stuck[x])

    }

    /**
     * обработка union
     * объеденение меньших размеров
     * 
     */

  }

  // console.log(array)

  /**
   * add
   * 
   */

  for (let x = 0; x < array.length; x ++) this.group.add(this.createSpace(array[x].mesh, array[x].type))

  /**
   * clear
   * 
   */

  array = []
  stuck = []
  union = []

}

const collisions = Drag.detectCollisions(event.object, [], this.grid)

if (collisions) {

  event.object.position.copy( Drag.last )
  event.object.updateMatrix()   

} else {      

  Drag.last.copy(event.object.position)

}

 
/**
 * intersect spaces
 * 
 */

const intersectSpace = []

/**
 * make intersection box
 * 
 */

const intersection = this.box[1].clone().intersect(this.box[2])

if (intersection !== null) {

const { min, max } = intersection

/**
 * Вычисление размеров кубоида в пространстве
 * 
 */ 

const _width = SMath.floor(max.x - min.x)
const _depth = SMath.floor(max.z - min.z)

/**
 * площадь соприкосновнеия с origin
 * 
 */

let sq = SMath.floor(_width * _depth)

/**
 * исключение
 * при полном перекрытии _square === 0
 * 
 */

if (sq === 0) sq = origin.userData._square

/**
 * key индекс проверяемого спейса 
 * sq площадь пересечения с origin
 * hg максимальная координата высоты спейса
 * 
 * общий принцип
 * при равной площади пересечении у нескольких спейсов - выбирать спейс по максимальной высоте (спуск места)
 * при не равной площади пересечения - выбирать спейс с меньшей площщадью пересечения (подьем места)
 * 
 */

intersectSpace.push( { key: key, sq: sq, hg: this.box[2].max.y } )

}

  /**
 *  сортировка пересечений при наличии
 * 
 */

if (intersectSpace.length) {

/** сортируем по возрастанию sq площадь пересечения */

intersectSpace.sort((a, b) => a.sq > b.sq ? 1 : -1)

/** фильтруем массив по значению максимального пересечения */

const filter = intersectSpace.filter((i) => i.sq === intersectSpace[0].sq)

/** сортируем фильтр по убыванию высоты hg */

filter.sort((a, b) => a.hg > b.hg ? -1 : 1)

/** устанавливаем спейс с самой большой высотой */

this.active = this.space[filter[0].key]

}
