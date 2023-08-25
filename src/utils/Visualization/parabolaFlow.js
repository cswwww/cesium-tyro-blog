import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// 抛物飞线效果
parabolaFlowInit(this.viewer, 3)

/**
* @description: 抛物飞线效果初始化
* @param {*} _viewer
* @param {*} _num :每条线上的飞线数量
* @return {*}
*/
function parabolaFlowInit(_viewer, _num) {
  const _center = [113.9236839, 22.528061]
  const _positions = [
    [113.8236839, 22.528061],
    [114.0236839, 22.528061],
    [113.9236839, 22.428061],
    [113.9236839, 22.628061],
    [113.8236839, 22.428061],
    [114.0236839, 22.628061],
    [113.8236839, 22.628061],
    [114.0236839, 22.428061]
  ]
  _positions.forEach(item => {
    const _siglePositions = parabola(_center, item, 5000)
    // 创建飞线
    for (let i = 0; i < _num; i++) {
      _viewer.entities.add({
        polyline: {
          positions: _siglePositions,
          material: new Cesium.LineFlowMaterialProperty({
            color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
            speed: 15 * Math.random(),
            percent: 0.1,
            gradient: 0.01
          })
        }
      })
    }
    // 创建轨迹线
    _viewer.entities.add({
      polyline: {
        positions: _siglePositions,
        material: new Cesium.Color(1.0, 1.0, 0.0, 0.2)
      }
    })
  })

  /**
   * @description: 抛物线构造函数（参考开源代码）
   * @param {*}
   * @return {*}
   */
  function parabola(
    startPosition,
    endPosition,
    height = 0,
    count = 50
  ) {
    // 方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
    const result = []
    height = Math.max(+height, 100)
    count = Math.max(+count, 50)
    const diffLon = Math.abs(startPosition[0] - endPosition[0])
    const diffLat = Math.abs(startPosition[1] - endPosition[1])
    const L = Math.max(diffLon, diffLat)
    let dlt = L / count
    if (diffLon > diffLat) {
      // base on lon
      const delLat = (endPosition[1] - startPosition[1]) / count
      if (startPosition[0] - endPosition[0] > 0) {
        dlt = -dlt
      }
      for (let i = 0; i < count; i++) {
        const h =
          height -
          (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
          Math.pow(L, 2)
        const lon = startPosition[0] + dlt * i
        const lat = startPosition[1] + delLat * i
        const point = new Cesium.Cartesian3.fromDegrees(lon, lat, h)
        result.push(point)
      }
    } else {
      // base on lat
      const delLon = (endPosition[0] - startPosition[0]) / count
      if (startPosition[1] - endPosition[1] > 0) {
        dlt = -dlt
      }
      for (let i = 0; i < count; i++) {
        const h =
          height -
          (Math.pow(-0.5 * L + Math.abs(dlt) * i, 2) * 4 * height) /
          Math.pow(L, 2)
        const lon = startPosition[0] + delLon * i
        const lat = startPosition[1] + dlt * i
        const point = new Cesium.Cartesian3.fromDegrees(lon, lat, h)
        result.push(point)
      }
    }
    return result
  }
}
