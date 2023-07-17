/*
 * @Date: 2023-07-12 18:47:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-17 08:58:47
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\Draw\polyline.js
 * @Description: 绘制多段线
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象

import * as Cesium from 'cesium'


export class PolylineDrawer {
  activeLine // 动态线
  activePoint // 动态点
  constructor(callback) {
    if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
      window.alert(
        "This browser does not support polylines on terrain."
      );
    }
    if (!PolylineDrawer.instance) { // 首次使用构造器实例
      this.callback = callback
      // 新建DataSource用来管理entities
      this.nodeCollection = new Cesium.CustomDataSource("nodeEntityCollection");
      this.lineCollection = new Cesium.CustomDataSource("lineEntityCollection");
      viewer.dataSources.add(this.nodeCollection);
      viewer.dataSources.add(this.lineCollection);

      this.addHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 新增点位的交互句柄
      this.finHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 完成点选的交互句柄
      this.moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 完成点选的交互句柄

      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); // 关闭左键双击事件
      PolylineDrawer.instance = this // 将this挂载到PolylineDrawer这个类的instance属性上
    }
    return PolylineDrawer.instance // 返回单例
  }

  // 开始绘制
  start() {
    this.activePoint = this.createCursorPoint({ x: 0, y: 0, z: 0 }); // 默认显示动态点
    this.activePoint.position.setValue(undefined); // 隐藏指针点

    let pointList = []; // 初始化当前的线坐标数组
    // 事件：新增点
    this.addHandler.setInputAction(event => {
      // 获取地形表面经纬度和高度
      const ray = viewer.camera.getPickRay(event.position || event.endPosition);
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
      // // 获取椭球体表面的经纬度
      // const cartesian = viewer.camera.pickEllipsoid(event.position || event.endPosition, viewer.scene.globe.ellipsoid);
      if (Cesium.defined(cartesian)) {
        this.nodeCollection.entities.add(this.createNodePoint(cartesian)); // 添加节点
        // 绘制动态线：首次点击后触发
        if (pointList.length === 0) {
          pointList.push(cartesian) // 加入一个动态点
          const dynamicPositions = new Cesium.CallbackProperty(() => pointList.slice(-2), false);
          this.activeLine = this.createActiveLine(dynamicPositions); // 添加动态线
        }
        // 绘制线：点击2次后触发
        if (pointList.length === 1) {
          const dynamicPositions = new Cesium.CallbackProperty(() => pointList.slice(0, -1), false);
          this.lineCollection.entities.add(this.createNormalLine(dynamicPositions)) // 绘制线
        }
        pointList.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 事件：鼠标移动
    this.moveHandler.setInputAction(event => {
      if (Cesium.defined(this.activePoint)) {
        // 获取地形表面经纬度和高度
        const ray = viewer.camera.getPickRay(event.endPosition || event.position);
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
        // // 获取椭球体表面的经纬度
        // const cartesian = viewer.camera.pickEllipsoid(event.position || event.endPosition, viewer.scene.globe.ellipsoid);
        if (Cesium.defined(cartesian)) {
          this.activePoint.position.setValue(cartesian);
          if (pointList.length > 0) {
            pointList.pop();
            pointList.push(cartesian);
          }
        } else {
          this.activePoint.position.setValue(undefined); // 指针超出地球外了就隐藏指针点
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 事件：完成绘制
    this.finHandler.setInputAction(event => {
      if (pointList.length < 2) { // 一个节点都没添加
        alert('请至少选2个点')
      } else if (pointList.length < 3) { // 如果点击了一次，就会马上创建点和线，那么就需要清除掉最末的entity，否则会污染数据集
        alert('请至少选2个点')
        this.nodeCollection.entities.remove(this.nodeCollection.entities.values[this.nodeCollection.entities.values.length - 1]);
        this.lineCollection.entities.remove(this.lineCollection.entities.values[this.lineCollection.entities.values.length - 1]);
      }
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

    this.callback && this.callback(this.lineCollection) // 如果需要，就把线集合给回调函数
  }

  // 绘制：动态点
  createCursorPoint(cartesian, show) {
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 5, // 像素大小，默认: 1 
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.SKYBLUE, // 默认: 白
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    return point;
  }

  // 绘制：节点
  createNodePoint(cartesian) {
    return new Cesium.Entity({
      position: cartesian,
      point: {
        pixelSize: 3, // 像素大小，默认: 1 
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.BLUE, // 默认: 白
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }
    })
  }

  // 绘制：动态线
  createActiveLine(list) {
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
  createNormalLine(list) {
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
