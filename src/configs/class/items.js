import {
  BoxGeometry,
  EdgesGeometry,
  MeshToonMaterial,
  Color,
  Mesh
} from 'three'

import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { SceneText } from '@/configs/class/text.js'
import { SMath } from '@/configs/class/math.js'

class SceneItems {

  /**
   * border
   * 
   */

  borderSize = {
    max: 0.002,
    min: 0,
    reg: 0.001
  }

  /**
   * custom instance
   * 
   */

  instance = {
    mesh: {

      /**
       * key: ID of instance
       * 
       * value: {
       *    item: {
       *      material:
       *      geometry: 
       *    },
       *    border: {
       *      material:
       *      geometry:  
       *    }
       * }
       * 
       */

    },
    group: {

      /**
       * key: ID of instance
       * 
       * value: {}
       *   
       * 
       */

    },
    list: {

      /**
       * key: ID of mesh
       * 
       * value: {
       *    item: {},
       *    text: {},
       *    border: {}    
       * }
       * 
       * 
       */

    },
    history: {
      
      /**
       * original data of receivers & list
       * 
       */

      group: {

        /**
         * key is ID of group
         * 
         */

      },
      list: {

        /**
         * key is ID of list
         * 
         */

      }
    }
  }

  selects = []
  inloads = []
  unloads = []
  exloads = []

  errorPress = []

  /**  
   * objects
   *
   */

  transport
  plus
  maxn
  axis

  constructor (y) {

    this.gridY = y

    /**
     * Item material by default
     * 
     */

    this.baseItemsMaterial = new MeshToonMaterial( {
      color: 0xffffff,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      transparent: true,
      opacity: 0.9,
      alphaTest: 0.5, 
      fog: false
    })

    /**
     * Border material by default
     * 
     */

    this.borderMaterial = new LineMaterial({
      color: 0x292929,
      linewidth: 0.001, // in world units with size attenuation, pixels otherwise
      vertexColors: false,
      dashed: false,
      alphaToCoverage: false,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      fog: false,
      transparent: false
    })

    /**
     * Item geometry default
     * 
     */

    this.BoxesGeometry = new BoxGeometry( 1, 1, 1 )

    /**
     * border geometry
     * 
     */

    this.BorderGeometry = new LineSegmentsGeometry().fromEdgesGeometry(new EdgesGeometry(this.BoxesGeometry))

  }

  setTransportData(fr) {

    /** размеры и параметры транспорта */
    this.transport = fr
  }

  /** 
   * 
   * meshes
   * 
   */

  addMesh(box, group, position, userData) {

    /** 
     * sibling id
     * 
     */

    const id = String(box.id)

    /**
     * create instance
     * 
     */

    // console.log(this.instance)

    if (!this.instance.mesh?.[id]) this.setInstance(id)

    /** 
     * instance mesh material add
     * 
     **/

    if (!this.instance.mesh[id].item.material) this.instance.mesh[id].item.material = this.baseItemsMaterial.clone()

    /** 
     * new mesh
     * 
     */

    const object = new Mesh(this.BoxesGeometry, this.instance.mesh[id].item.material)

    /**
     * mesh id
     * 
     */

    const mesh_id = String(object.id)

    object.name = mesh_id

    /**
     * user data 
     * 
     */

    if (userData) object.userData = userData

    /** 
     * get size
     * 
     */

    const size = {
      l: SMath.floorSize(box.length / 1000),
      h: SMath.floorSize(box.height / 1000),
      w: SMath.floorSize(box.width  / 1000)
    }

    /** 
     * color
     * 
     */

    object.material.color = new Color( parseInt ( box.color.replace('#','0x'), 16 ) )

    /**
     * position
     * 
     */

    object.position.z = position.z,
    object.position.y = position.y,
    object.position.x = position.x
    
    /**
     * scale
     * 
     */

    object.scale.y = size.h
    object.scale.x = size.w
    object.scale.z = size.l

    /**
     * set UserData_position 
     * 
     */

    this.setUserDataPos(object)

    /**
     * autoupdate
     * 
     */

    object.updateMatrix()
    object.matrixAutoUpdate = false

    /**
     * add instance group by sibling
     * temporary
     * 
     */

    /**
     * add instance list by mesh id
     * 
     */

    if (!this.instance.list?.[mesh_id]) this.instance.list = Object.assign(this.instance.list, { [mesh_id]: {} })

    this.instance.list[mesh_id].item = object

    /** 
     * 
     * border
     * 
     */

    if (!this.instance.mesh[id].border.material) this.instance.mesh[id].border.material = this.borderMaterial.clone()

    const border = this.addBorder(object, this.instance.mesh[id].border.material, 'b.' + mesh_id)

    /**
     * add instance list by mesh id
     * 
     */

    if (!this.instance.list[mesh_id].border) this.instance.list[mesh_id].border = border

    /**
     * text
     * 
     */

    const fontSize = SceneText.setFontSize(object)

    const text = SceneText.addText(
      id < 1000 ? id : box.subling,
      this.setPositionTopText(object, fontSize),
      'tp.' + mesh_id,
      fontSize
    )

    text.visible = true

    /**
     * add instance list by mesh id
     * 
     */

    if (!this.instance.list[mesh_id].text) this.instance.list[mesh_id].text = text

    /**
     * add group & scene
     * 
     */
    
    group.add(border)
    group.add(object)
    group.add(text)    

    /**
     * add pickups
     * 
     **/

    this.selects.push(object)

    /**
     * clear
     * 
     */

    text.dispose()
    object.geometry.dispose()
    object.material.dispose()
    border.geometry.dispose()
    border.material.dispose()

    return object
  }

