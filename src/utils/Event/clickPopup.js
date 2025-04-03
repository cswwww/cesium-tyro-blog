/*
 * @Date: 2023-07-05 16:47:45
 * @LastEditors: ReBeX cswwwx@gmail.com
 * @LastEditTime: 2025-04-03 17:29:54
 * @FilePath: /cesium-tyro-blog/src/utils/Event/clickPopup.js
 * @Description: 点击出现气泡弹窗
 * @Ref: https://blog.csdn.net/m0_45305745/article/details/132688236
 */

import * as Cesium from 'cesium'
import { createApp } from 'vue'
import { viewer } from './createCesium.js' // 引入地图对象

let popupInstance = null
function clickToPick() {
  let feature = null // 选中的要素对象
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 交互句柄
  handler.setInputAction((event) => {
    feature = viewer.scene.pick(event.position) // 拾取要素
    popupInstance?.remove()

    if (!Cesium.defined(feature)) { return }

    if (feature?.primitive instanceof Cesium.Model) {
      const coor = feature.id.description._value.position
      const position = { x: coor.x, y: coor.y, z: coor.z }
      popupInstance = openPop(position, feature.id.description._value.props, viewer)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

function moveToPick(callback) {
  let feature = null // 选中的要素对象
  const globeElement = document.getElementById('cesiumContainer') // ! 替换为你的地球场景容器元素ID

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 交互句柄
  handler.setInputAction(({ endPosition }) => {
    feature = viewer.scene.pick(endPosition) // 拾取要素

    if (feature?.primitive instanceof Cesium.Model) {
      globeElement.style.cursor = 'pointer' // 参考：https://developer.mozilla.org/zh-CN/docs/Web/CSS/cursor
    } else {
      globeElement.style.cursor = 'default'
    }

    callback?.(feature) // 将选中的要素暴露给回调函数
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

function openPop(position, item, viewer) {
  const pData = item
  pData.offset = {
    x: 35,
    y: -230
  }
  return new CesiumPopup({
    viewer,
    position: Cesium.Cartesian3.fromDegrees(Number(position.x), Number(position.y), Number(position.z || 0)),
    options: pData
  })
}

class CesiumPopup {
  constructor(info, component) {
    this.popupInstance = null // 单例
    this.viewer = info.viewer // 地图实例
    this.position = info.position // 位置
    this.ops = info.options

    this.init(component)
  }

  init(component) {
    this.popupInstance = document.createElement('div')
    this.popupInstance.style.position = 'absolute'
    this.popupInstance.style.zIndex = '1'
    createApp(component, {
      feature: {
        properties: this.ops
      }
    }).mount(this.popupInstance)
    this.viewer.container.appendChild(this.popupInstance)
    this.render()
    const that = this
    this.viewer.scene.postRender.addEventListener(() => {
      that.render()
    })
  }

  render() {
    const p = Cesium.SceneTransforms.worldToWindowCoordinates(this.viewer.scene, this.position)
    if (p) {
      this.popupInstance.style.left = `${p.x + this.ops.offset.x}px`
      this.popupInstance.style.top = `${p.y + this.ops.offset.y}px`
    }
  }

  remove() {
    if (this.popupInstance) {
      this.popupInstance.remove()
    }
  }
}

export {
  clickToPick,
  moveToPick
}
