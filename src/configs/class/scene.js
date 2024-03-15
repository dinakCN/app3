import {
  Fog,
  GridHelper,
  BoxGeometry,
  PlaneGeometry,
  EdgesGeometry,
  BufferGeometry,
  // BufferAttribute,
  // ArrowHelper,
  Plane,
  // Matrix4,
  Line,
  LineSegments,
  LineBasicMaterial,
  MeshBasicMaterial,
  // MeshToonMaterial,
  MeshPhongMaterial,
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  AmbientLight,
  DirectionalLight,
  Box3,
  // Box3Helper,
  Vector3,
  Vector2,
  Color,
  Mesh,
  Group,
  Raycaster,
  EventDispatcher
} from 'three'

import Stats from 'three/examples/jsm/libs/stats.module.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import TWEEN from '@tweenjs/tween.js'
import { getWght } from '@/configs/functions/getunits.js'

import { SceneItems }  from '@/configs/class/items.js'
import { SceneDrag }  from '@/configs/class/drag.js'
import { SceneText } from '@/configs/class/text.js'
import { SceneStep } from '@/configs/class/steps.js'
import { SMath } from '@/configs/class/math.js'

const planeHeight = 0.03
const gridY = - 1.34

/**
 * metr 
 * 
 */

const metrFontSize = 0.2

const metrParams = {
  position: {
    x: 0,
    y: gridY + metrFontSize,
    z: 0
  },
  margin: {
    line: 0.65,
    text: 0.9
  },
  length: {
    name: 'length',
    rotation: {
      x: -0.5 * Math.PI,
      z: -0.5 * Math.PI  
    }
  }, 
  width: {
    name: 'width',
    rotation: {
      x: -0.5 * Math.PI,
      z: Math.PI
    }
  }
}

/**
 * custom classes
 * 
 */

const Item = new SceneItems(gridY)
const Drag = new SceneDrag()
const Step = new SceneStep()

/**
 * three classes
 * 
 */

const pointer = new Vector2()
const raycaster = new Raycaster()
const intersections = []
const _plane = new Plane()
const _worldPosition = new Vector3()

class SceneCreate extends EventDispatcher {

  setup = false

  /**
   * loader models
   * 
   */

  FBX = null

  stats     = null
  animateID = null
  fr        = null

  scene     = null

  /** грани транспорта */
  frame     = null

  /** кубоид транспорта */
  loads     = null

  /** плоскость транспорта */
  panel     = null

  /** базовый ярус */
  grid      = null

  /** кубоид склада */
  floor     = null

  camera    = null
  renderer  = null
  controls  = null
  
  /** флаг выполнения orbit controls */
  orbits = null

  dragctrl  = null
  dragable  = []

  /** drag switch */

  dragging  = true

  hover     = null
  hovered   = null
  borders   = null

  /**
   * metr group
   * 
   */

  metrtext  = null
  metrline  = null

  /**
   * axis annotate group
   * 
   */

  annotate = null

  /**
   * meshes group
   * 
   */

  allMeshGroup = null

  /**
   * make three
   * 
   */

  constructor(dragging = true) {
    
    super()

    /** init */

    this.init()

    /**
     * switch dragging move 
     * 
     */

    this.dragging = dragging

  }

  /**
   * 
   * init
   * 
   */

  init()  {

    // console.log('init')

    /**
     * add scene
     * 
     */

    this.addScene()

    /**
     * make all items group
     * 
     */

    this.allMeshGroup = new Group()
    
    this.allMeshGroup.name = 'all'
    this.allMeshGroup.updateMatrix()
    this.allMeshGroup.matrixAutoUpdate = false

    this.scene.add(this.allMeshGroup)

    /** make metr group */

    this.metrtext = new Group()
    this.metrtext.updateMatrix()
    this.metrtext.matrixAutoUpdate = false

    this.scene.add(this.metrtext)

    this.metrline = new Group()
    this.metrline.updateMatrix()
    this.metrline.matrixAutoUpdate = false

    this.scene.add(this.metrline)

    /**
     * annotate axis
     * 
     */

    this.annotate = new Group()
    this.annotate.name = 'annotate'
    this.annotate.matrixAutoUpdate = false

    this.scene.add(this.annotate)

    /**
     * hover group
     * 
     */

    this.hover = new Group()

    this.hover.name = 'hover'
    this.hover.matrixAutoUpdate = false

    this.scene.add(this.hover)

    /**
     * floor & plane
     * 
     */

    this.addFloor()
    this.addPlane()

    /**
     * FBX
     * 
     */
 
    this.FBX = new FBXLoader()

    /**
     * Drag init
     * 
     */

    Drag.init(this.scene)

    /**
     * addHoverBorder
     * 
     */

    this.addHoverBorder()

    /**
     * render
     * 
     */
    
    this.addRenderer()

    /**
     * camera 
     * 
     */

    this.addCamera()

    /**
     * controls
     * 
     */

    this.addControls()
    this.addDragControls()

    /**
     * camera setting
     * 
     */

    this.resizeRendererToDisplaySize()

    /**
     * only for dev
     * 
     */

    if (process.env.NODE_ENV !== 'production') this.makeStats()

    /**
     * add events
     * 
     */

    this.events()

    /**
     * flag
     * 
     */

    this.setup = true

  }

  addTransport(object)  {

    // console.log('addTransport')

    /**
     * data
     * 
     */

    if (!object?.size) return

    /**
     * set freightsize
     * 
     */

    // console.log(object) 

    this.fr = {
      w: SMath.floor(object.size.base.wd / 1000),
      l: SMath.floor(object.size.base.ln / 1000),
      h: SMath.floor(object.size.base.hg / 1000),
      wg: SMath.getWght(object.size.base.wg),
      tp: object.tp,
      ex: object.ex,
      ax: object?.ax ? true : false,
      axis: object?.axis ? object.axis : false,
      w2: 0,
      l2: 0,
      h2: 0        
    }
    
    this.fr.w2 = SMath.floor(this.fr.w / 2)
    this.fr.l2 = SMath.floor(this.fr.l / 2)
    this.fr.h2 = SMath.floor(this.fr.h / 2)

    // console.log(this.fr)

    /**
     * set transport to item
     * 
     */

    Item.setTransportData(this.fr)

    /**
     * floor in transport
     * 
     */
        
    this.setPlane()

    /**
     * floor on ground
     * 
     */

    this.setFloor()

    /**
     * borders
     * parent of models
     * 
     */

    this.setFrame()

    /**
     * Drag set loads attr
     * 
     */

    Drag.setFrameAttr(this.loads)

    /**
     * models
     * child of frame
     * 
     */

    this._models()

    /**
     * set zoom
     * 
     */

    this.zoomCameraToSelection()

  }
  