  addItems(box, group) {

    /**
     * userData
     * 
     */

    const userData = this.makeItemUserData(box)

    const geoPos =  {
      z: SMath.floor(box.geo['y']) / 1000,
      y: SMath.floor(box.geo['z']) / 1000,
      x: SMath.floor(box.geo['x']) / 1000
    }
    
    SMath.floorVector(geoPos)

    /**
     * position
     * 
     */

    const position = {}

    position.z = geoPos.z + SMath.floor(SMath.floor(box.length / 1000) / 2) - this.transport.l2
    position.y = geoPos.y + SMath.floor(SMath.floor(box.height / 1000) / 2)
    position.x = geoPos.x + SMath.floor(SMath.floor(box.width  / 1000) / 2) - this.transport.w2

    SMath.floorVector(position)

    // console.log(position)

    /**
     * add scene
     * 
     */

    return this.addMesh(box, group, position, userData)
  }

  addExist(box, group, offset) {

    const userData = this.makeItemUserData(box)

    /** исключение для exist */

    userData._inFrame = false

    /**
     * position
     * 
     */

    const position = {}

    position.z = SMath.floor(box.length / 1000 / 2) + Number(this.transport.l2) * 1.2,
    position.y = SMath.floor(box.height / 1000 / 2) + this.gridY + 0.05,
    position.x = - offset - SMath.floor(box.width  / 1000 / 2)

    /**
     * add
     * 
     */

    return this.addMesh(box, group, position, userData)
  }

  makeItemUserData(box) {

    // console.log(box)

    const userData = {

      /** id строки в бэкенде */
      backID: Number(box.uid),

      /** id строки во фронтенде */
      listID: Number(box.id),

      /** id группы */
      pointID: Number(box.point),

      /** значения ярусов (постоянное) */
      stuck: Number(box.stuck),

      /** лимита нагрузки (постоянное - максимальное) */
      limit: 0,

      /** значение массы (постоянное) */
      weight: box?.weight ? SMath.getWght(box.weight) : 0,

      /** объём */
      volume: SMath.floor(box.length * box.width * box.height),

      /** кантования */
      overturn: box?.overturn ? true : false,

      /** поворот */
      rotate: box?.rotate ? true : false,
      
      /** значение (в текущий момент) давления сверху - прибавление */
      _press: 0,

      /** лимита нагрузки от соседей снизу с учетом текущего - убавление */
      _limit: 0, 

      /** 
       * массив ID предков по вертикали (примыкание только 1 уровень вниз)  
       * массив содержит объект { id: id, sq: Number }
       * 
       */

      /** touch */
      _touch: [],

      /** значение площади основания (в текущий момент) */
      _square: SMath.floorSize(box.length / 1000 * box.width / 1000),

      /** любое перекрытие данного места (в текущий момент) */
      _isCover: false,

      /** полное перекрытие данного места (в текущий момент) */
      _isCoverFull: false,

      /**  проверка где находится текущее место */
      _inFrame: true,

      /** box3 parametries */

      _position: {
        max: {
          x: 0,
          y: 0,
          z: 0
        },
        min: {
          x: 0,
          y: 0,
          z: 0
        }
      }
      
    }

    /**
     * установка нагрузки
     * 3 - Да
     * 1 - Да (с указанием нагрузки)
     * 
     */

    if (userData.stuck === 1 || userData.stuck === 3) {

      if (SMath.getWght(box.limit) > 0) {

        userData.limit = SMath.getWght(box.limit)

      } else {

        userData.limit = SMath.getWght(this.transport.wg)

      }

      /**
       * устнавливаем нагрузку динамиескую
       * 
       */
      
      userData._limit = userData.limit
    
    }

    return userData
  }

