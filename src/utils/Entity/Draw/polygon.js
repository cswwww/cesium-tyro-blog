/*
 * @Date: 2023-07-12 18:47:18
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-15 11:32:26
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\Draw\polygon.js
 * @Description: 绘制面
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

export class PolygonDrawer {
  activePoint // 动态点
  constructor(callback) {
    if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
      window.alert('This browser does not support polylines on terrain.')
    }
    if (!PolygonDrawer.instance) { // 首次使用构造器实例
      this.callback = callback
      // 新建DataSource用来管理entities
      this.nodeCollection = new Cesium.CustomDataSource('nodeEntityCollection')
      this.polygonCollection = new Cesium.CustomDataSource('polygonEntityCollection')
      viewer.dataSources.add(this.nodeCollection)
      viewer.dataSources.add(this.polygonCollection)

      this.addHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 新增点位的交互句柄
      this.finHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 完成点选的交互句柄
      this.moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas) // 完成点选的交互句柄

      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK) // 关闭左键双击事件
      PolygonDrawer.instance = this // 将this挂载到PolygonDrawer这个类的instance属性上
    }
    return PolygonDrawer.instance // 返回单例
  }

  // 开始绘制
  start() {
    this.activePoint = this.createCursorPoint({ x: 0, y: 0, z: 0 }) // 默认显示动态点
    this.activePoint.position.setValue(undefined) // 隐藏指针点

    const pointList = [] // 初始化当前的线坐标数组
    // 事件：新增点
    this.addHandler.setInputAction(event => {
      // 获取地形表面经纬度和高度
      const ray = viewer.camera.getPickRay(event.position || event.endPosition)
      const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
      // // 获取椭球体表面的经纬度
      // const cartesian = viewer.camera.pickEllipsoid(event.position || event.endPosition, viewer.scene.globe.ellipsoid);

      if (Cesium.defined(cartesian)) {
        this.nodeCollection.entities.add(this.createNodePoint(cartesian)) // 添加节点
        // 绘制动态线：首次点击后触发
        if (pointList.length === 0) {
          pointList.push(cartesian) // 加入一个动态点
        }
        if (pointList.length === 2) {
          const dynamicPositions = new Cesium.CallbackProperty(() => new Cesium.PolygonHierarchy(pointList), false)
          this.polygonCollection.entities.add(this.createNormalPolygon(dynamicPositions)) // 绘制线
        }
        pointList.push(cartesian)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    // 事件：鼠标移动
    this.moveHandler.setInputAction(event => {
      if (Cesium.defined(this.activePoint)) {
        // 获取地形表面经纬度和高度
        const ray = viewer.camera.getPickRay(event.endPosition || event.position)
        const cartesian = viewer.scene.globe.pick(ray, viewer.scene)
        // // 获取椭球体表面的经纬度
        // const cartesian = viewer.camera.pickEllipsoid(event.position || event.endPosition, viewer.scene.globe.ellipsoid);
        if (Cesium.defined(cartesian)) {
          this.activePoint.position.setValue(cartesian)
          if (pointList.length > 0) {
            pointList.pop()
            pointList.push(cartesian)
          }
        } else {
          this.activePoint.position.setValue(undefined) // 指针超出地球外了就隐藏指针点
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

    // 事件：完成绘制
    this.finHandler.setInputAction(event => {
      if (pointList.length < 2) { // 一个节点都没添加
        alert('请至少选3个点')
      } else if (pointList.length < 3) { // 如果点击了1次
        alert('请至少选3个点')
        console.log('this.nodeCollection.entities: ', this.nodeCollection.entities)

        this.nodeCollection.entities.remove(this.nodeCollection.entities.values[this.nodeCollection.entities.values.length - 1])
        this.polygonCollection.entities.remove(this.polygonCollection.entities.values[this.polygonCollection.entities.values.length - 1])
      } else if (pointList.length < 4) { // 如果点击了2次
        alert('请至少选3个点')
        this.nodeCollection.entities.remove(this.nodeCollection.entities.values[this.nodeCollection.entities.values.length - 1])
        this.nodeCollection.entities.remove(this.nodeCollection.entities.values[this.nodeCollection.entities.values.length - 1])
        this.polygonCollection.entities.remove(this.polygonCollection.entities.values[this.polygonCollection.entities.values.length - 1])
        this.polygonCollection.entities.remove(this.polygonCollection.entities.values[this.polygonCollection.entities.values.length - 1])
      }
      pointList.pop()

      this.stop()
      this.start()
      this.callback && this.callback(this.polygonCollection, pointList) // 如果需要，就把数据集合给回调函数
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }

  // 结束绘制
  stop() {
    this.addHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.moveHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.finHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    viewer.entities.remove(this.activePoint) // 移除动态点
  }

  // 绘制：动态点
  createCursorPoint(cartesian, show) {
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 5, // 像素大小，默认: 1
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.SKYBLUE, // 默认: 白
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
    return point
  }

  // 绘制：节点
  createNodePoint(cartesian) {
    return new Cesium.Entity({
      position: cartesian,
      point: {
        pixelSize: 3, // 像素大小，默认: 1
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.BLUE, // 默认: 白
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
  }

  // 绘制：面
  createNormalPolygon(list) {
    return new Cesium.Entity({
      polygon: {
        hierarchy: list,
        clampToGround: true,
        material: new Cesium.ColorMaterialProperty(
          Cesium.Color.WHITE.withAlpha(0.7)
        )
      }
    })
  }

  // 销毁：清空绘制与监听
  destroy() {
    this.stop()
    this.nodeCollection.entities.removeAll()
    this.polygonCollection.entities.removeAll()
  }
}
