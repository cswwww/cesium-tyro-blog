/*
 * @Date: 2023-06-04 10:41:29
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-16 14:47:07
 * @FilePath: \cesium-tyro-blog\src\utils\ThreeDTiles\splitTileset.js
 * @Description: 3D瓦片集卷帘功能（下面包含两个版本）
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import { addThreeDTiles } from '@/utils/ThreeDTiles/loadTileset.js'

let leftTileset // 左边的瓦片集
let rightTileset // 右边的瓦片集

export class splitTileset {
  slider // 滑动分割线的div元素
  sliderWidth // 分割线的宽度
  target // 渲染cesium场景的元素
  leftTileset // 左边的瓦片集
  rightTileset // 右边的瓦片集
  moveActive = false // 开启分割线位移

  constructor(target = 'cesiumContainer') {
    this.target = target
  }

  // 创建分割线的div元素
  spilitElement() {
    const cesiumCon = document.getElementById(this.target) // 获取地球渲染的target

    this.slider = document.createElement('div')
    this.sliderWidth = '5px' // 分割线的宽度

    this.slider.id = 'slider'
    this.slider.style.width = this.sliderWidth
    this.slider.style.height = '100%'
    this.slider.style.position = 'fixed'
    this.slider.style.left = '50%'
    this.slider.style.top = '0'
    this.slider.style.backgroundColor = '#3370FF'
    this.slider.style.zIndex = '10'
    this.slider.style.cursor = 'col-resize'

    // 将滑动条添加到页面中的元素内
    if (cesiumCon) {
      cesiumCon.appendChild(this.slider)
    } else {
      document.querySelector('body').appendChild(this.slider)
    }
  }

  // 设置分割线左侧展示的瓦片集
  setLeftTileset(url = 75343) {
    if (leftTileset) {
      viewer.scene.primitives.remove(leftTileset);
    }
    const modelPromise = addThreeDTiles(url)
    modelPromise.then(tileset => {
      leftTileset = tileset
      leftTileset.splitDirection = Cesium.SplitDirection.LEFT // 分割方向
    })
  }

  // 设置分割线右侧展示的瓦片集
  setRightTileset(url) {
    if (rightTileset) {
      viewer.scene.primitives.remove(rightTileset);
    }

    // 默认加载osm建筑
    if (!url) {
      Cesium.createOsmBuildingsAsync().then(tileset => {
        viewer.scene.primitives.add(tileset)
        rightTileset = tileset
        rightTileset.splitDirection = Cesium.SplitDirection.RIGHT // 分割方向
      })
      return
    }
    const modelPromise = addThreeDTiles(url)
    modelPromise.then(tileset => {
      rightTileset = tileset
      rightTileset.splitDirection = Cesium.SplitDirection.RIGHT // 分割方向
    })
  }

  // // 获取当前场景中所有的影像图层并保存到数组中
  // saveImageryLayers() {
  //   const layers = viewer.imageryLayers;
  //   this.imageryLayers = []
  //   for (let i = 0; i < layers.length; i++) {
  //     this.imageryLayers.push(layers.get(i));
  //   }

  //   layers.removeAll(false) // 移除所有 ImageryLayer
  // }

  // TODO 未完成：重新加载之前保存的瓦片集
  reloadTileset() {
    if (leftTileset) {
      console.log('leftTileset: ', leftTileset);
      viewer.scene.primitives.remove(leftTileset);
    }
    if (rightTileset) {
      viewer.scene.primitives.remove(rightTileset);
    }
  }

  // 开始卷
  actionSplit() {
    // this.saveImageryLayers()
    this.spilitElement()
    this.setLeftTileset()
    this.setRightTileset()
    // 依据滑动条的默认位置设置场景的分割位置，值为0到1之间
    viewer.scene.splitPosition = this.slider.offsetLeft / this.slider.parentElement.offsetWidth

    this.handler = new Cesium.ScreenSpaceEventHandler(this.slider)

    this.handler.setInputAction(() => {
      this.moveActive = true
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN) // 未适配PINCH、PINCH_START等操作

    this.handler.setInputAction(this._moveEvnet.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    this.handler.setInputAction(() => {
      this.moveActive = false
      // 不要让分割线超出界面了
      if (parseFloat(this.slider.style.left.replace('%', '')) > 100) {
        this.slider.style.left = `calc(100% - ${this.sliderWidth})`
      } else if (parseFloat(this.slider.style.left.replace('%', '')) < 0) {
        this.slider.style.left = '0%'
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP)

  }

  // 不卷了
  stopSplit() {
    if (!this.slider) {
      return
    }
    this.reloadTileset()

    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)

    const cesiumCon = document.getElementById(this.target) // 获取地球渲染的target
    if (cesiumCon) {
      cesiumCon.removeChild(this.slider)
    } else {
      document.querySelector('body').removeChild(this.slider)
    }
  }

  // 滑动事件： 修改滑动条的位置以及视图分割的位置
  _moveEvnet(movement) {
    if (!this.moveActive) {
      return
    }

    const relativeOffset = movement.endPosition.x
    const splitPosition = (this.slider.offsetLeft + relativeOffset) / this.slider.parentElement.offsetWidth

    this.slider.style.left = `${100.0 * splitPosition}%`
    viewer.scene.splitPosition = splitPosition
  }
}



/**
 * @description: 即调即用的简单版影像卷帘功能
 * @param {*} target - 挂载地球视图div元素
 * e.g. tilesCompare()
 */
export function tilesCompare(target = 'cesiumContainer') {
  const cesiumCon = document.getElementById(target) // 获取地球渲染的target
  const slider = document.createElement('div')

  slider.id = 'slider'
  slider.style.width = '5px'
  slider.style.height = '100%'
  slider.style.position = 'absolute'
  slider.style.left = '50%'
  slider.style.top = '0'
  slider.style.backgroundColor = '#3370FF'
  slider.style.zIndex = '10'

  // 将滑动条添加到页面中的某个元素内
  if (cesiumCon) {
    cesiumCon.appendChild(slider) // 将slider元素添加到father元素的子元素列表中
  } else {
    document.querySelector('body').appendChild(slider)
  }
  // 左边的那堆模型
  const left = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(69380)
    })
  )
  // 右边的那堆模型
  const right = viewer.scene.primitives.add(
    Cesium.createOsmBuildings()
  )
  viewer.zoomTo(left)

  left.splitDirection = Cesium.SplitDirection.LEFT
  right.splitDirection = Cesium.SplitDirection.RIGHT

  // Sync the position of the slider with the split position
  viewer.scene.splitPosition = slider.offsetLeft / slider.parentElement.offsetWidth

  let moveActive = false

  function move(movement) {
    if (!moveActive) {
      return
    }

    const relativeOffset = movement.endPosition.x
    const splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth
    slider.style.left = `${100.0 * splitPosition}%`
    viewer.scene.splitPosition = splitPosition
  }

  const handler = new Cesium.ScreenSpaceEventHandler(slider)

  handler.setInputAction(function () {
    moveActive = true
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
  handler.setInputAction(function () {
    moveActive = true
  }, Cesium.ScreenSpaceEventType.PINCH_START)

  handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE)

  handler.setInputAction(function () {
    moveActive = false
  }, Cesium.ScreenSpaceEventType.LEFT_UP)
  handler.setInputAction(function () {
    moveActive = false
  }, Cesium.ScreenSpaceEventType.PINCH_END)
}
