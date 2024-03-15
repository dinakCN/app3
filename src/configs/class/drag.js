import {
  BoxGeometry,
  MeshToonMaterial,
  Box3,
  Box3Helper,
  Vector3,
  Mesh,
  Group
} from 'three'

import { SMath } from '@/configs/class/math.js'

class SceneDrag {

  /** флаг */ 

  event = null

  /** перетаскиваемый объект */

  mesh = null

  /** height */

  height = null

  /** start mesh position & scale */

  startPosition
  startScale

  /** box3 */

  box = {
    1: {},
    2: {}
  }

  /**
   * last position new Vector3()
   * 
   */

  last

  /**
   * flag для включения и выключения snap
   * 
   */

  snapEnable = true

  /**
   * flag для включения и выключения свеса груза hang
   * 
   */

  hangEnable = false

  /**
   * group of spaces
   * 
   */

  group

  /**
   * array of spaces
   * 
   */

  space

  /**
   * geometry default / space
   * 
   */

  geometry

  /**
  * material of space
  * 
  */
 
  material

  /**
   * 
   * frameY
   * 
   */
  
  frameY

  /**
   * размер минимальной стороны ТС
   * длины или ширины
   * 
   * 
   */

  frameW

  /**
   * флаг валидации при перемещении мест
   * валидация о том, что спейс подходит для перемещаемой позиции
   * 
   */

  valid = false

  /**
   * box3 helper
   * 
   * 
   */

  box3helper = { 1: {}, 2: {} }

  /**
   * стандартная высота спейсов
   * 
   */

  spaceNormalHeight = 0.006

  init (scene) {

    /**
     * init space group
     * 
     */

    this.group = new Group()
    this.group.name = 'space'

    scene.add(this.group)

    /**
     * update matrix
     * 
     */

    this.group.updateMatrix()
    this.group.matrixAutoUpdate = false

    /**
     * init material
     * 
     */

    this.material = new MeshToonMaterial({ 
      color: 0x7FFFD4,
      fog: false,
      transparent: true,
      opacity: 0.7,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    })

    /**  
     * init geometry
     * 
     */

    this.geometry = new BoxGeometry(1, 1, 1)

    /**
     * space array
     * 
     */

    this.space = []

    /**
     * box3 collisions
     * 
     */

    this.box[1] = new Box3()
    this.box[2] = new Box3()

    /**
     * box3 helper
     * 
     */

    // this.box3helper[1] = new Box3Helper(this.box[1], 0xFFBF00)
    // this.box3helper[2] = new Box3Helper(this.box[2], 0xF0FFFF)

    // scene.add(this.box3helper[1])
    // scene.add(this.box3helper[2])

  }

  setFrameAttr(frame) {

    this.frameY = frame.scale.y
    this.frameW = SMath.floor(Math.min(frame.scale.x, frame.scale.z) * 0.15)

  }

