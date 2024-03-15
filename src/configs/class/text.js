import { Text } from 'troika-three-text'

class SceneText {

  /**
   * text
   * 
   */

  static addText(value, position, name, size = 0.2) {

    const text = new Text()

    text.text = value
    text.material.fog = false
    text.color = 0x292929

    text.name = name
    text.fontSize = size

    text.position.y = position.y
    text.position.x = position.x
    text.position.z = position.z

    text.rotation.x = -0.5 * Math.PI
    text.rotation.z = 1 * Math.PI
    
    text.updateMatrix()
    text.matrixAutoUpdate = false

    return text  
  }

  static setFontSize(object, type = 1) {

    /**
     * определить размер шрифта в зависимости от родителя
     * 
     */

    let scale

    switch (type) {
    case 1:
      scale = 0.2
      break
    case 2:
      scale = 0.17
      break
    case 3:
      scale = 0.12
      break
    default:
      scale = 0.2 
    }

    /**
     * выбор размеров сторон родителя для расчета размера шрифта
     * 
     */

    let fontSize = object.scale.x * scale

    if (object.scale.z * scale < fontSize) fontSize = object.scale.z * scale

    return fontSize
  }

}

export { SceneText }