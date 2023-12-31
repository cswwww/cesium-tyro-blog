/*
 * @Date: 2023-08-25 11:48:39
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-25 11:49:44
 * @FilePath: \cesium-tyro-blog\src\utils\Visualization\satelliteOrbit.js
 * @Description: 绘制卫星轨道（未完成）
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

var start = new Cesium.JulianDate.fromDate(new Date()) // 当前时间
start = Cesium.JulianDate.addHours(start, 8, new Cesium.JulianDate()) // 东八区时间
// 结束时间
var stop = Cesium.JulianDate.addSeconds(
  start,
  360,
  new Cesium.JulianDate()
)
// 确保查看器处于预期的时间
viewer.clock.startTime = start.clone()
viewer.clock.stopTime = stop.clone()
viewer.clock.currentTime = start.clone()
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP // 循环结束时
// 时间变化来控制速度 // 时间速率，数字越大时间过的越快
viewer.clock.multiplier = 10
// 给时间线设置边界
viewer.timeline.zoomTo(start, stop)

var positionArr = new Cesium.SampledPositionProperty() // 这才是做重要的
var lon = Math.floor(Math.random() * 360)
var lat = Math.floor(Math.random() * 360)
for (let k = lat; k <= 360 + lat; k += 30) {
  const obj = {
    lon: lon,
    lat: k,
    time: k - lat,
    hei: 7000000
  }
  // console.log(obj,'obj');
  var time = Cesium.JulianDate.addSeconds(
    start,
    obj.time,
    new Cesium.JulianDate()
  )
  // 经纬度转换为世界坐标
  var position = Cesium.Cartesian3.fromDegrees(
    obj.lon,
    obj.lat,
    obj.hei
  )
  // console.log(position, 'position');

  positionArr.addSample(time, position)
  // positionArr.push(property)
}
// 开始绘画一个
const polyline_1 = viewer.entities.add({
  availability: new Cesium.TimeIntervalCollection([
    new Cesium.TimeInterval({
      start: start,
      stop: stop
    })
  ]),
  id: 'my_polyline_1',
  name: 'test_polyline_1',
  position: positionArr,

  orientation: new Cesium.VelocityOrientationProperty(positionArr),
  path: {
    resolution: 1,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.1,
      color: Cesium.Color.GREEN
    }),
    width: 5
  }
})
// console.log(polyline_1,'polyline_1');
// 这个让折现变成曲线
polyline_1.position.setInterpolationOptions({
  interpolationDegree: 5,
  interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
})
