import { SMath } from '@/configs/class/math.js'

class SceneStep {

  /**
   * состояние
   * 
   */

  enable = false

  /**
   * тип загрузки
   * 2  - задняя
   * 1  - боковая
   * 0  - верхняя
   * 
   */

  type = 1

  /**
   * стартовый массив
   * 
   */

  start = []

  /**
   * итоговый массив
   * 
   */

  final = []

  /**
   * лист ожидания
   * 
   */

  delay = []

  /**
   * приоритетная очередь
   * 
   */

  queue = []

  /**
   * list of storage 
   * 
   * аналог _touch
   * то что стоит снизу
   * 
   * [
   *   meshId: int,
   *   parentID: bool,
   *   parentID: bool,
   *   ...
   * ]
   *
   */

  storage = []

  makeOrder(array = [], type = 1) {

    /**
     * копируем исходный массив
     * 
     */

    this.start = [...array]

    /**
     * устанавливаем тип
     * 
     */

    type > 0 ? this.type = 1 : this.type = 0

    /**
     * ищем зависимости по вертикали
     * 
     */

    if (this.type === 1) this.makeDelay()

    // console.log(this.storage)

    /**
     * make proccess
     * 
     */

    // console.log('makeOrder start total')
    // console.log([...this.start, ...this.delay].length)

    while ([...this.start, ...this.queue].length) this.mainProcess()

    // console.log('makeOrder final total')
    // console.log(this.final.length)
    // console.log(this.final)
    // console.log(this.delay)

  }

  mainProcess() {

    // console.log('=======')
    // console.log('mainProcess')
    // console.log('=======')

    // if ([...this.start, ...this.delay].length <= 2) return

    /**
     * выбор позиции
     * 
     */

    let mesh

    if (!this.queue.length) {

      /**
       * проверка на приоритетную очередь
       * 
       */

      mesh = this.filter_main_vertical(this.start)

    } else {

      mesh = this.filter_main_vertical(this.queue)

    }    

    /**
     * добавляем в набор
     * 
     */

    this.final.push(mesh)

    // console.log('Установка ' + mesh.id)

    /**
     * удаляем из набора
     * 
     */

    /**
     * в случае если тип загрузки сзади
     * 
     */

    if (this.type === 1) {

      if (!mesh.userData._touch.length) {

        /** обычная очередь */
  
        this.removeItem(mesh.id, this.start)
  
      } else {
  
        /** приоритетная очередь */
  
        this.removeItem(mesh.id, this.queue)
        this.removeItem(mesh.id, this.delay)
  
      }  

    }

    /**
     * в случае если тип загрузки сверху
     * 
     */

    if (this.type === 0) {

      /** обычная очередь */

      this.removeItem(mesh.id, this.start)

    }

    // console.log('mainProcess end start')
    // console.log([...this.start])

    // console.log('mainProcess end delay')
    // console.log([...this.delay])

    /**
     * прочая обработка 
     * 
     */
    
    if (this.type === 1) this.delayProccess(mesh.id)

  }

  removeItem(id, a = []) {

    // console.log(a)

    const index = a.findIndex((i) => Number(i.id) === Number(id))

    if (index === -1) {

      console.error('SceneStep. No index in removeItem `id` ' + id)

      return []

    } else {

      return a.splice(index, 1) 
    }

  }

  /** delay */

  makeDelay() {

    /**
     * разделить массив start
     * 
     * base массив объектов без _touch
     * list массив объектов с _touch
     * listID массив id объектов с _touch
     * 
     */

    /**
     * вычисляем storage & connect
     * 
     */
    
    const { start, delay } = this.delayDivider()

    /**
     * устанавливаем стартовые массивы
     * 
     */
     
    this.start = start
    this.delay = delay

    // console.log('makeDelay start')
    // console.log([...this.start])

    // console.log('makeDelay delay')
    // console.log([...this.delay])

    /**
     * storage
     * 
     */
    
    for (let x = 0; x < this.delay.length; x ++) {
      
      /** new object */

      let o = {
        id: this.delay[x].id
      }

      /** parent */

      this.delay[x].userData._touch.map((i) => o = Object.assign({ [i.id]: false }, o))

      /**
       * add
       * 
       */

      this.storage.push(o)

    }

    // console.log('makeDelay storage')
    // console.log(this.storage)

    // console.log('makeDelay queue')
    // console.log(this.queue)

  }

  delayProccess(id) {

    // console.log('delayProccess')
    
    /**
     * обработка мест / поиск зависимостей и добавление в queue
     * 
     */

    const remove = []

    /**
     * проверка по наличию объекта в storage
     * 
     */

    for (let x = 0; x < this.storage.length; x ++) {

      /**
       * set true in storage
       * 
       */

      if (this.storage[x][id] !== undefined) this.storage[x][id] = true

      /** 
       * проверяем storage на все true
       * 
       */

      if (this.delayCheck(this.storage[x])) {

        /**
         * если все значения true
         * то добавляем объект по id из delay в queue
         * 
         */

        const index = this.delay.findIndex((i) => Number(i.id) === Number(this.storage[x].id))

        // console.log('delayProccess добавление в queue ' + this.storage[x].id)

        if (index !== -1) this.queue.push(this.delay[index])

        /**
         * add to remove
         * 
         */

        remove.push(this.storage[x].id)

      }      

    }

    /**
     * clear storage
     * 
     */

    for (let x = 0; x < remove.length; x ++) {

      const index = this.storage.findIndex((i) => Number(i.id) === Number(remove[x]))

      // console.log('delayCheck remove ' + remove[x])

      if (index !== -1) this.storage.splice(index, 1)
    }

    // console.log('delayCheck queue after')
    // console.log([...this.queue])

    // console.log('delayCheck delay after')
    // console.log([...this.delay])

  }