  addItems(scene_id, object)  {

    // console.log('addItems')

    /**
     * data
     * 
     */

    if (!object?.size) return

    /**
     * get recieviers
     * 
     */

    const receivers = object.step[scene_id].base 

    /** 
     *  добавяляем item
     * 
     */
    
    for (let x = 0; x < receivers.item.length; x++) {

      /**
       * make history
       * 
       */

      Item.setInstanceHistory(receivers.item[x])

      /** 
       * add group
       * 
       */

      const group = new Group()

      group.updateMatrix()
      group.matrixAutoUpdate = false
      group.name = receivers.item[x].id

      /**
       * add
       * 
       */

      for (let a = 0; a < receivers.item[x].data.length; a++) {

        /** 
         * создать item
         * 
         */

        const item = Item.addItems(receivers.item[x].data[a], group)

        /** 
         * добавить в массив inloads
         * 
         */

        Item.inloads.push(item)

        // if (Drag.detectCollisions(item, Item.inloads)) console.log('collision  true')
      
      }

      this.allMeshGroup.add(group)

    }

    /** 
     *  добавяляем floor
     * 
     */

    if (Array.isArray(object.floor)) {

      for (let x = 0; x < object.floor.length; x++) {

        /**
         * make history
         * 
         */

        Item.setInstanceHistory(object.floor[x])

        /** get group */

        let group

        if (!this.scene.getObjectByName(object.floor[x].id)) {

          /** add */

          group = new Group()

          group.updateMatrix()
          group.matrixAutoUpdate = false
          group.name = object.floor[x].id

        } else {

          /** set */

          group = this.scene.getObjectByName(object.floor[x].id)

        }

        /**
         * add item
         * 
         */

        for (let a = 0; a < object.floor[x].data.length; a++) {
          
          Item.unloads.push(Item.addItems(object.floor[x].data[a], group))

        }

        this.allMeshGroup.add(group)

      }

    }

    // console.log(Item.instance.history.group)

    /**
     * add exist
     * 
     */

    if (object.exist.length) {

      /**
       * exist group 
       * 
       */

      const existGroup = new Group()

      existGroup.name = 'exist'

      /**
       * base offset
       * 
       */

      let z = this.fr.w * 2.5

      /**
       * add exist item
       * 
       */

      object.exist.forEach((i) => {

        /**
         * add in history item
         * 
         */

        const listID = i.id

        if (Item.instance.history.list[listID] === undefined) {
  
          const list = {
            [listID]: Object.assign({}, i)
          }
  
          delete list[listID].count
  
          Item.instance.history.list = Object.assign(Item.instance.history.list, list)
  
        }

        /**
         * add item
         * 
         */

        Item.exloads.push(Item.addExist(i, existGroup, z))

        z += i.width / 1000
      })

      /**
       * add exist group
       * 
       */
      
      existGroup.updateMatrix()
      existGroup.matrixAutoUpdate = false

      this.allMeshGroup.add(existGroup)
    }

    for (let x = 0; x < Item.inloads.length; x ++) {

      /**
       * найти родителей по вертикали вниз
       * 
       */

      Item.inloads[x].userData._touch = Drag.findTouchArray(Item.inloads[x], Item.inloads, 'bottom')

    }

    for (let x = 0; x < Item.inloads.length; x ++) {

      /**
       * установить нагрузку родителям по вертикали
       * 
       */

      if (Item.inloads[x].userData._touch) Item.countPressLimit(Item.inloads[x].userData, Item.inloads[x].userData.weight, true)

    }

    /**
     * операции для перемещаемых объектов
     * 
     */

    const draggable = [...Item.inloads, ...Item.unloads]

    /**
     * вычисляемые параметры userData
     * 
     */
    
    for (let x = 0; x < draggable.length; x ++) {

      /**
       * top cover auto
       * 
       */

      const { _isCover, _isCoverFull } = Drag.getIsCover(draggable[x], Item.inloads)

      /**
       *  любое перекрытие
       * 
       */

      draggable[x].userData._isCover = _isCover

      /** 
       * частичное перекрытие
       * 
       */

      draggable[x].userData._isCoverFull = _isCoverFull

      /**
       * top text visible auto
       * 
       */

      Item.textTopVisibleAuto([draggable[x]])

      /**
       * inFrame
       * 
       */

      draggable[x].userData._inFrame = Drag.detectInFrame(draggable[x], this.loads)

    }

    // console.log(Item.inloads)
    // console.log(Item.unloads)

    /**
     * counted parametres
     * 
     */

    Item.countPlus()
    Item.countMaxn()

    if (this.fr.ax && this.fr.tp === 0) {
      
      Item.countAxis()

      /**
       * смена текста на сцене
       * 
       */

      Item.axis['tt'].forEach((i, x) => {
        const o = this.scene.getObjectByName('tt.' + x)

        if (o) o.text = i
      })

      Item.axis['pp'].forEach((i, x) => {
        const o = this.scene.getObjectByName('pp.' + x)

        if (o) o.text = i
      })

    }

    /**
     * 
     * animate
     * 
     * 
     */

    this.animate()

  }

  /**
   * clear
   * 
   */

  clearTransport() {

    // console.log('clearTransport')

    /**
     * clear frame
     * 
     */

    while (this.frame?.children.length) Item.removeMesh(this.frame.children[0])    
    while (this.loads?.children.length) Item.removeMesh(this.loads.children[0])
    while (this.panel?.children.length) Item.removeMesh(this.panel.children[0])

    /**
     * remove from scene
     * 
     */

    Item.removeMesh(this.frame)
    this.scene.remove(this.frame)

    /**
     * clear metr
     * 
     */

    while (this.metrtext?.children.length) Item.removeMesh(this.metrtext.children[0])
    while (this.metrline?.children.length) Item.removeMesh(this.metrline.children[0])

    /**
     * clear annotate
     * 
     */

    while (this.annotate?.children.length) Item.removeMesh(this.annotate.children[0]) 

  }

  clearItems() {

    // console.log('clearItems')

    cancelAnimationFrame(this.animateID)

    /**
     * remove all hovers
     * 
     */

    this.removeHoverMeshes()

    /**
     * remove all meshes from scene
     * 
     */

    for (let x = 0; x < this.allMeshGroup.children.length; x ++) {

      /**
       * удаляем меши из групп получателей
       * 
       */

      while (this.allMeshGroup.children[x].children.length) Item.removeMesh(this.allMeshGroup.children[x].children[0])
      
    }

    /**
     * удаляем группы получателей
     * 
     */

    while (this.allMeshGroup.children.length) this.allMeshGroup.remove(this.allMeshGroup.children[0])

    /**
     * dragable
     * 
     */

    this.dragable.length = 0
    intersections.length = 0

    /**
     * remove groups
     * 
     */

    this.hovered = null

    /**
     * drag clear
     * 
     */

    Drag.clear()

    /**
     * item dispose
     * 
     */

    Item.clear()

    /**
     * renderLists dispose
     * 
     */

    this.renderer.renderLists.dispose()

  }
  
  dispose() {

    // console.log('dispose()')

    if (!this.scene) return

    /**
     * clear
     * 
     */

    this.clearItems()
    this.clearTransport()

    /**
     * drag clear
     * 
     */

    Drag.dispose()

    /**
     * item dispose
     * 
     */

    Item.dispose()

    /**
     * remove orbit controls events
     * 
     */
    
    this.controls.removeEventListener( 'start', () => this.onOrbitStart())
    this.controls.removeEventListener( 'end', () => this.onOrbitEnd())

    /**
     * remove controls
     * 
     */

    if (this.camera) this.camera.clear()    
    if (this.controls) this.controls.dispose()

    /** remove drag events */

    this.dragctrl.removeEventListener( 'dragstart', (event) => this.onDragStart(event) )
    this.dragctrl.removeEventListener( 'drag', (event) => this.onDrag(event) )
    this.dragctrl.removeEventListener( 'dragend', (event) => this.onDragEnd(event) )

    if (this.dragctrl) this.dragctrl.dispose()

    /**
     * solo meshes
     * 
     */

    Item.removeMesh(this.hover)
    this.scene.remove(this.hover) 

    Item.removeMesh(this.metrtext)
    this.scene.remove(this.metrtext)

    Item.removeMesh(this.metrline)    
    this.scene.remove(this.metrline)

    Item.removeMesh(this.loads)
    this.scene.remove(this.loads)

    Item.removeMesh(this.panel)
    this.scene.remove(this.panel)

    Item.removeMesh(this.borders)
    this.scene.remove(this.borders)

    Item.removeMesh(this.annotate)
    this.scene.remove(this.annotate) 

    /**
     * remove grid
     * 
     */

    if (this.grid?.isLineSegments) this.grid.dispose() 

    /**
     * dispose scene
     * 
     */

    while (this.scene?.children.length) Item.removeMesh(this.scene.children[0])

    Item.removeMesh(this.scene)

    /**
     * 
     * remove listeners
     * 
     */

    if (this.renderer) {

      this.renderer.domElement.removeEventListener('pointermove', (event) => this.onPointerMove(event) )

      this.renderer.renderLists.dispose()
    }

    document.removeEventListener('keydown', (event) => this.onKeyDown(event))

    this.fr        = null
    this.scene     = null

    /** 
     * frame line & parent
     * 
     */

    this.frame     = null
    this.panel     = null

    /** 
     * cube of transport
     * 
     */

    this.loads     = null

    /** 
     * cube of warehouse
     * 
     */

    this.floor     = null

    this.grid      = null
 
    this.camera    = null

    this.controls  = null

    /** flag fires when orbit controls in process */

    this.orbits    = null

    this.dragctrl  = null

    this.animateID = null

    this.borders   = null

    /**
     * metr
     * 
     */

    this.metrtext  = null
    this.metrline  = null

    /**
     * drag dispoce
     * 
     */

    Drag.dispose()

    /**
     * item dispose
     * 
     */

    Item.dispose()

    /**
     * step
     * 
     */

    Step.dispose()

    /**
     * loader
     * 
     */
    
    this.FBX = null

    /**
    * renderer
    * 
    */

    this.renderer.dispose()
    this.renderer  = null

    /**
     * stats
     * 
     */

    if (process.env.NODE_ENV !== 'production') {

      const stats = document.getElementById('stats')

      if (stats) document.body.removeChild(stats)

      this.stats = null

    }

    /** flag */

    this.setup = false

    // console.log('this.frame')
    // console.log(this.frame)

    // console.log('this.panel')
    // console.log(this.panel)

    // console.log('this.borders')
    // console.log(this.borders)

    // console.log('this.scene')
    // console.log(this.scene)

    // console.log('this.renderer')
    // console.log(this.renderer)
  }

  makeStats() {

    this.stats = new Stats()

    this.stats.dom.id = 'stats'

    document.body.appendChild(this.stats.dom)
  }

  render() {
    if (!this.renderer) return

    this.renderer.render(this.scene, this.camera)

    // if (process.env.NODE_ENV !== 'production') this.cameraHelper()    
  }

