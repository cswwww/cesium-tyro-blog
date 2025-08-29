/*
 * @Date: 2023-04-10 09:40:27
 * @LastEditors: chenshangwei  cswwww@163.com
 * @LastEditTime: 2023-05-24 17:32:10
 * @FilePath: \cesium-vue\src\utils\VisualFunc\earthRotate.js
 * @Description: 地球自转
 */

// viewer.clock.onTick.addEventListener(() => {
//   viewer.camera.rotate(
//     Cesium.Cartesian3.UNIT_Z,
//     (Math.PI / (24 * 60 * 60)) * (55555 / 1000)
//   )
// })

import * as Cesium from 'cesium'
import { map as viewer } from '@/utils/createCesium.js'

function startRun (option = { multiplier: 1 }) {
  // 监听每次渲染前执行矩阵求解
  viewer.scene.postUpdate.addEventListener(rotateSetting)
  // 根据option修改一些参数
  if (viewer.clock) {
    const keys = Object.keys(option)
    for (const k of keys) {
      viewer.clock[k] = option[k]
    }
  }
}

function stopRun () {
  if (!viewer) {
    return
  }
  viewer.clock.multiplier = 1
  viewer.scene.postUpdate.removeEventListener(rotateSetting)
}

function rotateSetting () {
  if (!viewer || viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
    return
  }
  const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(
    viewer.clock.currentTime
  )
  // icrfToFixed 在上面的方法中，若没加载好所需的计算资源会返回undefined，判断下
  if (Cesium.defined(icrfToFixed)) {
    const camera = viewer.camera
    const offset = Cesium.Cartesian3.clone(camera.position)
    const transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed)
    camera.lookAtTransform(transform, offset)
  }
}

export {
  startRun,
  stopRun
}