  setUserDataPos(mesh) {

    if (!mesh?.isMesh) return
    if (!mesh?.userData) return

    /**
     * max _position
     * 
     */
    
    mesh.userData._position.max.x = SMath.floor(mesh.position.x + SMath.floor(mesh.scale.x / 2))
    mesh.userData._position.max.y = SMath.floor(mesh.position.y + SMath.floor(mesh.scale.y / 2))
    mesh.userData._position.max.z = SMath.floor(mesh.position.z + SMath.floor(mesh.scale.z / 2))

    /**
     * min _position
     * 
     */

    mesh.userData._position.min.x = SMath.floor(mesh.position.x - SMath.floor(mesh.scale.x / 2))
    mesh.userData._position.min.y = SMath.floor(mesh.position.y - SMath.floor(mesh.scale.y / 2))
    mesh.userData._position.min.z = SMath.floor(mesh.position.z - SMath.floor(mesh.scale.z / 2))

    // console.log(mesh.userData._position)

    return
  }

  addBorder(object, material, name = '') {

    /** 
     * instance border
     * 
     */

    const border = new Line2(
      this.BorderGeometry,
      material
    )

    border.position.x = object.position.x
    border.position.y = object.position.y
    border.position.z = object.position.z
    
    border.scale.x = object.scale.x
    border.scale.y = object.scale.y
    border.scale.z = object.scale.z

    /**
     * name
     * 
     */

    border.name = name

    /**
     * autoupdate
     * 
     */

    border.updateMatrix()
    border.matrixAutoUpdate = false

    /**
     * return
     * 
     */

    return border

  }

  addHoverBorder() {

    /**
     * 
     * border max of hover mesh
     * 
     */

    const geo = new LineSegmentsGeometry().fromEdgesGeometry(new EdgesGeometry(this.BoxesGeometry.clone()))
    const mat = this.borderMaterial.clone()

    mat.linewidth = this.borderSize.max

    const borders = new Line2(
      geo, 
      mat
    )

    borders.name = 'borders'
    borders.visible = false

    borders.updateMatrix()
    borders.matrixAutoUpdate = false
    
    geo.dispose()
    mat.dispose()

    return borders

  }

  rotateItem(origin) {

    const l = origin.scale.z
    const w = origin.scale.x
    const h = origin.scale.y

    origin.scale.x = l
    origin.scale.z = w
    origin.scale.y = h

    origin.updateMatrix()

    const border = this.getBorderByMeshID(origin.id)

    if (border?.isMesh) {

      border.scale.x = l
      border.scale.z = w
      border.scale.y = h

      border.updateMatrix()

    }    

  }

  overturnItem(origin) {

    const l = origin.scale.z
    const w = origin.scale.x
    const h = origin.scale.y

    origin.scale.x = h
    origin.scale.z = w
    origin.scale.y = l

    origin.userData._square = SMath.floorSize(origin.scale.x  * origin.scale.z)
    origin.updateMatrix()

    const border = this.getBorderByMeshID(origin.id)

    if (border?.isMesh) {

      border.scale.x = l
      border.scale.z = w
      border.scale.y = h

      border.updateMatrix()

    }
  }

  /**
   * 
   * top mesh
   * 
   */

