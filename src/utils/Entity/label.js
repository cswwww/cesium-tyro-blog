/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-27 18:58:06
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\label.js
 * @Description: 实体类中标签的相关函数
 * https://cesium.com/learn/cesiumjs/ref-doc/LabelGraphics.html#.ConstructorOptions
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

function add(x = 122, y = 23, z = 5000) {
  const position = Cesium.Cartesian3.fromDegrees(x, y, z);
  const options = {
    show: true,
    text: "label标签",
    font: "24px Helvetica",
    // FILL	填充；OUTLINE 只显示边框；FILL_AND_OUTLINE 既有填充又有边框
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    scale: 1.0,
    showBackground: true,
    backgroundColor: Cesium.Color.BLUE,
    backgroundPadding: new Cesium.Cartesian2(7, 5),
    pixelOffset: Cesium.Cartesian2.ZERO,
    eyeOffset: Cesium.Cartesian3.ZERO,
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    verticalOrigin: Cesium.VerticalOrigin.CENTER,
    heightReference: Cesium.HeightReference.NONE,
    fillColor: Cesium.Color.SKYBLUE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    translucencyByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.5
    ),
    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.0
    ),
    scaleByDistance: new Cesium.NearFarScalar(1.0e3, 2.0, 2.0e3, 1.0),
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  }
  const entity = viewer.entities.add({
    position,
    label: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}