  cameraHelper() {
    const camPositionSpan = document.getElementById('position')
    
    camPositionSpan.innerHTML = `Position: (${this.camera.position.x.toFixed(1)}, ${this.camera.position.y.toFixed(1)}, ${this.camera.position.z.toFixed(1)})`

    // console.log(`Position: (${this.camera.position.x.toFixed(1)}, ${this.camera.position.y.toFixed(1)}, ${this.camera.position.z.toFixed(1)})`)
  }

  resizeRendererToDisplaySize() {

    const width  = this.renderer.domElement.clientWidth  *  window.devicePixelRatio | 0
    const height = this.renderer.domElement.clientHeight *  window.devicePixelRatio | 0

    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    /** set */

    if (this.frame) this.zoomCameraToSelection(this.frame)

  }

  addRenderer() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      canvas: document.getElementById('scene')
    })

    // renderer.shadowMap.enabled = true
  }

  addCamera() {
    this.camera = new PerspectiveCamera(16, this.renderer.domElement.clientWidth / this.renderer.domElement.clientHeight, 1, 10000)
    this.camera.aspect = this.renderer.domElement.clientWidth / this.renderer.domElement.clientHeight
    this.camera.position.set( 21.3, 25.8, -19.0 )
    this.camera.updateProjectionMatrix()
  }
  
  addSceneLight() {
    const A = new AmbientLight(0xffffff, 0.45)
    const D = new DirectionalLight( 0xffffff, 0.6 )
    const d = 50

    D.position.set( 0, 1, 1 )
    D.castShadow = true
    D.shadow.mapSize.width = 2048
    D.shadow.mapSize.height = 2048
    D.shadow.camera.left = - d
    D.shadow.camera.right = d
    D.shadow.camera.top = d
    D.shadow.camera.bottom = - d
    D.shadow.camera.far = 3500
    D.shadow.bias = - 0.0001

    this.scene.add(A)
    this.scene.add(D)

    A.dispose()
    D.dispose()
  }

  addControls() {
    this.controls = new OrbitControls( this.camera, this.renderer.domElement )
    // this.controls.maxDistance = 1500
    // this.controls.minDistance = 9
    this.controls.saveState()
    this.controls.update()
  }

  addDragControls() { 

    this.dragctrl = new DragControls( this.dragable, this.camera, this.renderer.domElement )
  }

  addScene() {
    this.scene = new Scene()
    this.scene.background = new Color( 0xf2f5f8 )
    this.scene.fog = new Fog(0xffffff, 15, 100)
    this.addGridHelper()
    this.addSceneLight()  
  }

  addGridHelper() {

    this.grid = new GridHelper(560, 560, 0xffffff, 0xffffff)

    this.grid.position.y = gridY
    this.grid.name = 'grid'
    this.scene.add(this.grid)
  }

  /**
   * make floor
   * 
   */

  addPlane() {

    /**
     * add frame box
     * 
     */

    const FrameBoxMat = new MeshBasicMaterial()

    this.loads = new Mesh(Item.BoxesGeometry, FrameBoxMat)

    this.loads.name = 'loads'
    this.loads.visible = false

    this.loads.updateMatrix()
    this.loads.matrixAutoUpdate = false

    const PlaneMat = new MeshBasicMaterial({ 
      color: 0xFAFAFA,
      fog: false,
      opacity: 1,
      transparent: false
    })

    this.panel = new Mesh(Item.BoxesGeometry, PlaneMat)
    this.panel.receiveShadow = true
    this.panel.name = 'panel'

    this.panel.updateMatrix()
    this.panel.matrixAutoUpdate = false

    this.scene.add(this.loads)
    this.scene.add(this.panel)

    FrameBoxMat.dispose()
    PlaneMat.dispose()
  }

  setPlane() {

    /**
     * add frame box
     * 
     */

    this.loads.scale.x = this.fr.w
    this.loads.scale.y = this.fr.h
    this.loads.scale.z = this.fr.l

    this.loads.position.y = this.fr.h2

    this.loads.updateMatrix()

    /**
     * add panel
     * 
     */

    this.panel.scale.x = this.fr.w - 0.06,
    this.panel.scale.y = planeHeight
    this.panel.scale.z = this.fr.l - 0.06

    this.panel.position.y = -planeHeight

    this.panel.updateMatrix()
  }

  setFrame() {

    const Load = new BoxGeometry(this.loads.scale.x, this.loads.scale.y, this.loads.scale.z)
    const Line = new LineSegmentsGeometry().fromEdgesGeometry(new EdgesGeometry(Load))

    this.frame = new Line2(
      Line,
      Item.borderMaterial
    )

    this.frame.position.x = this.loads.position.x
    this.frame.position.y = this.loads.position.y
    this.frame.position.z = this.loads.position.z

    // console.log(this.frame.scale)

    this.frame.updateMatrix()
    this.frame.matrixAutoUpdate = false

    this.scene.add(this.frame)
  }

  setFloor() {

    /**
     * set scale & position
     * 
     */

    let expandFloor

    this.fr.tp === 2 ? expandFloor = 3 : expandFloor = 1.9

    this.floor.scale.x = SMath.floor(this.fr.w * 4)
    this.floor.scale.y = SMath.floor(this.fr.h * 2)
    this.floor.scale.z = SMath.floor(this.fr.l * expandFloor)

    const offset = SMath.floor(this.floor.scale.z / 2 - this.fr.l / 2)

    this.floor.position.y = SMath.floor(this.fr.h + gridY + 0.2)
    this.floor.position.x = SMath.floor(this.floor.scale.x / 2) + SMath.floor(this.fr.w / 2) + 0.2
    this.floor.position.z = offset

    if (this.fr.ax) this.floor.position.x = this.floor.position.x + 1

    this.floor.updateMatrix()

  }

  addFloor() {

    /**
     * create
     * 
     */

    const geo = new BoxGeometry(1,1,1)
    const mat = new MeshBasicMaterial()

    this.floor = new Mesh(geo, mat)

    this.floor.name = 'floor'
    this.floor.visible = false

    this.floor.updateMatrix()
    this.floor.matrixAutoUpdate = false
    
    /**
     * add
     * 
     */

    this.scene.add(this.floor)

    /**
     * clear
     * 
     */

    geo.dispose()
    mat.dispose()
  }

  addHoverBorder() {

    /**
     * make
     * 
     */

    this.borders = Item.addHoverBorder()

    /**
     * add 
     * 
     */

    this.scene.add(this.borders)
  }

  /**
   * models
   * 
   */

  _modelScaleToFit(object, { l, w, h }) {

    let load, size

    load = new Box3().setFromObject(object)
    size = load.getSize(new Vector3())
  
    const sl = l / size.z
    const sw = w / size.x
    const sh = h / size.y

    object.scale.y = object.scale.y * sh
    object.scale.x = object.scale.x * sw
    object.scale.z = object.scale.z * sl

    SMath.floorVector(object.scale)

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

  _models() {

    /**
     * dimension
     * 
     */

    this._metr()

    /**
     * panel
     * 
     */

    this._panel()

    /**
     * door
     * 
     */

    if (Number(this.fr.tp) === 1) this._doors()

    /**
     * wheels & head
     * 
     */

    switch (Number(this.fr.tp)) {

    case 0: 

      if (!this.fr.ax) {

        if (this.fr.w >= 1.4 && this.fr.w <= 5) {

          const l = Math.round((this.fr.l * 31.2) /  100)
      
          if (this.fr.l < 22 &&  this.fr.l >= 12) {

            /**
             * tt 1 
             * 
             */

            this._head(this.fr.l + 1.4)   

            /** 
             * tt 2
             * 
             */

            this._wheels(this.fr.l - 1.8)

            /**
             * пп
             * 
             */

            this._wheels(l + 1)
            this._wheels(l)
            this._wheels(l - 1)

          } else if (this.fr.l < 12  &&  this.fr.l >= 7.7) { 

            /**
             * tt 1 
             * 
             */

            this._head(this.fr.l + 0.8)

            /** 
             * tt 2
             * 
             */

            this._wheels(this.fr.l - 1.5)

            /**
             * пп
             * 
             */

            this._wheels(l + 0.5)
            this._wheels(l - 0.5)

          } else if (this.fr.l < 7.7 &&  this.fr.l >= 3.6) { 

            /**
             * фургон
             * 
             */

            /**
             * tt 1 
             * 
             */

            this._head(this.fr.l + 0.8)  

            /**
             * tt 2
             * 
             */

            this._wheels(Math.round((this.fr.l * 40) /  100))

          } else if (this.fr.l < 3.6 &&  this.fr.l >= 2.7) { 

            /**
             * маленький фургон
             * 
             */

            this._wheels(Math.round((this.fr.l * 45) /  100))
            this._doors()

          } else { 

            /**
             * doors only 
             * 
             */

            this._doors()

          }

        } else {

          /**
           * doors only 
           * 
           */

          this._doors()
        }

      } else {

        /**
         * get axis
         * 
         */

        if (this.fr?.axis?.geo) {

          // console.log('results?.axis')

          /**
           * tt
           * 
           */

          if (this.fr.axis.geo?.tt) {

            // console.log('results.axis?.tt')

            /**
             * axis > 1
             * 
             */

            this._doors()

            if (this.fr.axis.geo.tt.length > 1) {

              /**
               * tt 1
               */

              const tt_1 = (this.fr.axis.geo.tt.slice(0, 1)).shift()

              const l1 = tt_1 / 1000

              if ((l1 - this.fr.l) > 0.445) {

                this._head(l1)
                this._annotate(l1 + 0.7, 0, 'tt.0')

              } else {

                this._head(this.fr.l + 0.445)
                this._annotate(this.fr.l + 0.445 + 0.7, 0, 'tt.0')
                
              }

              /**
               * tt 2
               * 
               */

              const tt_2 = this.fr.axis.geo.tt.slice(1, this.fr.axis.geo.tt.length)

              tt_2.forEach((i, x) => {

                const l = i / 1000
                
                this._wheels(l)
                this._annotate(l, 0, 'tt.' + (x + 1))
              })
            }  
            
            /**
             * if axis tt < 1 === false
             * 
             */

          }

          /**
           * pp
           * 
           */

          if (this.fr.axis.geo?.pp) {

            this.fr.axis.geo.pp.forEach((i, x) => {

              const l = i / 1000

              this._wheels(l)
              this._annotate(l, 0, 'pp.' + x)
            })
          }
        }
      }

      break
    }
    
  }

  _doors() {

    const g = new EdgesGeometry(new PlaneGeometry(this.fr.w2, this.fr.h))
    const m = new LineBasicMaterial({

      color: 0x808080,
      linewidth: 1,
      fog: false

    })

    const group = new Group()

    group.name = 'doors'

    const hypotenuse = SMath.floor(this.fr.w2 / 2)
    const rotation = Math.PI / 10    /*  Pi/4 - 45 градусов, Pi/6 - 30 градусов */
    const cos = Math.cos(rotation) * hypotenuse
    const sin = Math.sin(rotation) * hypotenuse
    const offsetX = hypotenuse - Number(cos)

    const left = new LineSegments(g, m) 
  
    left.rotation.y = rotation 
    left.position.x = - hypotenuse - offsetX
    left.position.y = 0
    left.position.z = -this.fr.l2 - sin

    const right = new LineSegments(g, m) 
  
    right.rotation.y = -rotation 
    right.position.x = hypotenuse + offsetX
    right.position.y = 0
    right.position.z = -this.fr.l2 - sin

    group.add(left)
    group.add(right)

    group.updateMatrix()
    group.matrixAutoUpdate = false

    this.frame.add(group)

    g.dispose()
    m.dispose()

  }

  _panel() {

    this.FBX.load(process.env.BASE_URL + 'models/panel_c.fbx', (object) => {   

      if (!this.renderer) return

      const size = this._modelScaleToFit(object, { l: this.fr.l, w: this.fr.w, h: 0.11 })

      object.position.x = 0
      object.position.z = 0
      object.position.y -= this.fr.h2 + planeHeight + SMath.floor(size.y / 2)
      object.position.y = SMath.floor(object.position.y)
      object.name = 'm_panel'

      object.traverse((i) => {        
        if (i.isMesh) {

          i.material = new MeshPhongMaterial()

          i.material.fog = false

          i.updateMatrix()
          i.matrixAutoUpdate = false

        }
      })

      object.updateMatrix()
      object.matrixAutoUpdate = false

      this.frame.add(object)

      return

    })
  }

  _head(x) {

    this.FBX.load(process.env.BASE_URL + 'models/truck_head.fbx', (object) => { 
      
      if (!this.renderer) return

      const load = new Box3().setFromObject(object)
      const size = load.getSize(new Vector3())
    
      const sw = 2.55 / size.x

      object.scale.y = 0.00862374794064857
      object.scale.x = object.scale.x * sw
      object.scale.z = 0.00862374794064857

      object.position.x = 0
      object.position.z = - this.fr.l2 + x
      object.position.y = - this.fr.h2 - planeHeight - 1.005
      object.name = 'm_head'

      object.traverse((i) => {        
        if (i.isMesh) {

          i.material = new MeshPhongMaterial()

          i.material.fog = false

          i.updateMatrix()
          i.matrixAutoUpdate = false

        }
      })

      object.updateMatrix()
      object.matrixAutoUpdate = false

      this.frame.add(object)

      return

    })
    
  }

  _wheels(x) {

    this.FBX.load(process.env.BASE_URL + 'models/wheels.fbx', (object) => {

      if (!this.renderer) return

      const wd = 0.9
      const size = this._modelScaleToFit(object, { l: wd, w: this.fr.w, h: wd })

      object.position.x = 0
      object.position.z = - this.fr.l2 + x
      object.position.y -= this.fr.h2 + planeHeight + size.y + 0.12
      object.name = 'm_wheel'

      object.traverse((i) => {        
        if (i.isMesh) {

          i.material = new MeshPhongMaterial()

          i.material.fog = false

          i.updateMatrix()
          i.matrixAutoUpdate = false

        }
      })

      object.updateMatrix()
      object.matrixAutoUpdate = false

      this.frame.add(object)

      return

    })
  }

  _annotate(offset = 0, t, name = '') {

    const y = - 1.01
    const x = this.fr.w2 + 0.9
    const z = - this.fr.l2 + offset

    const createText = SceneText.addText(
      getWght(t.val, 0),
      {
        y,
        x,
        z: z - 0.025
      },
      name
    )

    createText.rotation.x = metrParams.width.rotation.x
    createText.rotation.z = metrParams.width.rotation.z

    createText.updateMatrix()

    this.annotate.add(createText) 

    const points = []

    points.push(new Vector3( this.fr.w2 , y, z))
    points.push(new Vector3( x, y, z))
  
    const material = new LineBasicMaterial( { color: 0x999999, fog: false } )
    const geometry = new BufferGeometry().setFromPoints( points )
    const line = new Line( geometry, material )

    line.updateMatrix()
    line.matrixAutoUpdate = false

    this.annotate.add( line )

    /**
     * dispose
     * 
     */

    material.dispose()
    geometry.dispose()

    line.material.dispose()
    line.geometry.dispose()

    createText.dispose()

  }

  /**
   * metr
   * 
   */

  _metr() {

    /**
     * set
     * 
     */

    const array = [
      { name: 'length', l: this.fr.l, x: metrParams.margin.line, z: 0 },
      { name: 'width',  l: this.fr.w, x: 0, z: metrParams.margin.line }
    ]

    array.forEach((i) => {

      const line = this._metrLine(i.l, true, i.name)

      line.position.x = - (this.fr.w2 + i.x)
      line.position.y = metrParams.position.y
      line.position.z = - (this.fr.l2 + i.z)

      const text = this._metrText(0, i.l, true, i.name)

      text.position.x = i.x ? - (this.fr.w2 + metrParams.margin.text) : line.position.x
      text.position.y = metrParams.position.y
      text.position.z = i.z ? - (this.fr.l2 + metrParams.margin.text) : line.position.z

      line.updateMatrix()
      text.updateMatrix()

      this.metrline.add(line)
      this.metrtext.add(text)

      line.geometry.dispose()
      line.material.dispose()

      text.traverse((obj) => obj.dispose?.())
    })

    this.metrline.updateMatrix()
    this.metrtext.updateMatrix()

  }

  _metrVector(direction, value, offset) {

    let v

    switch (direction) {
    case 'length':

      v = new Vector3( offset, 0, value )

      break
    case 'width':
    default:

      v = new Vector3( value, 0, offset )
    }

    return v
  }

  _metrLine(ln, body, direction) {

    const buffer = []
    const points = []
    // const dd = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    const dd = [0.25, 0.5, 0.75]

    /**
     * set
     * 
     */
    
    const min = Math.floor(ln)
    const max = Math.ceil(ln)

    /**
     * body points
     * 
     */

    if (body) {

      for (let x = 1; x <= min; x ++) {

        points.push(this._metrVector(direction, x, 0))
        points.push(this._metrVector(direction, x, 0.1))

        dd.forEach((i) => {

          points.push(this._metrVector(direction, x - i, 0))
          points.push(this._metrVector(direction, x - i, 0.04))

        }) 
      }

    }

    /**
     * end & start points
     * 
     */

    points.push(this._metrVector(direction, ln, 0))
    points.push(this._metrVector(direction, ln, 0.3))

    points.push(this._metrVector(direction, 0, 0))
    points.push(this._metrVector(direction, 0, 0.3))

    if (max !== ln && body) {

      dd.forEach((i) => {

        if (max - i < ln) {
          points.push(this._metrVector(direction, max - i, 0))
          points.push(this._metrVector(direction, max - i, 0.04))
        }

      })
      
    }
  
    /**
     * main line
     * 
     */

    if (body) {

      points.push(this._metrVector(direction, 0, 0))
      points.push(this._metrVector(direction, ln, 0))

    }

    buffer.push( new BufferGeometry().setFromPoints( points ))

    /**
     * mesh
     * 
     */

    const mesh = new Line2(
      new LineSegmentsGeometry().fromEdgesGeometry(BufferGeometryUtils.mergeGeometries(buffer)),
      Item.borderMaterial
    )

    mesh.updateMatrix()
    mesh.matrixAutoUpdate = false

    /**
     * dispose
     * 
     */

    mesh.material.dispose()
    mesh.geometry.dispose()

    return mesh

  }

  _metrText(start, selflenght, body, direction) {

    /**
     * необходимо тестирование на универсальность метода
     * не выполнялось
     * 
     */

    const group = new Group()

    /**
     * text st
     * 
     */
    
    const ends = [
      { pos: 0, val: start },
      { pos: selflenght, val: SMath.floor(start + selflenght)  }
    ]

    ends.forEach((x, index) => {

      /**
       * отступ если расстояние недостаточное для надписей
       * 
       * 
       */

      const offset = index === 1 && selflenght < 0.77 ? - metrFontSize : 0

      const position = this._metrVector(direction, x.pos, offset)

      const text = SceneText.addText(x.val, position, '')

      text.rotation.x = metrParams[direction].rotation.x
      text.rotation.z = metrParams[direction].rotation.z

      text.anchorX = 'center'

      text.updateMatrix()

      group.add(text)
      text.dispose()

    })

    /**
     * body points
     * 
     */

    if (body) {

      const min = Math.floor(selflenght)

      for (let x = start + 1, y = 1; x <= min; x ++, y ++) {

        let lines

        if (min > 21) lines = 4
        if (min < 22) lines = 3
        if (min < 15) lines = 2
        if (min < 7)  lines = 1

        if (x % lines === 0 && min - x > 0.5) {

          const position = this._metrVector(direction, y, 0)

          const text = SceneText.addText(SMath.floor(start + x), position, '')

          text.rotation.x = metrParams[direction].rotation.x
          text.rotation.z = metrParams[direction].rotation.z

          text.anchorX = 'center'

          text.updateMatrix()        

          group.add(text)
          text.dispose()
        }
      }

    }

    group.updateMatrix()
    group.matrixAutoUpdate = false

    return group

  }

  _metrTextVisible(visible = true) {

    /**
     * met visible
     * 
     */

    if (!this.scene) return 

    if (this.metrtext) {
      
      this.metrtext.visible = visible
      this.metrtext.updateMatrix()

    }

    return
  }

  /**
   * images
   * 
   */
  
  async getImage() {
    if (!this.setup) return false
    
    this.render()

    return await this.renderer.domElement.toDataURL('image/png')
  }

  async exportImages() {

    if (!this.setup) return false

    /**
     * set setting
     * 
     */

    this.controls.enabled = false

    const cameraStartPosition = this.camera.getWorldPosition(new Vector3())

    this.zoomCameraToSelection(this.frame)
    this.render()

    this.scene.background = new Color( 0xffffff )
    this.camera.position.set( 21.3, 25.8, -19.0 )
    this.controls.update()

    this.zoomCameraToSelection(this.frame)
    this.render()

    /**
     * invisible exist
     * 
     */

    const exist = this.scene.getObjectByName('exist')

    if (exist) exist.visible = false

    /**
     * images
     * 
     */
    
    const images = []

    /**
     * getRecieversArray
     * 
     */

    const receivers = Item.getRecieversArray()

    /**
     * invisible receivers group all
     * 
     */

    /* eslint-disable */

    for (let x = 0; x < receivers.length; x ++) {

      if (!receivers[x].id) continue

      const group = this.scene.getObjectByName(receivers[x].id)

      group.visible = false

    }
    
    /**
     * get images each by each
     * 
     */

    for (let x = 0; x < receivers.length; x ++) {

      if (!receivers[x].id) continue

      /** get group from scene */

      const group = this.scene.getObjectByName(receivers[x].id)

      if (!group) continue

      group.visible = true

      /** set camera to group center */

      this.zoomCameraToSelection(group)

      /** make screenshot  */

      images.push(await this.getImage())
    }

    /* eslint-enable */  

    /**
     * get all groups
     * 
     */

    this.zoomCameraToSelection(this.frame)
    images.push(await this.getImage())

    /**
     * visible exist
     * 
     */

    if (exist) exist.visible = true    
  
    /**
     * old setting
     * 
     */
      
    this.scene.background = new Color( 0xf2f5f8 )
    this.controls.enabled = true
    this.camera.position.copy(cameraStartPosition)
    this.controls.update()

    return images

  }

  /** 
   * 
   * support func
   * 
   */

  zoomCameraToSelection(target = this.frame) {   

    const box = new Box3()
    
    let offset = 1.3

    if (this.fr.tp === 1) offset = 1.5

    if (target.name !== 'frame') {
      if (Math.abs(this.renderer.domElement.clientWidth / this.renderer.domElement.clientWidth - 16 / 9) > 0.01) {
        offset = 1.6
      }
    }
    
    box.expandByObject(target)

    const size = box.getSize( new Vector3() )
    const center = box.getCenter( new Vector3() )

    /** clear */

    box.makeEmpty()

    const maxSize = Math.max( size.x, size.y + size.x, size.z )
    const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * this.camera.fov / 360 ) )
    const distance = offset * Math.max( fitHeightDistance, fitHeightDistance / this.camera.aspect )

    const direction = this.controls.target.clone()
      .sub( this.camera.position )
      .normalize()
      .multiplyScalar( distance )

    this.controls.maxDistance = distance * 2.2
    this.controls.minDistance = 5
    this.controls.target.copy( center )

    this.camera.near = distance / 100
    this.camera.far = distance * 100
    this.camera.updateProjectionMatrix()
    
    this.camera.position.copy( this.controls.target ).sub(direction)  

    this.controls.saveState()
    this.controls.update()

  }

  getCameraData() {

    const width  = this.renderer.domElement.clientWidth  *  window.devicePixelRatio | 0
    const height = this.renderer.domElement.clientHeight *  window.devicePixelRatio | 0

    const aspect = width / height || this.camera.aspect
    const position = this.camera.position.clone()

    return { aspect, position }
  }

  getCountInloads() {
    return Item.inloads.length
  }
  
  /** 
   * 
   * stepper 
   * 
   */

  setStep(n, type) {

    if (!this.renderer) return

    /**
     * set cursor auto
     * 
     */

    this.renderer.domElement.style.cursor = 'default'

    /**
     * change event
     * 
     */

    Drag.event = null

    /**
     * clear draggable object
     * 
     */

    Drag.mesh = null

    /**
     * clear dragable array
     * 
     */

    this.dragable.length = 0

    /**
     * disabled drag control
     * 
     */

    this.dragctrl.deactivate() 

    /**
     * metr visible false
     * 
     */

    if (this.annotate?.isGroup) this.annotate.visible = false

    /** 
     * step enable event
     * 
     */

    Step.enable = true

    /**
     * offHover event
     * 
     */

    this.offHover()

    /** 
     * for of inloads
     * 
     */

    if (!Step.final.length) Step.makeOrder(Item.inloads, type)

    // console.log(a)

    for (let x = 0; x < Step.final.length; x ++) {

      if (!Step.final[x]?.isMesh) continue

      /**
       * index
       *
       */

      const index = x + 1

      // console.log(Step.final[x])

      /** visible  */

      if (index <= n) this.setMeshVisible(Step.final[x])

      /** correct prev visible */

      if (index < n) Item.textTopVisibleAuto([Step.final[x]])

      /** visible & hover */

      if (index === n) this.onHover(Step.final[x])

      /** invisible */

      if (index > n) this.setMeshInVisible(Step.final[x])

    }    

  }

  setMeshVisible(i) {

    if (!i?.isMesh) return

    /** get text & border */

    const { text, border } = Item.instance.list[i.id]

    if (text) {

      /** set value */

      text.visible = true
      text.updateMatrix()

    }

    if (border) {

      border.visible = true
      border.updateMatrix()

    }

    /** mesh visible */

    i.visible = true
    i.updateMatrix()
  }

  setMeshInVisible(i) {

    if (!i?.isMesh) return

    /** get text & border */

    const { text, border } = Item.instance.list[i.id]

    if (text) {

      text.visible = false
      text.updateMatrix()

    }

    if (border) {

      border.visible = false
      border.updateMatrix()

    }

    /** mesh visible */

    i.visible = false
    i.updateMatrix()
  }

  clearStep(deep = false) {

    /**
     * offHover event
     * 
     */

    this.offHover()

    /** 
     * for of inloads
     * 
     */

    for (let x = 0; x < Item.inloads.length; x ++) {

      if (!Item.inloads[x]?.isMesh) continue

      /** 
       * visible item & border & text
       * 
       */

      this.setMeshVisible(Item.inloads[x])

      /**
       * correct visible text auto
       * 
       */

      Item.textTopVisibleAuto([Item.inloads[x]])
    }    
    
    /** 
     * enable step
     * 
     */

    Step.enable = false

    /**
     * step clear
     * 
     */

    if (deep) Step.clear()

    /**
     * change event
     * 
     */

    Drag.event = null

    /**
     * clear draggable object
     * 
     */
 
    Drag.mesh = null

    /**
     * enable drag control
     * 
     */

    this.dragctrl.activate()

    /**
     * metr default
     * 
     */

    if (this.annotate?.isGroup) this.annotate.visible = true

  }

  /**
   * 
   * animate
   * 
   */

  animate() {

    this.animateID = window.requestAnimationFrame( this.animate.bind(this) )
    
    if (process.env.NODE_ENV !== 'production') this.stats.update()
    
    TWEEN.update()
    this.render()
  }

  /**
   * 
   * events
   * 
   */

  events() {
    this.renderer.domElement.style.touchAction = 'none'

    this.renderer.domElement.addEventListener('pointermove', (event) => this.onPointerMove(event) )

    this.dragctrl.addEventListener( 'dragstart', (event) => this.onDragStart(event) )
    this.dragctrl.addEventListener( 'drag', (event) => this.onDrag(event) )
    this.dragctrl.addEventListener( 'dragend', (event) => this.onDragEnd(event) )

    document.addEventListener('keydown', (event) => this.onKeyDown(event))

    this.controls.addEventListener( 'start', () => this.onOrbitStart())
    this.controls.addEventListener( 'end', () => this.onOrbitEnd())
  }

  onKeyDown( event ) {

    // event.preventDefault()

    if (!Drag.event || !this.borders) return

    event.stopPropagation()

    /**
     * ArrowRight, ArrowLeft - поворот позиции вдоль Y
     * 
     */

    if (['ArrowRight', 'ArrowLeft'].includes(event.key) && !event.repeat) {
      
      // console.log('rotate')

      // console.log(Drag.mesh.scale)
      // console.log(this.borders)

      /**
       * поворот разрешен
       * 
       */

      Item.rotateItem(Drag.mesh)

      /**
       * поворот выделения
       * 
       */

      if (Drag.mesh?.isMesh) {

        // console.log(this.borders)

        if (this.borders?.isMesh) {

          this.borders.scale.copy(Drag.mesh.scale)
          this.borders.updateMatrix()

        } 
      }
      
    }

    /**
     * overturn
     * 
     */

    if (['ArrowUp', 'ArrowDown'].includes(event.key) && !event.repeat) {
      
      // console.log('overturn')

      // console.log(Drag.mesh.scale)
      // console.log(this.borders)

      /**
       * поворот разрешен
       * 
       */

      Item.overturnItem(Drag.mesh)

      /**
       * поворот выделения
       * 
       */

      if (Drag.mesh?.isMesh) {

        // console.log(this.borders)

        if (this.borders?.isMesh) {

          this.borders.scale.copy(Drag.mesh.scale)
          this.borders.updateMatrix()

        } 
      }   

      /** 
       * remove spaces
       * 
       */

      Drag.spaceRemove()

      /**
       * calculate spaces
       * 
       */

      const space = Drag.calculateSpace(Drag.mesh, Item.inloads)

      /**
       * add space to scene
       * 
       */

      Drag.addSpace(space, [this.loads, this.floor])
 
    }

    /**
     * обработка при новом положении
     * 
     */

    this.onDrag( { object: Drag.mesh } )

  }

  updatePointer( event ) {

    if (!this.renderer) return 

    const rect = this.renderer.domElement.getBoundingClientRect()

    pointer.x = ( event.clientX - rect.left ) / rect.width * 2 - 1
    pointer.y = - ( event.clientY - rect.top ) / rect.height * 2 + 1

  }

  onPointerMove( event ) {

    if (!this.renderer) return 

    /** исключаем обработку во время выполнения orbit  */    
    if (this.orbits) return

    /** исключаем обработку во время выполнения step */
    if (Step.enable) return

    /** continiue */
    this.updatePointer( event )

    raycaster.setFromCamera(pointer, this.camera)

    if ( event.pointerType === 'mouse' || event.pointerType === 'pen' ) {

      /**
       * clear intersections
       * 
       */

      intersections.length = 0

      /**
       * deep: false
       * т.к. select имеют границы как дочерний компонент
       * 
       */

      raycaster.intersectObjects( Item.selects, false, intersections )

      /**
       * if in selects
       * 
       */

      if ( intersections.length > 0 ) {

        let [object] = intersections

        object = object.object

        _plane.setFromNormalAndCoplanarPoint( this.camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) )

        if ( this.hovered?.id !== object?.id && this.hovered !== null ) {

          /**
           * 
           * hover off
           * 
           */

          this.offHover(this.hovered)

        }

        if (this.hovered?.id !== object?.id ) {

          /**
           * 
           * hover on
           * 
           */

          if (object.name) { 
            
            /**
             * get border
             * set material color
             * 
             */

            this.onHover(object)
          }

          this.hovered = object

        }

      } else {

        if (this.hovered !== null ) {

          /**
           * 
           * hover off
           * 
           */

          // console.log('hover off')

          this.offHover(this.hovered)

          this.renderer.domElement.style.cursor = 'auto'
          this.hovered = null

        }
      }
    }
  }

  onOrbitStart() {
    this.orbits = true
  }

  onOrbitEnd() {
    this.orbits = false
  }

  onDragStart( event ) {

    if (!event.object?.isMesh) return

    // console.log('onDragStart')

    /**
     * set draggable object
     * 
     */

    Drag.mesh = event.object

    /**
     * make event
     * 
     */

    Drag.event = event.object.id

    /**
      * stop controls
      * 
      */

    this.controls.enabled = false

    /**
     * copy start position
     * 
     */

    Drag.getStart(Drag.mesh)

    /**
     * с этого момента
     * изъятие Drag.mesh из inloads / unloads
     * дальнейшая обработка выполняется без Drag.mesh в наборах
     * 
     */

    Item.removeFromDragGroup(Drag.mesh)

    /**
     * обработка родителей после изъятия Drag.mesh
     * 
     */

    if (Drag.mesh.userData._touch.length) {

      /**
       * пересчет нагрузки для прежних родителей
       * 
       */
      
      Item.countPressLimit(Drag.mesh.userData, Drag.mesh.userData.weight, false, false)

      /**
       * получить родителей
       * 
       */

      const parents = []

      Drag.mesh.userData._touch.forEach((i) => parents.push(Item.getItemByMeshID(i.id)))
       
      /**
      * top cover auto
      * 
      */

      Drag.recountIsCover(parents, [...Item.inloads, ...Item.unloads])

      /**
      * top text visible auto
      * 
      */

      Item.textTopVisibleAuto(parents)

    }

    /**
     * calculate spaces
     * 
     */

    const space = Drag.calculateSpace(Drag.mesh, Item.inloads)

    /**
     * add space to scene
     * 
     */

    Drag.addSpace(space, [this.loads, this.floor])

    /**
     * border
     * text
     * 
     */

    const { text, border } = Item.instance.list[Drag.mesh.id]

    if (text) {
      text.visible = false
      text.updateMatrix()
    }

    if (border) {
      border.visible = false
      border.updateMatrix()
    }

    /**
     * hover borders
     * 
     */

    if (this.borders?.isMesh) this.borders.visible = false 

    /**
     * remove hover meshes
     * 
     */

    this.removeHoverMeshes()

    /**
     * metr default
     * 
     */

    this._metrTextVisible(true)

    /**
     * start drag once
     * 
     */

    this.onDrag(event)

    /**
     * event
     * 
     */

    this.createEventDragStart(Drag.mesh)

    return

  }

  onDrag( event ) {

    if (!Drag.event) return

    if (Drag.mesh?.id !== Drag.event && Drag.event) return

    // console.log('onDrag')

    /**
     * get meshes
     * 
     */

    const meshes =  [...Item.inloads, ...Item.unloads]

    /**
     * disable drag validation
     * 
     */

    Drag.valid = false

    /**
     * disable borders
     * 
     */

    if (this.borders?.isMesh) this.borders.visible = false

    /**
     * floor position
     * 
     */

    SMath.floorVector(Drag.mesh.position)

    /**
     * position update
     * 
     */  
    
    Drag.mesh.updateMatrix()

    /**
     * detect active space
     * 
     */

    Drag.calculateHeight(Drag.mesh)

    /**
     * snap in active
     * 
     */

    Drag.snap(Drag.mesh, meshes)

    /**
     * meshes collision
     * 
     */

    if (Drag.detectCollisions(Drag.mesh, meshes)) return

    /**
     * validate new position
     * 
     */
      
    Drag.validationPosition(Drag.mesh)

    /**
     * drag invalid
     * 
     */

    if (!Drag.valid) return

    /**
     * отображение рамки перемещения
     * 
     */

    if (this.borders?.isMesh) {

      this.borders.position.copy(Drag.mesh.position)
      this.borders.updateMatrix()

      this.borders.visible = true

    }
  
    return 

  }

  onDragEnd( event ) {

    if (!Drag.event) return

    if (Drag.mesh?.id !== Drag.event && Drag.event) return

    // console.log('onDragEnd')

    /**
     * parameteres 
     * 
     */

    let changeSpace = false
    let plus = false
    let maxn = false
    let axis = false 

    /**
     * удалить активный спейс
     * 
     */

    Drag.removeHeight()

    /**
     * remove spaces
     * 
     */

    Drag.spaceRemove()

    /**
     * return previous position
     * 
     */

    if (!Drag.valid) {

      /**
      * возврат места
      * 
      */

      Drag.setStart(Drag.mesh)

      /**
      * добавляем объект обратно в inloads / unloads группу
      * 
      */

      Item.addToDragGroup(Drag.mesh)

      /**
      * возврат выделения
      * 
      */

      if (this.borders?.isMesh) {

        this.borders.position.copy(Drag.mesh.position)
        this.borders.scale.copy(Drag.mesh.scale)
        this.borders.updateMatrix()

      }

    } else {

      /**
       * очистка массива загрузки
       * при смене позиции любого из мест
       * 
       */

      if (Drag.mesh.userData._inFrame || Drag.detectInFrame(Drag.mesh, this.loads)) Step.clear()

      /**
       * обновление _position
       * 
       */

      Item.setUserDataPos(Drag.mesh)

      /**
       * обработка при пермещении
       * 
       */

      if (Drag.mesh.userData._inFrame !== Drag.detectInFrame(Drag.mesh, this.loads)) {

        /**
         * обработка при смене inFrame
         * 
         */

        changeSpace = true
        plus = true

        /**
        * обновить _inFrame
        * 
        */

        Drag.mesh.userData._inFrame = !Drag.mesh.userData._inFrame

        /**
         * обновить inloads, unloads
         * 
         */

        Item.addToDragGroup(Drag.mesh)

        /**
        * пересчитать показатели груза в ТС
        * 
        */

        Item.countPlus()

      } else {

        /**
         * обработка без смены inFrame
         * 
         */

        /**
         * обновить inloads, unloads
         * 
         */

        Item.addToDragGroup(Drag.mesh)

      }

      /**
      * пересчитать оси при наличии
      * 
      */

      if (this.fr.ax && this.fr.tp === 0) {

        Item.countAxis()

        /**
        * флаг
        * 
        */

        axis = true

        /**
        * смена текста на сцене
        * 
        */

        Item.axis['tt'].forEach((i, x) => {
          const o = this.scene.getObjectByName('tt.' + x)

          if (o) o.text = i
        })

        Item.axis['pp'].forEach((i, x) => {
          const o = this.scene.getObjectByName('pp.' + x)

          if (o) o.text = i
        })

      }      

      /** 
      * пересчитать максимальные размеры расстановки
      * 
      */

      Item.countMaxn()

      maxn = true

      /** 
      * отправить event
      * формируем объект отправки включая родителя (группу)
      * 
      */

      this.createEventDragChange(Drag.mesh, plus, maxn, axis, changeSpace)

    }

    /**
     * поиск новых родителей снизу
     * 
     */

    Drag.mesh.userData._touch = Drag.findTouchArray(Drag.mesh, Item.inloads, 'bottom')

    /**
     * обработка родителей текущего Меша
     * 
     */

    if (Drag.mesh.userData._touch.length) {

      /**
       * пересчет нагрузки для новых родителей и их родителей в цикле
       * 
       */

      Item.countPressLimit(Drag.mesh.userData, Drag.mesh.userData.weight, true, false)

      /**
       * получить родителей
       * 
       */

      const parents = []

      Drag.mesh.userData._touch.forEach((i) => parents.push(Item.getItemByMeshID(i.id)))

      // console.log(parents)

      /**
       * top cover auto
       * 
       */

      Drag.recountIsCover(parents, [...Item.inloads, ...Item.unloads])

      /**
       * top text visible auto
       * 
       */

      Item.textTopVisibleAuto(parents)

    }

    /**
     * end event
     * 
     */

    this.createEventDragEnd(Drag.mesh)

    /**
     * notice event
     * 
     */

    this.createEventNotice()

    /**
     * 
     * update position
     * border
     * text
     * 
     */

    const { text, border } = Item.instance.list[Drag.mesh.id]

    if (text) {

      const geo = Item.setPositionTopText(Drag.mesh, 0.2)

      text.position.copy(geo)
      text.visible = true
      text.updateMatrix()

    }

    if (border) {

      border.position.copy(Drag.mesh.position)
      border.scale.copy(Drag.mesh.scale)

      border.visible = true
      border.updateMatrix()

    }

    /**
     * orbit enable
     *  
     */
  
    this.controls.enabled = true

    /**
     * change event
     * 
     */

    Drag.event = null

    /**
     * clear draggable object
     * 
     */

    Drag.mesh = null

    /**
     * remove borders & hover
     * 
     */

    this.offHover()

  }

  createEventOnHover(origin, data = {}) {

    this.dispatchEvent( { 
      type: 'hoveron',
      object: {
        item: origin,
        data    
      }
    })

  }

  createEventOffHover(origin) {

    this.dispatchEvent( { 
      type: 'hoveroff',
      object: {
        item: origin         
      }
    })

  }

  createEventDragStart(origin) {

    this.dispatchEvent( { 
      type: 'dragstart',
      object: {
        item: origin         
      }
    })

  }

  createEventDragEnd(origin) {

    this.dispatchEvent( { 
      type: 'dragend',
      object: {
        item: origin         
      }
    })

  }

  createEventDragChange(object, plus = null, maxn, axis = null, changeSpace) {

    /**
     * ищем объект в массиве исходных объектов
     * и кго группу
     * 
     */

    const { listID, pointID } = object.userData

    if (Item.instance.history.list[listID] === undefined) return
    if (Item.instance.history.group[pointID] === undefined) return

    const d = Item.instance.history.list[listID]
    const g = Item.instance.history.group[pointID]

    /**
     * копируем объект
     * 
     */

    const data = Object.assign({}, d)
    const list = Object.assign({}, d)

    const group = {
      id: g.id,
      name: g.name,
      data: [],
      list: []
    }

    // console.log(data)
    // console.log(list)
    // console.log(group)
    
    /**
    * set list count
    * 
    */

    list.count = 1

    /**
    * set data uid 
    * 
    */

    data.uid = object.userData.backID

    /**
    * интерполяция позиции
    * 
    */

    data.geo = {
      x: SMath.floor((object.position.x - SMath.floor(object.scale.x / 2) + this.fr.w2) * 1000),
      y: SMath.floor((object.position.z - SMath.floor(object.scale.z / 2) + this.fr.l2) * 1000),
      z: SMath.floor((object.position.y - SMath.floor(object.scale.y / 2)) * 1000)
    }

    /**
     * интерполяция размеров
     * 
     */

    data.length = SMath.floorSize(object.scale.z * 1000)
    data.width  = SMath.floorSize(object.scale.x * 1000)
    data.height = SMath.floorSize(object.scale.y * 1000)

    /**
     * вид перемещения
     * 
     */

    const move = { change: null, inFrame: object.userData._inFrame }

    if (changeSpace) {

      if (move.inFrame) move.change = 'toFrame'
      if (!move.inFrame) move.change = 'toFloor'

    }

    // console.log(d)
    
    /**
    * event
    * 
    */

    this.dispatchEvent( { 
      type: 'dragchange',
      object: {
        plus: plus ? Object.assign({}, Item.plus) : null,
        maxn: maxn ? Object.assign({}, Item.maxn) : null,
        axis: axis ? { tt: [...Item.axis.tt], pp: [...Item.axis.pp] } : null,
        move: move,
        data: data,
        list: list,
        group: group          
      }
    })
  }

  createEventNotice() {

    let text = '', color = 'error', array = []

    /**
     * проверка нагрузки
     * 
     */

    if (Item.errorPress.length) {

      const uniq = new Set(Item.errorPress.map((i) => i.listID))

      text = 'maxlimit'
      color = 'error'
      array = uniq.size ? Array.from(uniq) : []

    }

    /**
     * максимальной загрузки
     * 
     */

    if (Item.plus.wg > this.fr.wg) {

      text = 'maxplus'
      color = 'error'
      array = [SMath.getWght(Item.plus.wg - this.fr.wg)]
    }

    /**
     * уведомления пользователя
     * 
     */

    this.dispatchEvent( { 
      type: 'dragnotice',
      object: { text, color, array }
    })

    return
  }

  onResize() {
    if (!this.renderer) return false

    this.resizeRendererToDisplaySize()

    return false
  }

  selectOnDrawer(listID) {

    /**
     * проверка инстанс по id
     * 
     */

    const id = Number(listID)

    if (Item.instance.mesh[id] === undefined) return

    /**
     * make all invisible
     * 
     */

    const meshes = Object.values(Item.instance.list)

    for (let x = 0; x < meshes.length; x ++) {

      const { item, border, text } = meshes[x]

      if (!item || !border || !text) continue

      if (String(item.userData?.listID) === String(listID)) continue

      /**
       * make invisible
       * 
       */

      item.visible = false
      border.visible = false

      /**
       * save visible
       * 
       */

      text.userData.visible = text.visible
      text.visible = false

    }

    /**
     * animate border
     * 
     */

    new TWEEN.Tween(Item.instance.mesh[id].border.material)
      .to({
        linewidth: Item.borderSize.max
      }, 550)
      .repeat(2)
      .easing(TWEEN.Easing.Cubic.Out)
      .onStart(() => Item.instance.mesh[id].border.material.linewidth = 0)
      .onComplete(() => Item.instance.mesh[id].border.material.linewidth = Item.borderSize.reg)
      .start()

    /**
     * return visible
     * 
     */

    setTimeout(() => {
        
      for (let x = 0; x < meshes.length; x ++) {

        const { item, border, text } = meshes[x]

        if (!item || !border || !text) continue
  
        if (String(item.userData.listID) === String(listID)) continue
  
        /**
         * make visible
         * 
         */
  
        item.visible = true
        border.visible = true
        text.visible = text.userData.visible
  
      }
      
    }, 1500)

  }

  setHangValue(a) {
    a ? Drag.hangEnable = true : Drag.hangEnable = false

    // console.log(Drag.hangEnable)
  }

  setSnapValue(a) {
    a ? Drag.snapEnable = true : Drag.snapEnable = false

    // console.log(Drag.snapEnable)
  }

  onHover(object) {

    if ( !object?.isMesh ) return
    if ( Drag.event ) return

    // console.log('onHover')

    // console.log('position: ')
    // console.log(object.position)

    // console.log('scale: ')
    // console.log(object.scale)

    // console.log('_touch: ')
    // console.log(object.userData._touch)
    // console.log(object.position)
    // console.log('_press: ' + object.userData._press)
    // console.log('_limit: ' + object.userData._limit)
    // console.log('_isCover: ' + object.userData._isCover)
    // console.log('_isCoverFull: ' + object.userData._isCoverFull)

    const isCover = object.userData._isCover

    const { _isCover, _isCoverFull } = Drag.getIsCover(object, [...Item.inloads, ...Item.unloads])

    /**
     *  любое перекрытие
     * 
     */

    object.userData._isCover = _isCover

    /** 
     * частичное перекрытие
     * 
     */

    object.userData._isCoverFull = _isCoverFull

    /** make test */

    if (isCover !== _isCover && object.parent.name !== 'exist') {

      console.error('invalid cover of Mesh')
      console.error(isCover)
      console.error(object)

    }

    /**
     * можно ли перемещать объект
     * 
     */

    if (Item.getItemStatusForDrag(object) && this.dragging && !Step.enable) {

      this.dragable.length = 0
      this.dragable.push(object)

      /**
       * сменить курсор для перемещения
       * 
       */

      this.renderer.domElement.style.cursor = 'pointer'

    }

    /**
     * borders copy position & scale
     * visible true
     * 
     */

    if (this.borders?.isMesh) {

      this.borders.position.copy(object.position)
      this.borders.scale.copy(object.scale)
      this.borders.updateMatrix()
      this.borders.visible = true

    }

    /**
     * get offset location from origin point (0, 0, 0)
     * 
     */

    const width = SMath.floorSize(object.position.x - SMath.floor(object.scale.x / 2) + this.fr.w2)
    const length = SMath.floorSize(object.position.z - SMath.floor(object.scale.z / 2) + this.fr.l2)
    const height = SMath.floorSize(object.position.y - SMath.floor(object.scale.y / 2))

    /**
     * add text
     * 
     */

    const fontSize = SceneText.setFontSize(object, 3)

    const texts = [{ 
      pos: 'right',
      value: SMath.floorSize(object.scale.z),
      align: 'right',
      valign: 'middle'
    }, { 
      pos: 'bottom',
      value: SMath.floorSize(object.scale.x),
      align: 'center',
      valign: 'bottom'
    }]

    texts.forEach((i) => {

      /**
       * get parent coordinates
       * 
       */
      
      const geo = Item.setPositionTopText(object, fontSize, i.pos)

      /**
       * text add
       * 
       */

      const text = SceneText.addText(
        i.value,
        geo,
        'text',
        fontSize
      )

      text.anchorX = i.align
      text.anchorY = i.valign

      this.hover.add(text)
      text.sync()

      /**
       * dispose
       * 
       */

      text.dispose()

    })
    
    /**
     * metr
     * 
     */

    if (object.userData._inFrame) {

      /**
       * спрятать основной текст метра
       * 
       */

      this._metrTextVisible(false)

      /**
       * показать вспомогательный текст метра
       * 
       */

      const array = [
        { name: 'length', start: length, self: SMath.floorSize(object.scale.z), x: metrParams.margin.line, z: - length },
        { name: 'width', start: width, self: SMath.floorSize(object.scale.x), x: - width, z: metrParams.margin.line }
      ]

      array.forEach((i) => {

        const line = this._metrLine(i.self, false, i.name)

        line.position.x = - (this.fr.w2 + i.x)
        line.position.y = metrParams.position.y
        line.position.z = - (this.fr.l2 + i.z)

        const text = this._metrText(i.start, i.self, false, i.name)

        text.position.x = i.x > 0 ? - (this.fr.w2 + metrParams.margin.text) : line.position.x
        text.position.y = metrParams.position.y
        text.position.z = i.z > 0 ? - (this.fr.l2 + metrParams.margin.text) : line.position.z

        line.updateMatrix()
        text.updateMatrix()

        this.hover.add(line)
        this.hover.add(text)

        line.geometry.dispose()
        line.material.dispose()
        text.traverse((obj) => obj.dispose?.())
      })

    }

    /** 
     * event
     * 
     */

    const { listID } = object.userData

    let name, weight, packing, limit, stuck = null

    if (Item.instance.history.list[listID] !== undefined) {

      name = Item.instance.history.list[listID].name
      weight = Item.instance.history.list[listID].weight
      packing = Item.instance.history.list[listID].packing
      stuck = Item.instance.history.list[listID].stuck
      limit = Item.instance.history.list[listID].limit

    }

    const data = {
      name,
      ln: {
        start: length,
        final: SMath.floorSize(this.fr.l - SMath.floorSize(length + object.scale.z)),
        value: object.scale.z
      },
      wd: {
        start: width,
        final: SMath.floorSize(this.fr.w - SMath.floorSize(width + object.scale.x)),
        value: object.scale.x
      },
      hg: {
        start: height,
        final: SMath.floorSize(this.fr.h - SMath.floorSize(height + object.scale.y)),
        value: object.scale.y
      },
      press: object.userData._press,
      weight: weight,
      packing: packing,
      stuck: stuck,
      limit: limit
    }

    data.ln.start = SMath.floorSize(data.ln.start * 1000)
    data.wd.start = SMath.floorSize(data.wd.start * 1000)
    data.hg.start = SMath.floorSize(data.hg.start * 1000)
    data.ln.final = SMath.floorSize(data.ln.final * 1000)
    data.wd.final = SMath.floorSize(data.wd.final * 1000)
    data.hg.final = SMath.floorSize(data.hg.final * 1000)
    data.ln.value = SMath.floorSize(data.ln.value * 1000)
    data.wd.value = SMath.floorSize(data.wd.value * 1000)
    data.hg.value = SMath.floorSize(data.hg.value * 1000)

    /**
     * если груз находится вне хоны погрузки
     * 
     */

    if (!object.userData._inFrame) {

      data.ln.start = null
      data.wd.start = null
      data.hg.start = null
      data.ln.final = null
      data.wd.final = null
      data.hg.final = null
      data.press = null

    }

    this.createEventOnHover(object, data)

    return

  }

  offHover() {

    if ( Drag.event ) return
  
    // console.log('offHover')

    /**
     * borders invisible
     * 
     */

    if (this.borders?.isMesh) this.borders.visible = false

    /**
     * remove hover meshes
     * 
     */

    this.removeHoverMeshes()

    /**
     * show metr default
     * 
     */

    this._metrTextVisible(true)

    /** event */

    this.createEventOffHover()

    return

  }

  removeHoverMeshes() {

    /**
     * remove mesh from hover
     * 
     */

    if (this.hover) {

      while (this.hover.children.length) Item.removeMesh(this.hover.children[0])

      /**
       * renders dispose
       * 
       */

      this.renderer.renderLists.dispose()
    }

    // console.log(this.hover.children.length)
    
  }

} 

export { SceneCreate }