  setPositionTopText(object, fontSize, position = '') {

    /**
     * при пенпердикулярном просмотре оси координат вдоль длины ТС
     * y - глубина 
     * x - 
     * z - 
     * 
     */

    const f2 = fontSize / 2

    const rs = {
      y: object.position.y + SMath.floor(object.scale.y / 2),
      x: 0,
      z: 0
    }

    switch (position) {

    case 'left':

      /**
       * left center
       * 
       */

      rs.x = object.position.x + SMath.floor(object.scale.x / 2) - f2
      rs.z = object.position.z

      break
    case 'right':

      /**
       * rigth center
       * 
       */

      rs.x = object.position.x - SMath.floor(object.scale.x / 2) + f2
      rs.z = object.position.z

      break
    case 'top':

      /**
       * top center
       * 
       */

      rs.x = object.position.x
      rs.z = object.position.z + SMath.floor(object.scale.z / 2) - f2

      break   
    
    case 'bottom':

      /**
       * bottom center
       * 
       */

      rs.x = object.position.x
      rs.z = object.position.z - SMath.floor(object.scale.z / 2) + f2

      break 
    default:

      /**
       * top + left by default
       * 
       */

      rs.x = object.position.x + SMath.floor(object.scale.x / 2) - f2
      rs.z = object.position.z + SMath.floor(object.scale.z / 2) - f2
    }

    // console.log(object.position)

    return rs

  }

  textTopVisibleAuto(array = this.selects) {

    /**
     * Автоматическая установка видимости надписи ID
     * на верхней плоскости груза
     * 
     */

    if (!array.length) return

    /**
     * loop
     * 
     */

    for (let x = 0; x < array.length; x ++) {        

      /**
       * tp object
       * 
       */

      const text = this.getTextByMeshID(array[x].id)

      if (array[x].userData._isCoverFull) {

        /**
         * invisible
         * 
         */

        text.visible = false

      } else {

        /**
         * visible
         * 
         */

        text.visible = true

      }
    }

  }

  /**
   * 
   * instance functions
   * 
   */

  setInstance(id) {

    /**
     * add new item 
     * 
     */

    const key = {
      [id]: {
        item: {
          geometry: null,
          material: null
        },
        border: {
          geometry: null,
          material: null
        }
      }  
    }

    // console.log(this.instance, key)

    this.instance.mesh = Object.assign(this.instance.mesh, key)

  }

  setInstanceHistory(object) {

    /**
     * save group history array
     * 
     */

    const groupID = object.id

    if (this.instance.history.group[groupID] === undefined) {

      const group = {
        [groupID]: {
          id: object.id,
          name: object.name,
          data: [],
          list: []
        }
      }

      this.instance.history.group = Object.assign(this.instance.history.group, group)

    }

    /**
     * save item / list history
     * 
     */

    for (let a = 0; a < object.list.length; a ++) {

      const listID = object.list[a].id

      if (this.instance.history.list[listID] === undefined) {

        const list = {
          [listID]: Object.assign({}, object.list[a])
        }

        delete list[listID].count

        this.instance.history.list = Object.assign(this.instance.history.list, list)

      }

    }

  }

  delInstance() {

    /**
     * remove geometries && materials
     * 
     */

    for (const mesh in this.instance.mesh) {

      if (mesh.item?.geometry) mesh.item.geometry.dispose()
      if (mesh.item?.material) mesh.item.material.dispose()

      if (mesh.border?.geometry) mesh.border.geometry.dispose()
      if (mesh.border?.material) mesh.border.material.dispose()

    }

    this.instance.mesh = Object.assign({})

    /**
     * remove groups
     * 
     * 
     */

    for (const mesh in this.instance.group) {

      if (mesh?.isGroup) mesh.removeFromParent()

    }

    /**
     * remove items list
     * 
     */

    for (const mesh in this.instance.list) {

      if (mesh) {
        this.removeMesh(mesh.item)
        this.removeMesh(mesh.border)

        if (mesh.text) mesh.text.dispose()
      }

    }

    this.instance.list = Object.assign({})

    /**
     * original data clear
     * 
     * 
     */

    this.instance.history.group = Object.assign({})
    this.instance.history.list = Object.assign({})

    return    
  }

  removeMesh(obj, parent = true) {

    if (!obj) return
    
    const meshes = []

    obj.traverse((object) => {

      if (object.isMesh && !object?.isLine2) meshes.push(object)

    })

    for (let i = 0; i < meshes.length; i ++) {

      meshes[i].material.dispose()
      meshes[i].geometry.dispose()

      obj.remove(meshes[i])
    }

    /**
     * прервать если не нужно удалять саму группу
     * 
     */

    if (!parent) return

    if (obj.parent) {

      const { parent } = obj

      parent.remove(obj)
    }      

    obj = null

    return
  }

