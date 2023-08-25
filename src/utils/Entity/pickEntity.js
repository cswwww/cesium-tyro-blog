/*
 * @Date: 2023-06-28 08:42:51
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-25 15:15:51
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\pickEntity.js
 * @Description: Entity 拾取
 */
// TODO 未完成
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// 添加拾取事件
var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
handler.setInputAction(function(movement) {
  var pickedEntity = pickEntity(viewer, movement.position)
  console.log(pickedEntity)

  var pickedEntities = drillPickEntities(viewer, movement.position)
  console.log(pickedEntities)
}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

function pickEntity(viewer, windowPosition) {
  var picked = viewer.scene.pick(windowPosition)
  if (Cesium.defined(picked)) {
    var id = Cesium.defaultValue(picked.id, picked.primitive.id)
    if (id instanceof Cesium.Entity) {
      return id
    }
  }
  return undefined
}

function drillPickEntities(viewer, windowPosition) {
  var i
  var entity
  var picked
  var pickedPrimitives = viewer.scene.drillPick(windowPosition)
  var length = pickedPrimitives.length
  var result = []
  var hash = {}

  for (i = 0; i < length; i++) {
    picked = pickedPrimitives[i]
    entity = Cesium.defaultValue(picked.id, picked.primitive.id)
    if (
      entity instanceof Cesium.Entity &&
      !Cesium.defined(hash[entity.id])
    ) {
      result.push(entity)
      hash[entity.id] = true
    }
  }
  return result
}