  delayDivider() {

    /**
     * фильтруем все позиции у которых _touch.lenght > 0
     * все найденные позиции убираем из массива start
     * 
     */

    const start = []
    const delay = []

    for (let x = 0; x < this.start.length; x ++) {

      if (!this.start[x]?.isMesh) continue

      /**
       * проверка зависимостей по вертикали
       * 
       */

      if (this.start[x].userData._touch.length) {
        
        delay.push(this.start[x])

      } else {

        start.push(this.start[x])

      }

    }

    return { start, delay }
  }

  delayCheck(object) {

    // console.log('delayCheck')
    // console.log(object)

    /**
     * проверка 
     * 
     */

    const array = Object.values(object)

    if (!array.includes(false)) return true

    return false
  }

  /** filters */

  filter_main_vertical(a = []) {

    /**
     * проверка массива по длине
     * 
     */

    if (!a.length) return {}

    /**
     * копируем массив
     * 
     */

    let filter = [...a]

    /**
     * фильтруем по minY
     * 
     */

    if (filter.length) filter = this.filter_minY(filter)

    /**
     * фильтруем по maxZ
     * 
     */

    if (filter.length) filter = this.filter_maxZ(filter)

    /**
     * фильтруем по minX
     * 
     */

    if (filter.length) filter = this.filter_minX(filter)

    /**
     * проверка на наличие
     * 
     */

    if (!filter.length) return

    /**
     * выбрана позиция
     * 
     */

    const [mesh] = filter

    // console.log(mesh.userData)

    /**
     * возврат
     * 
     */

    if (mesh?.isMesh) return mesh

    return {}
  }

  filter_minY(a = []) {

    if (!a.length) return []

    const minY = this.getMinY(a)

    /**
     * отфильтровать стартовый массив по minY
     * 
     */

    return a.filter((i) => SMath.floor(i.position.y - SMath.floor(i.scale.y / 2)) === minY)

  }

  filter_minX(a = []) {

    if (!a.length) return []

    const minX = this.getMinX(a)

    /**
     * отфильтровать стартовый массив по minY
     * 
     */

    return a.filter((i) => SMath.floor(i.position.x - SMath.floor(i.scale.x / 2)) === minX)

  }

  filter_maxZ(a = []) {

    if (!a.length) return []

    const maxZ = this.getMaxZ(a)

    /**
     * отфильтровать стартовый массив по minY
     * 
     */

    return a.filter((i) => SMath.floor(i.position.z + SMath.floor(i.scale.z / 2)) === maxZ)

  }

  getMinY(array = []) {

    /** 
     * отсортировать грузы по ярусам в порядке возрастания
     *  
     */

    array = array.sort((a, b) => {

      /** get minimal Y geo */

      const aa = SMath.floor(a.position.y - SMath.floor(a.scale.y / 2))
      const bb = SMath.floor(b.position.y - SMath.floor(b.scale.y / 2))

      /** compare */

      if (aa < bb) return -1
      if (aa > bb) return 1
    
      return 0
    })

    /**
     * получить минимальное значение координаты Y
     * 
     */

    return SMath.floor(array[0].position.y - SMath.floor(array[0].scale.y / 2))

  }

  getMinX(array = []) {

    /** 
     * отсортировать грузы по ярусам в порядке возрастания
     *  
     */

    array = array.sort((a, b) => {

      /** get minimal Y geo */

      const aa = SMath.floor(a.position.x - SMath.floor(a.scale.x / 2))
      const bb = SMath.floor(b.position.x - SMath.floor(b.scale.x / 2))

      /** compare */

      if (aa < bb) return -1
      if (aa > bb) return 1
    
      return 0
    })

    /**
     * получить минимальное значение координаты Y
     * 
     */

    return SMath.floor(array[0].position.x - SMath.floor(array[0].scale.x / 2))

  }

  getMaxZ(array = []) {

    /** 
     * отсортировать грузы по ярусам в порядке возрастания
     *  
     */

    array = array.sort((a, b) => {

      /** get minimal Y geo */

      const aa = SMath.floor(a.position.z + SMath.floor(a.scale.z / 2))
      const bb = SMath.floor(b.position.z + SMath.floor(b.scale.z / 2))

      /** compare */

      if (aa < bb) return 1
      if (aa > bb) return -1
    
      return 0
    })

    /**
     * получить минимальное значение координаты Y
     * 
     */

    return SMath.floor(array[0].position.z + SMath.floor(array[0].scale.z / 2))

  }

  dispose() {
    this.clear()
  }

  clear() {
    // console.log('Step.clear()')

    /**
     * значения по-умолчанию
     * 
     */

    this.type = 1
    this.start = []
    this.final = []
    this.delay = []
    this.queue = []
    this.storage = []

    this.enable = false
  }

}

export { SceneStep }