  /**
   * 
   * getFromInstance
   * 
   */

  getBorderByMeshID(mesh_id) {

    if (!mesh_id) return false

    if (!this.instance?.list[mesh_id]?.border) return false

    return this.instance.list[mesh_id].border
  }

  getTextByMeshID(mesh_id) {

    if (!mesh_id) return false

    if (!this.instance?.list[mesh_id]?.text) return false

    return this.instance.list[mesh_id].text
  }

  getItemByMeshID(mesh_id) {

    if (!mesh_id) return false

    if (!this.instance?.list[mesh_id]?.item) return false

    return this.instance.list[mesh_id].item
  }

  getItemStatusForDrag(object, cover = true) {

    /**
     * проверка объекта
     * 
     */

    if (!object?.isMesh) return false

    /**
     * функция для проверки позиции
     * для выполнения drag перемещения
     * 
     */

    /** проверить на вхождение в exist */

    if (object.parent.name === 'exist') return false

    /** проверить на вхождение в instance и userData.isCover */
    /** флаг cover для наличия / отсутсвия проверки */

    if (cover && object.userData?._isCover) return false

    return true

  }

  getRecieversArray() {

    /**
     * составить и вернуть массив по ключам - группам из массива Inloads
     * 
     */

    let array = []

    for (let x = 0; x < this.inloads.length; x ++) {

      /** 
       * check by pointID
       * 
       */

      if (this.inloads[x].userData.pointID) {

        /** 
         * pointID 
         * 
         */

        const { pointID } = this.inloads[x].userData

        /** find */

        let findIndex = array.findIndex((i) => String(i.id) === String(pointID))

        /** 
         * create if no find
         * 
         */

        if (findIndex === -1) {

          const history = Object.values(this.instance.history.group)

          const groupIndex = history.findIndex((i) => String(i.id) === String(pointID))

          array.push({ id: pointID, list: [], index: groupIndex + 1 })

          findIndex = array.length - 1

        }

        /** 
         * add 
         * 
         */

        array[findIndex].list.push(this.inloads[x])

      }

    }

    /**
     * sort по возрастанию
     * 
     */

    array = array.sort((a, b) => a.index > b.index ? 1 : -1)

    return array

  }

  /** 
   * 
   * move  & count
   *
   */

  removeFromDragGroup(mesh) {

    if (!mesh?.isMesh) return false

    /**
     *  получить индексы
     * 
     */

    const indexIn = this.unloads.findIndex((i) => String(i.id) === String(mesh.id))
    const indexUn = this.inloads.findIndex((i) => String(i.id) === String(mesh.id))

    /**
     *  удаляем элемент из массива unloads 
     * 
     */

    if (indexIn !== -1) this.unloads.splice(indexIn, 1)

    /**
     *  удаляем элемент из массива unloads 
     * 
     */

    if (indexUn !== -1) this.inloads.splice(indexUn, 1)

    /** check */

    if (indexUn === -1 && indexIn === -1) {
      console.error('mesh group lost')
      // console.error(mesh)

      // console.log(this.inloads)
      // console.log(this.unloads)

      return false
    }

    // console.log('removeFromDragGroup')

    // console.log(this.inloads)
    // console.log(this.unloads)

    /** defult */

    return true

  }

  addToDragGroup(mesh) {

    if (!mesh?.isMesh) return

    /**
     * в зависимости от параметра inFrame
     * добавляем объект в соответсвующею группу
     * 
     */

    mesh.userData._inFrame ? this.inloads.push(mesh) : this.unloads.push(mesh)

    return
  
  }

  countPlus() {

    this.plus = { wg: 0, cn: 0, vl: 0 }

    /** 
     * присвоение
     * 
     */

    for (let x = 0; x < this.inloads.length; x ++ ) {

      this.plus.wg = SMath.getWght(this.plus.wg + this.inloads[x].userData.weight)
      this.plus.vl = SMath.floor(this.plus.vl + this.inloads[x].userData.volume)
      this.plus.cn = this.plus.cn + 1
      
    }

    /**
     * округление
     * 
     */

    // console.log(this.plus)

    if (this.plus.wg) SMath.getWght(this.plus.wg)
    if (this.plus.vl) SMath.floor(this.plus.vl)

  }