  getStart(mesh) {

    if (mesh?.isMesh) {

      this.startPosition = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z }
      this.startScale = { x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z } 

    }
  }

  setStart(mesh) {

    /** position */
    
    if (this.startPosition.x) mesh.position.x = this.startPosition.x
    if (this.startPosition.y) mesh.position.y = this.startPosition.y
    if (this.startPosition.z) mesh.position.z = this.startPosition.z

    /** scale */

    if (this.startScale.x) mesh.scale.x = this.startScale.x
    if (this.startScale.y) mesh.scale.y = this.startScale.y
    if (this.startScale.z) mesh.scale.z = this.startScale.z

    /** update */

    mesh.updateMatrix()

  }

  detectCollisions(origin, array, ...args) {

    let collisions = false

    /**
     * цикл проверки коллизий
     * 
     */

    this.setBox3(origin, 1)

    /**
     * уменьшаем размеры бокса на 0.001
     * 
     */
    
    this.box[1].expandByScalar(-1 * 0.001)

    /**
     * new array
     * 
     */

    const meshs = [...array]

    for (const arg of args) {
      if (arg) meshs.push(arg)
    }

    for (let key = 0; key < meshs.length; key ++) {

      if (meshs[key].id === origin.id) continue

      /**
       * key box3
       * 
       */

      this.setBox3(meshs[key], 2)

      if (this.box[1].intersectsBox(this.box[2])) {

        /**
         * return with collission
         * 
         */

        collisions = true    

      }

    }

    /**
     * return no collission
     * 
     */

    // console.log('collisions ' + collisions)

    return collisions
  }

  detectInFrame(origin, frame) {

    /**
     * box3 parent set
     * 
     */

    this.setBox3(frame, 1)

    /**
     * box3 orgin
     * 
     */

    this.setBox3(origin, 2)

    /** intersect */

    return this.box[1].intersectsBox(this.box[2])
  }

  /**
   * select space 
   *
   */

  calculateHeight(origin) {

    /**
     * очищаем активную высоту
     * 
     */

    this.removeHeight()

    /**
     * box3 parent set
     * 
     */

    this.setBox3(origin, 1)

    /** 
     * уменьшить размеры для сглаживания и возможности примагничинвания
     * 
     * 
     */

    this.box[1].expandByScalar((this.getGridSnap(origin) + 0.001) * -1)

    /** 
     *  растянуть до 0
     * 
     */

    this.box[1].expandByPoint({ x: this.box[1].min.x, y: 0, z: this.box[1].min.z })

    /**
     * флаг спейса транспорта (приоритет ниже пола)
     * используется только если другие спейсы отсуствуют 
     * 
     */

    let loadsKey = null

    /**
     * флаг спейса пола (самый высокий приоритет)
     * используется только если другие спейсы отсуствуют 
     * 
     */

    let floorKey = null

    /**
     * loop по спейсам
     * 
     */

    for (let key = 0; key < this.space.length; key ++) {

      /**
       * box3 проверямых мест
       * 
       */

      this.setBox3(this.space[key], 2)

      /**
       * растяжка до уровня 0 по Y вниз 
       * 
       */

      this.box[2].expandByPoint({ x: this.box[2].min.x, y: 0, z: this.box[2].min.z })

      /** 
       * поиск пересечений
       * 
       */

      if (this.box[1].intersectsBox(this.box[2])) {

        /**
         * обнаружить floor
         * понизить приоритет
         * 
         */

        if (this.space[key].name === 'floor') {

          floorKey = key

          continue
        }

        /**
         * обнаружить loads
         * понизить приоритет
         * 
         */

        if (this.space[key].name === 'loads') {
          
          loadsKey = key

          continue

        }

        /**
         * если есть пересечени с floor, то пропускаем остальной цикл
         * 
         */

        if (floorKey) continue

        /**
         * поиск максимальной высоты
         * 
         */

        if (this.box[2].max.y > this.height || this.height === null) {

          /**
           * устанавливаем новую максимальную высоту
           * 
           */

          this.setHeight(this.box[2].max.y - this.spaceNormalHeight)

        }
        
      }

    }

    /**
     * при отсуствии других пересечений
     * проверка на пересечении с floor 
     * floor приоритетнее
     * 
     */

    if (floorKey !== null) {

      this.setBox3(this.space[floorKey], 2)
      this.setHeight(this.box[2].min.y)

    }

    /**
     * при отсуствии других пересечений
     * проверка на пересечении loads 
     * 
     */

    if (loadsKey !== null && !this.getHeightStatus()) {

      this.setBox3(this.space[loadsKey], 2)
      this.setHeight(this.box[2].min.y)

    }

    /**
     * если установлена высота то меняем высоту текущей позиции
     * и ставим на активную высоту нижней гранью
     * 
     */

    if (!this.getHeightStatus()) return

    // console.log('this.height ' + this.height)

    /**
     * обновить высоту
     * 
     */

    origin.position.y = SMath.floor(this.height + SMath.floor(origin.scale.y / 2))
    origin.updateMatrix()

  }

  removeHeight() {
    this.height = null
  }

  setHeight(n) {

    /**
     * проверка 
     * уставнолено ли значение текущей высоты
     * 
     */

    if (n === null) return

    this.height = SMath.floor(n)

    return 

  }

  getHeightStatus() {

    /**
     * проверка был ли установлена максимальная высота
     * 
     */

    if (this.height === null) return false

    return true

  }

  /**
   * snap to space & border
   * 
   */

  snap(origin, meshes) {

    /**
     * при отсуствии пересечения со спейсами
     * 
     */

    if (!this.getHeightStatus()) return

    /**
     * включено ли притяжение к границам другим мест и спейс
     * 
     */

    if (!this.snapEnable) return    

    /**
     * получить длину для срабатывания пристыковки до и после границы
     * 
     */

    const grid = this.getGridSnap(origin)

    /**
     * кубоид
     * 
     */
 
    this.setBox3(origin, 1)
 
    /** 
     * вектор
     * 
     */
 
    const moveVector = new Vector3()

    /**
     * name: направление для проверки
     * length: расстояние от ближайшей стороны куба до ближайшей границы спейса
     * 
     */
     
    const f = { name: 'front', vector: new Vector3(), dinstance: -1 }
    const l = { name: 'left',  vector: new Vector3(), dinstance: -1 }
    const r = { name: 'right', vector: new Vector3(), dinstance: -1 }
    const b = { name: 'back',  vector: new Vector3(), dinstance: -1 }
  
    /**
     * проверка "магнита" к мешам
     * 
     */
  
    const a = [f, l, r, b]
  
    for (let x = 0; x < a.length; x ++) {
  
      const { vector, dinstance } = this.snapToMesh(origin, meshes, grid, a[x].name, false)
      
      a[x].vector.add(vector)
      a[x].dinstance = dinstance
    
    }
  
    /**
     * проверка "магнита" к границам спейса
     * 
     */
  
    for (let x = 0; x < a.length; x ++) {
  
      /**
       * проверка если ранее не был найден меш в этом направлении
       * 
       */
  
      if (a[x].dinstance > -1) continue
  
      const { vector, dinstance } = this.snapToMesh(origin, this.space, grid, a[x].name, true)
      
      a[x].vector.add(vector)
      a[x].dinstance = dinstance
    
    }
  
    // console.log(a)
  
    /**
    * Огранчиваем магнит выбором только 2 направления для перемещения
    * Либо вперед / назад вдоль оси Z
    * Либо вправо / влево вдоль оси X
    * 
    * фильтруем по принципу более ближней границы:
    * сравниваем между собой пары расстояний R и L / F и B до объектов или границы 
    * и выбираем меньшее расстояние
    * затем объединяем это в общий вектор перемещения
    * 
    */
  
    /** выбирем Z магнит при наличии */
  
    if (f.dinstance > -1 && b.dinstance > -1) {
  
      if (f.dinstance > b.dinstance) {
        moveVector.add(b.vector)

        // console.log('back ' + b.dinstance)
      } else {
        moveVector.add(f.vector)

        // console.log('front ' + f.dinstance)
      }
  
    } else if (f.dinstance === -1 && b.dinstance > -1) {
      moveVector.add(b.vector)

      // console.log('back ' + b.dinstance)
    } else if (f.dinstance > -1 && b.dinstance === -1) {
      moveVector.add(f.vector)

      // console.log('front ' + f.dinstance)
    }
  
    /** выбирем X магнит при наличии */
  
    if (r.dinstance > -1 && l.dinstance > -1) {
  
      if (r.dinstance > l.dinstance) {
        moveVector.add(l.vector)
  
        // console.log('left ' + l.dinstance)
  
      } else {
        moveVector.add(r.vector)
  
        // console.log('right ' + r.dinstance)
      } 
  
    } else if (r.dinstance === -1 && l.dinstance > -1) {
      moveVector.add(l.vector)
  
      // console.log('left ' + l.dinstance)
  
    } else if (r.dinstance > -1 && l.dinstance === -1) {
      moveVector.add(r.vector)
  
      // console.log('right ' + r.dinstance)
  
    }

    /**
     * сдвиг origin
     * 
     */

    if (moveVector.equals(new Vector3())) return

    /** округление */

    SMath.floorVector(moveVector)

    /** сдвиг */

    origin.position.copy(origin.position.clone().add(moveVector))
    SMath.floorVector(origin.position)
    origin.updateMatrix()

    return
 
  }

  snapToMesh(object, array, grid = this.frameW, move = 'front', space = false) {

    /**
     * фунция для расчета расстояний от границы move до ближайшего объекта по условию
     * 
     * если space === false, то проверяются объекты у которых координата нижней плоскости равна координате нижней плоскости object
     * если space === true, то проверяются объекты у которых координата верхней плоскости равна координате нижней плоскости object
     * 
     * move - сторона object для проверки пересечений
     * array - массив для проверки пересечений по условию
     * 
     * результат функции - объект с параметрами
     * 
     * dinstance - длина до ближайшего объекта в сторону проверки
     * vector - вектор перемещения объекта до ближайшего объекта
     * 
     */

    let dinstance = -1

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

    if (space) this.box[1].min.y = SMath.floor(this.box[1].min.y - 0.001)

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

      if (this.getY(array[x], false) !== this.height) continue

      /** box3 of mesh */

      this.setBox3(array[x], 2)

      /** intersect of mesh */

      if (this.box[1].intersectsBox(this.box[2])) collision.push(array[x])

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

      const { l, direct } = space ? this.calculateMoveToBorder(move) : this.calculateMoveToMesh(move)

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

    dinstance = SMath.floor(dinstance)

    /**
     * debug
     * 
     */

    // const dbg = []

    // dbg.push('front')
    // dbg.push('left')
    // dbg.push('back')
    // dbg.push('right')

    // if (dbg.includes(move)) {

    // console.log('move ' + move)
    // console.log('dinstanceToMeshes')
    // console.log(dinstanceToMeshes)
    // console.log(dinstance)

    // }

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

  calculateMoveToMesh(move) {

    /** расчет расстояния до ближайших объектов в строну move */

    let l = 0, direct = true

    switch (move) {

    case 'front':

      /**
       * определяем положение mesh выше /ниже origin вдоль длины ТС
       * 
       */

      if (this.box[2].min.z >= this.box[1].max.z) {

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

      l = SMath.floor(this.box[2].min.z - this.box[1].max.z)

      break

    case 'right':

      /**
       * определяем положение mesh выше /ниже origin обратно вдоль ширины ТС
       * 
       */

      if (this.box[1].min.x >= this.box[2].max.x) {

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

      l = SMath.floor(this.box[1].min.x - this.box[2].max.x)
  
      break

    case 'back':

      /**
       * определяем положение mesh выше /ниже origin обратно вдоль длины ТС
       * 
       */

      if (this.box[1].min.z >= this.box[2].max.z) {

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
      
      l = SMath.floor(this.box[1].min.z - this.box[2].max.z)

      break

    case 'left':

      /**
       * определяем положение mesh выше /ниже origin вдоль ширины ТС
       * 
       */

      if (this.box[2].min.x >= this.box[1].max.x) {

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
      
      l = SMath.floor(this.box[2].min.x - this.box[1].max.x)

      break
  
    }

    return { l, direct }

  }

  calculateMoveToBorder(move) {

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

    return { l, direct }

  }

  validationPosition(origin) {

    /**
     * проверка
     * груз установлен на спейс active.min.y == origin.min.y
     * груз входит в разлиные спейсы по основанию
     * 
     */

    if (!this.getHeightStatus) return this.valid = false

    /**
     * высота не ниже или равное frameY
     * 
     */

    if (this.getY(origin, true) > this.frameY) return this.valid = false

    /**
     * box3
     * 
     */

    this.setBox3(origin, 1)

    /**
     * совпадение высот
     * 
     */

    if (this.box[1].min.y !== this.height) return this.valid = false    

    // console.log('validationPosition - min.y совпадает')

    /** 
     * проверить полное вхождение площади объекта на площадь спейсов ниже объекта
     * ищем соприкосновение снизу между объектом и массивом спейсов
     * 
     */

    const _sq = this.findTouchArray(origin, this.space, 'space')
    const square = _sq.reduce((o, i) => o = SMath.floorSize(o + i.sq), 0)

    /**
     * допустим свес груза при выключенном hangEnable
     * т.е. не полное вхождение груза на основании
     * достаточно минимального значения snap
     * 
     * this.height >= 0 - исключить floor
     * 
     */

    if (square > 0 && this.hangEnable) return this.valid = true

    /**
     * полное вхождение на площадь спейсов 
     * допустимая погрешность - 0.002
     * 
     */

    const precision = Math.abs(SMath.floorSize(SMath.floorSize(square) - origin.userData._square))

    if (precision > 0.001) return this.valid = false

    // console.log('validationPosition - вхождение')

    return this.valid = true
  }

  getGridSnap(origin) {

    const divide = 3.5

    let grid = SMath.floor(Math.min(origin.scale.x, origin.scale.z) / divide)

    /** ограничение до 15 % ширины / длины ТС */

    if (grid > this.frameW) grid = this.frameW

    return grid
  }

  /**
   * create space
   * 
   */

  calculateSpace(object, inloads = []) {

    /**
     * очистить массив spaces
     * 
     */

    this.spaceRemove()
    
    /**
     * создать массив мешей для создания space
     * 
     */

    const space = []

    /**
     * loop по всем позициям со штабелированием при возможности шатеблирования у главного места
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

        // console.log(inloads[x])

        /**
         * фильтр по максимальной высоте
         * 
         */

        if (SMath.floor(object.scale.y + this.getY(inloads[x], true)) > this.frameY) continue

        // console.log('фильтр по максимальной высоте')

        /**
         * фильтр остаточно _limit
         * 
         */

        if (inloads[x].userData._limit === 0) continue

        // console.log('фильтр остаточно _limit')

        /**
         * add
         * 
         */
  
        space.push({ mesh: inloads[x], type: false })
  
      }

    }

    // console.log(space)

    return space

  }

  addSpace(space = [], array) {

    /**
     * добавить базовые площади в набор space
     * 
     */

    array.forEach((i) => space.push({ mesh: i, type: true }))

    /**
     * add
     * 
     */

    for (let x = 0; x < space.length; x ++) {

      const sp = this.createMeshSpace(space[x].mesh, space[x].type)

      // console.log(sp)

      if (sp?.isMesh) this.group.add(sp)
    }

  }

  createMeshSpace(object, parent = false) {

    if (!object?.isMesh) return {}

    /**
     * копируем геометрию
     * создаем меш
     * изменяем высоту и позицию
     * возврат
     * 
     */

    const geo = object.geometry.clone()
    const space = new Mesh(geo, this.material)

    space.name = object.name

    /**
     * add label of space 
     * 
     */

    space.userData = Object.assign({}, { id: object.userData.listID })

    /**
     * apply matrix
     * 
     */

    space.applyMatrix4( object.matrixWorld )

    /** precision of scale & pos */

    SMath.floorVector(space.position)

    space.scale.x = SMath.floorSize(space.scale.x)
    space.scale.y = SMath.floorSize(space.scale.y)
    space.scale.z = SMath.floorSize(space.scale.z)

    /** 
     * высота
     * 
     */

    space.scale.y = this.spaceNormalHeight

    /**
     * устанавливаем позицию так, чтобы нижняя граница была условно равна высоте лимита 
     * 
     */

    space.position.y = this.getY(space, true)

    /** 
     * устанавливаем позицию для координаты Y НЕ parent
     *
     */
    
    if (!parent) space.position.y = SMath.floor(space.position.y + SMath.floor(object.scale.y / 2))

    /** 
     * устанавливаем позицию для координаты Y parent
     *
     */

    if (parent) space.position.y = SMath.floor(space.position.y - SMath.floor(object.scale.y / 2))

    /**
     * не обновлять матрицу спейса
     * 
     */

    space.updateMatrix()
    space.matrixAutoUpdate = false

    /**
     * добавить в набор лимитов для отображения
     * 
     */

    this.space.push(space)

    /**
     * clear
     * 
     */

    geo.dispose()

    return space
  }

  /**
   * clear
   * 
   */

  spaceRemove() {

    /**
     * удалить потомков
     * 
     */

    if (this.group?.children?.length) {

      this.group.children.forEach((object) => {

        if (object.isMesh) {
          
          object.material.dispose()
          object.geometry.dispose()

        }

        this.group.remove(object)

      })
    }

    /**
     * clear group
     * 
     */

    this.group.clear()

    /**
     * space array
     * 
     */

    if (this.space.length) {

      this.space.forEach((object) => {

        if (object.isMesh) {
          
          object.material.dispose()
          object.geometry.dispose()

        }

      })
    }

    /**
     * clear space
     * 
     */

    this.space = []    

    // console.log('spaceGroup') 
    // console.log(this.group.children)

    return

  }

  clear() {

    this.event = null
    this.startPosition = null
    this.startScale = null
    this.height = null
    this.mesh  = null
    
    /**
     * clear group and remove itself
     * 
     */

    if (this.group?.isGroup) {

      /**
       * удалить spaces
       * 
       */

      this.spaceRemove()
    }

    /**
     * box3
     * 
     */

    if (this.box[1]?.isBox3) this.box[1].makeEmpty()
    if (this.box[2]?.isBox3) this.box[2].makeEmpty()

  }

  dispose() {

    /**
     * предварительная очистка
     * 
     */

    this.clear()
    
    /**
     * clear group and remove itself
     * 
     */

    if (this.group?.isGroup) {

      /**
       * удалить группу от родителя
       * 
       */

      this.group.removeFromParent()
    }

    /**
     * dispose
     * 
     */

    if (this.material?.isMaterial) this.material.dispose()
    if (this.geometry?.isBufferGeometry) this.geometry.dispose()

  }

  /**
   * covers
   * 
   */

  recountIsCover(check = [], array = []) {

    if (!array.length) return

    /**
     * проверка массива мест на перекрытия друг друга
     * установка значения
     * userData._isCover
     * userData._isCoverFull
     * 
     */

    for (let x = 0; x < check.length; x ++) {

      const { _isCover, _isCoverFull } = this.getIsCover(check[x], array)

      // console.log(_isCover)
      // console.log(_isCoverFull)

      /**
       *  любое перекрытие
       * 
       */

      check[x].userData._isCover = _isCover

      /** 
       * частичное перекрытие
       * 
       */

      check[x].userData._isCoverFull = _isCoverFull

    }

    return

  }

  getIsCover(origin, array) {

    /**
     * 
     * проверка на частичное перекрытие груза
     * от верхнего основания до полной высоты ТС
     * 
     */

    const result = { _isCover: false, _isCoverFull: false }

    /**
     * получить массив соседей внизу и площадь соприкосновения
     * 
     */

    const n = this.findTouchArray(origin, array, 'top')

    /**
     * вычисляем общую площадь соприкосновения
     * 
     */

    const sum_square = n.reduce((sum, i) => SMath.floorSize(sum + i.sq), 0) 

    /**
     * part cover true
     * 
     */

    if (sum_square > 0.0001) result._isCover = true

    /**
     * full cover true
     * 
     */   

    if (sum_square === origin.userData._square) result._isCoverFull = true

    /**
     * return result
     * 
     */

    return result

  }

  /**
   * work fucntions
   *
   */
  
  findTouchArray(origin, meshes, direction = 'top') {

    /**
     * array octopus 
     * 
     */

    const octopus = []

    /**
     * box3 parent set
     * 
     */

    this.setBox3(origin, 1)

    /**
     * центр фейса origin
     * 
     */

    const border = SMath.floorVector(this.box[1].getCenter(new Vector3()))

    /**
     * смещение
     * 
     */
    
    if (direction === 'bottom') border.y = SMath.floor(this.box[1].min.y)
    if (direction === 'top') border.y = SMath.floor(this.box[1].max.y)
    if (direction === 'space') border.y = SMath.floor(this.box[1].min.y)

    /**
     * loop
     * 
     */

    for (let key = 0; key < meshes.length; key ++) {

      /** 
       * filter self
       * 
       */

      if (origin.id === meshes[key].id) continue

      /**
       * box3 проверямых мест
       * 
       */

      this.setBox3(meshes[key], 2)

      /**
       * filter by parent max Y 
       * 
       */

      if (direction === 'space' && border.y !== SMath.floor(this.box[2].min.y)) continue
      if (direction === 'bottom' && border.y !== SMath.floor(this.box[2].max.y)) continue
      if (direction === 'top' && border.y !== SMath.floor(this.box[2].min.y)) continue

      /**
       * filter by intersectsBox
       * 
       */

      if (!this.box[1].intersectsBox(this.box[2])) continue

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
         * create octopus object 
         * 
         */

        const o = {

          /**
           * id текущей 
           * 
           */

          id: meshes[key].id,

          /**
           * площадь соприкосновнеия с origin
           * 
           */

          sq: SMath.floorSize(_width * _depth)

        }

        /**
         * исключение
         * при полном перекрытии _square === 0
         * также при диагональном пересечении
         * 
         */

        if (o.sq === 0) {

          /**
           * Полное вхождение:
           * вычисляем дистанцию до центра нижней плоскости родителя
           * чтобы отфильтровать диагональное пересечение по расстоянию
           * если расстояние больше 0 === диагональное пересечение
           * если равно 0 === полное перекрытие или вхождение в родителя
           * 
           */

          if (this.box[2].distanceToPoint(border) === 0) o.sq = meshes[key].userData._square
        }
        
        /**
         * если площадь соприкосновения существует
         * 
         */

        if (o.sq > 0) {

          /**
           * add to octopus
           * 
           */

          octopus.push(o)
        
        }        

      }
 
    }

    /**
     * return result
     * 
     */

    return octopus

  }

  setBox3(origin, index = 2) {

    /**
     * clear
     * 
     */

    this.box[index].makeEmpty()

    /**
     * update
     * 
     */

    origin.updateMatrixWorld()
 
    /**
     * box3 set
     * 
     */

    this.box[index].setFromCenterAndSize(origin.position, origin.scale)

    /** precision of positions */

    SMath.floorVectorSize(this.box[index].min)
    SMath.floorVectorSize(this.box[index].max)

    // console.log(this.box[index].min)
    // console.log(this.box[index].max)
    
  }

  getY(origin, top = true) {

    /**
     * получить координаты Y максимальной (top === true)
     * и минимальной (top === false) точки Mesh
     * 
     */

    const half = SMath.floor(origin.scale.y / 2)

    if (top) return SMath.floor(origin.position.y + half)

    return SMath.floor(origin.position.y - half)

  }

}

export { SceneDrag }