/*
 * @Date: 2023-07-31 12:28:08
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-31 23:45:17
 * @FilePath: \cesium-tyro-blog\src\utils\Widgets\measureTool.js
 * @Description: 测量工具
 * import { MeasureTool } from '@/utils/Widgets/measureTool.js'
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import { pickCursor } from '@/utils/Event/cursorEvent.js'

class MeasureTool {
  constructor() {
    this.globeElement = document.getElementById("cesiumContainer"); // 替换为你的地球场景容器元素ID
    this.floatInfoElement = document.createElement('div'); // 创建指针旁的浮动信息元素
    this.measureHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);// 测量工具的交互句柄单例

    this._floatInfoStyle()
  }

  // 修改浮动信息元素的样式和内容
  _floatInfoStyle() {
    this.globeElement.appendChild(this.floatInfoElement);

    this.floatInfoElement.style.position = 'fixed';
    this.floatInfoElement.style.bottom = '10px';
    this.floatInfoElement.style.left = '10px';
  }

  // 坐标获取与转换
  _coordsTransform(event, got, not) {
    const ray = viewer.camera.getPickRay(event.position || event.endPosition); // 从摄影机位置创建一条光线，穿过世界坐标中position处的像素。
    // const cartesian = viewer.scene.pickPosition(event.position || event.endPosition); // 使用pickPosition方法直接获取地球上的位置
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (Cesium.defined(cartesian)) {
      got?.(cartesian);
    } else {
      not?.();
    }
  }

  // 鼠标移动事件处理函数
  _onMouseMove(movement) {
    this._coordsTransform(movement, (cartesian) => {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);

      // 更新经纬度信息
      this.floatInfoElement.innerHTML = `经度: ${longitude.toFixed(6)}<br>纬度: ${latitude.toFixed(6)}`;
      this.floatInfoElement.style.display = 'block';
      this.floatInfoElement.style.left = `${movement.endPosition.x + 10}px`;
      this.floatInfoElement.style.top = `${movement.endPosition.y + 10}px`;
    }, () => {
      this.floatInfoElement.style.display = 'none';
    })
  }

  // 添加广告牌
  _addBillboard(event) {
    this._coordsTransform(event, (cartesian) => {
      // 将 Cartesian3 坐标转换为 Cartographic 格式
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      // 将弧度表示的经纬度转换为度表示
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;

      // 创建广告牌
      const billboard = viewer.entities.add({
        position: cartesian,
        billboard: {
          // image: '',
          scale: 1.0,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          eyeOffset: new Cesium.Cartesian3(0, 0, -30), // 调整广告牌的垂直位置
          disableDepthTestDistance: Number.POSITIVE_INFINITY, // 2000，设置2000时将在2000米内禁用深度检测
        },
        label: {
          text: `经度: ${longitude.toFixed(6)}\n纬度: ${latitude.toFixed(6)}`,
          showBackground: true,
          backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.7),
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          pixelOffset: new Cesium.Cartesian2(0, -40) // 调整标签的位置
        }
      });
    })
  }
  // ! 坐标拾取
  coordinatePicker() {
    pickCursor() // 修改指针
    this.measureHandler.setInputAction(this._onMouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.measureHandler.setInputAction(this._addBillboard.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // ! 销毁所有测量功能
  destroy() {
    pickCursor(false)
  }
}

export {
  MeasureTool
}