  countMaxn() {

    const maxSize = {
      h: 0,
      l: -this.transport.l2,
      w: -this.transport.w2
    }

    const minSize = {
      h: 0,
      l: -this.transport.l2,
      w: -this.transport.w2
    }

    for (let x = 0; x < this.inloads.length; x ++ ) {

      const max = {
        x: this.inloads[x].position.x + SMath.floor(this.inloads[x].scale.x / 2),
        y: this.inloads[x].position.y + SMath.floor(this.inloads[x].scale.y / 2),
        z: this.inloads[x].position.z + SMath.floor(this.inloads[x].scale.z / 2)
      }

      const min = {
        x: this.inloads[x].position.x - SMath.floor(this.inloads[x].scale.x / 2),
        y: this.inloads[x].position.y - SMath.floor(this.inloads[x].scale.y / 2),
        z: this.inloads[x].position.z - SMath.floor(this.inloads[x].scale.z / 2)
      }

      /**
       * округление 
       * 
       */

      SMath.floorVector(max)
      SMath.floorVector(min)

      /**
       * обновление
       * 
       */

      if (max.y > maxSize.h) maxSize.h = max.y
      if (max.z > maxSize.l) maxSize.l = max.z
      if (max.x > maxSize.w) maxSize.w = max.x

      if (min.y < minSize.h) minSize.h = min.y
      if (min.z < minSize.l) minSize.l = min.z
      if (min.x < minSize.w) minSize.w = min.x

    }

    /**
     * сдвиг и округление 
     * 
     */

    maxSize.l = SMath.floor(maxSize.l + this.transport.l2)
    maxSize.h = SMath.floor(maxSize.h)
    maxSize.w = SMath.floor(maxSize.w + this.transport.w2)

    minSize.l = SMath.floor(minSize.l + this.transport.l2)
    minSize.h = SMath.floor(minSize.h)
    minSize.w = SMath.floor(minSize.w + this.transport.w2)

    /**
     * сдвиг и округление 
     * 
     */

    this.maxn = { l: 0, h: 0, w: 0 }

    this.maxn.l = SMath.floor(SMath.floor(maxSize.l - minSize.l) * 1000)
    this.maxn.h = SMath.floor(SMath.floor(maxSize.h - minSize.h) * 1000)
    this.maxn.w = SMath.floor(SMath.floor(maxSize.w - minSize.w) * 1000)

    // console.log('maxn')
    // console.log(this.maxn)

  }

  countAxis() {
    
    // console.log('count axies')

    this.axis = {
      x: 0,
      tt: [],
      pp: []
    }

    /**
    * расстояние от центра тяжести пп с грузом до центра оси xpp
    * 
    */

    let xim = 0
    let mgr = 0
    let x1, x2, n, n1, n2, n3

    /**
    * координата оси
    * 
    */

    switch (this.transport.ex) {
    case 1:
      x2 = this.transport.axis['pp']['l3']
      break
    case 2: 
      x2 = this.transport.axis['tt']['l1']
      break
    } 

    /**
     * центр тяжести груза
     * 
     */

    let a = 0

    for (let x = 0; x < this.inloads.length; x ++) {

      /**
       * расстояние центра груза от РО
       * 
       */

      x1 = SMath.floor((this.inloads[x].position.z + this.transport.l2) * 1000 - x2)

      /**
       * числ и знам.
       * 
       */

      xim += this.inloads[x].userData.weight * x1
      mgr += this.inloads[x].userData.weight

    }

    /**
     * центр тяжести груза при наличии
     * 
     */

    if (this.inloads.length) a = Math.round(xim / mgr)

    switch ( this.transport.ex ) {
    case 1:
        
      n = Math.abs(Math.round((mgr * a + this.transport.axis['pp']['wg'] * this.transport.axis['pp']['x']) / this.transport.axis['pp']['l2']))
      n3 = Math.round(mgr + this.transport.axis['pp']['wg'] - n)
      n2 = Math.round((this.transport.axis['tt']['wg'] * this.transport.axis['tt']['x'] + n * this.transport.axis['tt']['l1']) / this.transport.axis['tt']['l'])
      n1 = Math.round(this.transport.axis['tt']['wg'] + n - n2)

      break
    case 2: 
        
      n1 = Math.abs(Math.round((mgr * a + this.transport.axis['tt']['wg'] * this.transport.axis['tt']['x']) / this.transport.axis['tt']['l']))
      n2 = Math.round(mgr + this.transport.axis['tt']['wg'] - n1)

      break
    }

    /**
    * расстояние от центра тяжести груза до центра оси
    * 
    */
 
    this.axis['x'] = SMath.floor(a)

    /**
     * расчеты тягача
     * первая ось тягача
     * 
     */

    this.axis['tt'].push(SMath.getWght(n1))
 
    /**
     * вторая ось тягача
     * 
     */
 
    if (this.transport.axis['tt']['a'] === 2) {

      this.axis['tt'].push(SMath.getWght(n2))

    } else if (this.transport.axis['tt']['a'] === 3) {

      const d1 = Math.round(n2 / 2)
      const d2 = n2 - d1

      this.axis['tt'].push(SMath.getWght(d1))
      this.axis['tt'].push(SMath.getWght(d2))

    }

    if (this.transport.ex === 1) {

      /**
       * результат пп
       * 
       */

      const ax = Math.round(n3 / this.transport.axis['pp']['a'])

      /**
       * запись
       * 
       */

      for (let x = 0; x < this.transport.axis['pp']['a']; x ++) this.axis['pp'].push(SMath.getWght(ax))

    }

  }

