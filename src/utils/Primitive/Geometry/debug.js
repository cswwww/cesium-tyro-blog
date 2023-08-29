import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

export function loadDebug(primitive) {
  window.viewer.scene.primitives.add(new Cesium.DebugModelMatrixPrimitive({
    modelMatrix: Cesium.Matrix4.multiply(primitive.modelMatrix, primitive.originalMatrix, primitive.originalMatrix),
    length: 100000.0,
    width: 10.0
  }))
}
