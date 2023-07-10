/*
 * @Date: 2023-07-05 12:10:52
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-10 14:20:15
 * @FilePath: \cesium-tyro-blog\src\utils\ThreeDTiles\clipTileset.js
 * @Description: 平面裁剪
 * import { planeClipping } from '@/utils/ThreeDTiles/clipTileset.js'
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

export function planeClipping(tileset) {
  const planeFillColor = Cesium.Color.WHITE.withAlpha(0.5) // 平面的默认颜色
  const planeOutlineColor = Cesium.Color.YELLOW // 平面边框的默认颜色
  let targetY = 0.0 // 裁剪平面移动量（鼠标在屏幕坐标系Y轴上的移动）

  // 为模型数据集设置裁剪平面
  tileset.clippingPlanes = new Cesium.ClippingPlaneCollection({
    planes: [
      // 设置一个垂直于Z轴的裁剪平面，裁剪平面的方向是沿着向量的方向
      new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0)
    ],
    edgeWidth: 3
  })

  // 遍历数据集的裁剪平面，构建裁剪平面实体
  for (let i = 0; i < tileset.clippingPlanes.length; i++) {
    const plane = tileset.clippingPlanes.get(i)
    viewer.entities.add({
      position: tileset.boundingSphere.center,
      plane: {
        // 平面的范围(边界)
        dimensions: new Cesium.Cartesian2(
          tileset.boundingSphere.radius * 1.5,
          tileset.boundingSphere.radius * 1.5
        ),
        material: planeFillColor,
        plane: new Cesium.CallbackProperty( // CallbackProperty令plane的属性值变为动态的
          () => {
            plane.distance = targetY
            return plane
          },
          false
        ),
        outline: true,
        outlineColor: planeOutlineColor
      }
    })
  }

  let selectedPlane // 当前选中的裁剪平面
  const mouseHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 鼠标操作句柄
  
  mouseHandler.setInputAction(function (movement) {
    // 拾取裁剪面实体
    const pickedObject = viewer.scene.pick(movement.position)

    if (pickedObject?.id?.plane) {
      // 鼠标左键按下，并拾取到裁剪平面实体时，设置裁剪平面实体的颜色，边线
      selectedPlane = pickedObject.id.plane
      selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05)

      viewer.scene.screenSpaceCameraController.enableInputs = false; // 将相机控制输入关闭
    }

  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)

  mouseHandler.setInputAction(function () {
    console.log('selectedPlane: ', selectedPlane);

    if (Cesium.defined(selectedPlane)) {
      // 鼠标左键抬起时，设置裁剪平面实体的颜色、边线、销毁当前选中的裁剪平面实体
      selectedPlane.material = planeFillColor
      selectedPlane = undefined
    }
    viewer.scene.screenSpaceCameraController.enableInputs = true // 恢复相机控制输入
  }, Cesium.ScreenSpaceEventType.LEFT_UP)

  mouseHandler.setInputAction(function (movement) {
    if (Cesium.defined(selectedPlane)) {
      // 鼠标移动后，计算移动量，并将移动量叠加到targetY
      const deltaY = movement.startPosition.y - movement.endPosition.y
      targetY += deltaY
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

export function removePlaneClipping(tileset) {
  console.log('tileset.clippingPlanes: ', viewer.entities);

  viewer.entities.removeAll()
  tileset.clippingPlanes.removeAll()
  viewer.scene.screenSpaceCameraController.enableInputs = true // 恢复相机控制
}