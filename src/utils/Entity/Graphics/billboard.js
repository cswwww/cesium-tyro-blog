/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-08 09:02:17
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\Graphics\billboard.js
 * @Description: 实体类中广告牌的相关函数
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import img from "../../assets/images/meme.jpg"
function add(x = 122, y = 23, z=100) {
  const position = Cesium.Cartesian3.fromDegrees(x, y, z);
  const options = {
    show: true,
    image: img, // A Property specifying the Image, URI, or Canvas to use for the billboard.
    scale: 2.0, // default: 1.0
    //像素偏移    type: Cartesian2    default:Cartesian2.ZERO
    pixelOffset: new Cesium.Cartesian2(0, -50),
    //眼睛偏移    type: Cartesian3    default:Cartesian3.ZERO
    eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0),
    // 水平对齐方式  type: HorizontalOrigin  default:HorizontalOrigin.CENTER
    // CENTER 原点在对象的水平中心；LEFT 原点在对象的左侧；RIGHT 原点在对象的右侧
    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    // 垂直对齐方式  type: VerticalOrigin  default:VerticalOrigin.CENTER
    // CENTER 原点位于 BASELINE 和 TOP 之间的垂直中心；BOTTOM 原点在对象的底部；
    // BASELINE 如果对象包含文本，则原点位于文本的基线，否则原点位于对象的底部；TOP 原点在对象的顶部
    verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER 垂直对齐位置 参考Cesium.VerticalOrigin
    // 获取或设置此广告牌的高度参考    type: HeightReference    default:HeightReference.NONE
    // NONE 位置绝对；CLAMP_TO_GROUND 位置固定在地形上；RELATIVE_TO_GROUND 位置高度是指地形上方的高度
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    // 颜色  type: Color  default:Color.WHITE
    color: Cesium.Color.WHITE,
    // 获取或设置以弧度为单位的旋转角度  type: number  default:0
    // rotation: Cesium.Math.PI_OVER_FOUR,
    // 获取或设置世界空间中的对齐轴  type:Cartesian3  default:Cartesian3.ZERO
    alignedAxis: Cesium.Cartesian3.ZERO,
    sizeInMeters: false, // 指定此广告牌的大小是否应以米为单位进行测量
    width: 50, // default: undefined
    height: 50, // default: undefined

    // 根据广告牌与相机的距离获取或设置广告牌的近和远缩放属性  type:NearFarScalar
    scaleByDistance: new Cesium.NearFarScalar(1.0e3, 2.0, 2.0e3, 1.0),
    // 根据广告牌到相机的距离，获取或设置广告牌的近和远半透明属性  type:NearFarScalar
    translucencyByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.5
    ),
    // 根据广告牌与摄像头的距离，获取或设置广告牌的近像素偏移量和远像素偏移量缩放属性  type:NearFarScalar
    pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
      1.0e3,
      1.0,
      1.5e6,
      0.0
    ),

    // 设置1000米和2000米之间可见  type:DistanceDisplayCondition
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),
    // 获取或设置与相机的距离，在深度处禁用深度测试，例如，以防止剪切地形。
    // 设置为零时，将始终应用深度测试。设置为Number.POSITIVE_INFINITY时，永远不会应用深度测试。
    disableDepthTestDistance: Number.POSITIVE_INFINITY,
  }
  const entity = viewer.entities.add({
    // id: "",
    name: "billboard",
    // show: true,
    // description: "",
    // orientation: "",
    position,
    billboard: options
  });
  viewer.zoomTo(entity);
  return entity
}

export {
  add
}