/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 18:41:24
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\ellipse.js
 * @Description: 实体类中椭圆或拉伸的椭圆的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23) {
  const position = Cesium.Cartesian3.fromDegrees(x, y)
  const options = {
    show: true,
    semiMajorAxis: 300000.0, // 长半轴距离
    semiMinorAxis: 150000.0, // 短半轴距离

    height: 20000.0,
    heightReference: Cesium.HeightReference.NONE,
    extrudedHeight: 20000.0,
    extrudedHeightReference: Cesium.HeightReference.NONE,

    // rotation: Cesium.Math.toRadians(45), // 从北方逆时针旋转
    stRotation: 0.0, // 纹理从北方逆时针旋转
    granularity: Cesium.Math.RADIANS_PER_DEGREE, // 椭圆上各点之间的角距离
    material: Cesium.Color.BLUE.withAlpha(0.5),
    fill: true,
    outline: true,
    outlineColor: Cesium.Color.DARK_GREEN,
    outlineWidth: 1.0,
    numberOfVerticalLines: 16, // 沿轮廓的周长绘制的垂直线的数量
    shadows: Cesium.ShadowMode.DISABLED,
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),

    // 在地面上时将对地形，3D tiles还是对两者进行分类  type:ClassificationType  default:ClassificationType.BOTH
    // TERRAIN 将仅对地形进行分类;CESIUM_3D_TILE 将仅对3D瓷砖进行分类;BOTH	将同时对Terrain和3D Tile进行分类。
    classificationType: Cesium.ClassificationType.BOTH
  }
  const entity = viewer.entities.add({
    position,
    ellipse: options
  })
  viewer.zoomTo(entity)
  return entity
}

export {
  add
}
