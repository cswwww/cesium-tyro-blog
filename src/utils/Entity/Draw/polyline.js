/*
 * @Date: 2023-07-12 18:47:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-14 19:28:58
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\Draw\polyline.js
 * @Description: 绘制多段线
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象

import * as Cesium from 'cesium'


export class PolylineDrawer {
  nodeCollection // 结点（节点）集合
  lineCollection // 所有线的集合
  activeLine // 动态线
  activePoint // 动态点
  constructor() {
    this.addHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 新增点位的交互句柄
    this.finHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 完成点选的交互句柄
    this.moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 完成点选的交互句柄

    this.lineCollection = new Cesium.EntityCollection(); // 创建实体集合

    this.nodeCollection = new Cesium.CustomDataSource("nodeEntityCollection");
    this.lineCollection = new Cesium.CustomDataSource("lineEntityCollection");
    viewer.dataSources.add(this.nodeCollection);
    viewer.dataSources.add(this.lineCollection);

    // 关闭左键双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }

  // 开始绘制
  start() {
    this.activePoint = this._cursorPoint({ x: 0, y: 0, z: 0 }); // 默认显示动态点
    this.activePoint.position.setValue(undefined); // 隐藏指针点

    let pointList = undefined
    // 绘制打点时的事件
    this.addHandler.setInputAction(event => {
      const ray = viewer.camera.getPickRay(event.position || event.endPosition);
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      if (Cesium.defined(cartesian)) {
        this.nodeCollection.entities.add(this._nodePoint(cartesian)); // 添加节点
        // 绘制动态线：首次点击后触发
        if (pointList == undefined) {
          pointList = [] // 初始化当前的线坐标数组
          pointList.push(cartesian) // 加入一个动态点
          const dynamicPositions = new Cesium.CallbackProperty(() => {
            return pointList.slice(-2);
          }, false);
          this.activeLine = this._activeLine(dynamicPositions); // 添加动态线
        }
        // 绘制线：点击2次后触发
        if (pointList.length === 1) {
          const dynamicPositions = new Cesium.CallbackProperty(() => {
            return pointList.slice(0, -1)
          }, false);

          this.lineCollection.entities.add(this._nomalLine(dynamicPositions)) // 绘制线
        }
        pointList.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 鼠标移动时的事件
    this.moveHandler.setInputAction(event => {
      if (Cesium.defined(this.activePoint)) {
        const ray = viewer.camera.getPickRay(event.endPosition || event.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        if (Cesium.defined(cartesian)) {
          this.activePoint.position.setValue(cartesian);
          if (pointList !== undefined) {
            pointList.pop();
            pointList.push(cartesian);
          }
        } else {
          this.activePoint.position.setValue(undefined); // 指针超出地球外了就隐藏指针点
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 完成绘制时的事件
    this.finHandler.setInputAction(event => {
      this.stop()
      this.start()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  // 结束绘制
  stop() {
    this.addHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.moveHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.finHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    viewer.entities.remove(this.activeLine); // 移除动态线
    viewer.entities.remove(this.activePoint); // 移除动态点
  }

  // 绘制：动态点
  _cursorPoint(cartesian, show) {
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        show: show,
        pixelSize: 5, // 像素大小，默认: 1 
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.SKYBLUE, // 默认: 白
        outlineColor: Cesium.Color.BLACK, // 边框颜色,默认: 黑
        outlineWidth: 3, // 边框宽度,默认: 0
        // scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0), // 随着相机的距离改变大小
        // translucencyByDistance: new Cesium.NearFarScalar(1.0e3,1.0,2.0e3,0.1), // 随着相机的距离改变透明度
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0,2.0e3), // 在指定距离区间内可见
        // 获取或设置与相机的距离，在深度处禁用深度测试
        // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    return point;
  }

  // 绘制：节点
  _nodePoint(cartesian) {
    return new Cesium.Entity({
      position: cartesian,
      point: {
        show: true,
        pixelSize: 3, // 像素大小，默认: 1 
        // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.BLUE, // 默认: 白
        outlineColor: Cesium.Color.BLACK, // 边框颜色,默认: 黑
        outlineWidth: 1, // 边框宽度,默认: 0
        // scaleByDistance: new Cesium.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0), // 随着相机的距离改变大小
        // translucencyByDistance: new Cesium.NearFarScalar(1.0e3,1.0,2.0e3,0.1), // 随着相机的距离改变透明度
        // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0,2.0e3), // 在指定距离区间内可见
        // 获取或设置与相机的距离，在深度处禁用深度测试
        // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }
    })
  }

  // 绘制：动态线
  _activeLine(list) {
    const shape = viewer.entities.add({
      polyline: {
        positions: list,
        clampToGround: true,
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.RED,
          dashLength: 10,
          dashPattern: 255,
        }),
      },
    });
    return shape;
  }

  // 绘制：线
  _nomalLine(list) {
    return new Cesium.Entity({
      polyline: {
        positions: list,
        clampToGround: true,
        width: 2,
      },
    })
  }

  // 销毁：清空绘制与监听
  destroy() {
    this.stop()

    this.nodeCollection.entities.removeAll()
    this.lineCollection.entities.removeAll()
  }
}