  itemOverPressTest(item) {

    // console.log('itemOverPressTest start')
    // console.log(this.errorPress)

    /**
     * создание коллеции перегруженных мест
     * 
     */

    const x = this.errorPress.findIndex((i) => String(i.id) === String(item.userData.backID))

    if (item.userData._limit < 0) {
      
      if (x === -1) this.errorPress.push({ id: item.userData.backID, listID: item.userData.listID })

    } else {

      if (x !== -1) this.errorPress.splice(x, 1)

    }

    // console.log('itemOverPressTest end')
    // console.log(this.errorPress)
  }

  countPressLimit(userData, weight, bool = true) {

    /**
     * старнадртное выполнение
     * 
     */

    const touch = [...userData._touch]
    const square = userData._square

    /**
     * loop
     * 
     */

    for (let x = 0; x < touch.length; x ++) {

      /**
       * проверить ID
       * 
       */

      if (touch[x].id) {

        /**
         * получить item
         * 
         */

        const item = this.getItemByMeshID(touch[x].id)

        /**
         * изменить нагрузку
         * 
         */

        if (item?.isMesh) {

          /**
           * рассчитать текущую нагрузку от родителя используюя размер пересечения их площадей (sq)
           * итого wg - давление на родителя при частичном / полном пересечении
           */

          const wg = SMath.getWght( SMath.floorSize((SMath.floorSize((touch[x].sq * 100) / square)) * weight) / 100)

          /**
           * вычисляем давление площади соприкосновения
           * 
           */

          /**
           * make 
           * _press
           * _limit
           * 
           */

          if (bool) {

            item.userData._press = SMath.getWght(item.userData._press + wg)
            item.userData._limit = SMath.getWght(item.userData._limit - wg)

          } else {

            item.userData._press = SMath.getWght(item.userData._press - wg)
            item.userData._limit = SMath.getWght(item.userData._limit + wg)

          } 

          /** notice about over limit */

          this.itemOverPressTest(item)

          /**
           * get error
           * 
           */

          if (item.userData._press < 0 || item.userData._press > this.transport.wg) {
            console.error('Error! The wrong _press')
            console.error(item.userData._press)

            // console.log(item)
          }
        
          /**
           * проверить наследников нагрузки
           * 
           */

          if (item.userData._touch.length) this.countPressLimit(item.userData, wg, bool)

        }

      }     

    }

    return

  }

  /** 
   * 
   * clear
   * 
   */

  clear() {

    /**
     * remove instance
     * 
     */

    this.delInstance()

    /**
     * clear arrays
     * 
     */

    this.selects = []
    this.inloads = []
    this.unloads = []
    this.exloads = []

    this.errorPress = []

  }

  dispose() {

    /**
     * clear
     * 
     */

    this.clear()

    /**
     *  dispose 
     * 
     */

    this.baseItemsMaterial.dispose()    
    this.borderMaterial.dispose()
    this.BoxesGeometry.dispose()
    this.BorderGeometry.dispose()

    /**
     * remove
     * 
     */

    this.transport = null
    this.plus  = null
    this.maxn  = null
    this.axis  = null
    this.gridY  = null

  }

}

export { SceneItems }