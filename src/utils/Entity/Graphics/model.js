/*
 * @Date: 2023-06-19 19:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-28 19:18:23
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\model.js
 * @Description: 实体类中模型的相关函数
 * https://cesium.com/learn/cesiumjs/ref-doc/ModelGraphics.html#.ConstructorOptions
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

/**
 * Initializes a new model entity and adds it to the viewer.
 *
 * @param {Object} xyz - The coordinates of the model entity in the form of {x, y, z}.
 * @return {Entity} The newly created model entity.
 */
function add(xyz) {
  const position = Cesium.Cartesian3.fromDegrees(
    xyz?.x || 122,
    xyz?.y || 23,
    xyz?.z || 0
  )

  // 相机位姿取弧度制
  const heading = Cesium.Math.toRadians(45) // 围绕Z轴的旋转
  const pitch = Cesium.Math.toRadians(0) // 围绕X轴旋转
  const roll = Cesium.Math.toRadians(0) // 绕Y轴旋转
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  // 将三个欧拉角转换为四元数，用于控制模型的方位
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
  )

  const options = {
    show: true,
    uri: "/src/assets/model/glb/Cesium_Air.glb", // A string or Resource Property specifying the URI of the glTF asset.
    scale: 1.0,
    minimumPixelSize: 128, // 模型的最小像素大小，而不考虑缩放
    maximumScale: 20000, // 模型的最大比例尺大小。 minimumPixelSize的上限
    incrementallyLoadTextures: true, // 确定在加载模型后纹理是否可以继续流入
    runAnimations: true, // 是否应启动模型中指定的glTF动画
    clampAnimations: true, // glTF动画是否应在没有关键帧的持续时间内保持最后一个姿势
    shadows: Cesium.ShadowMode.DISABLED,
    heightReference: Cesium.HeightReference.NONE,
    silhouetteColor: Cesium.Color.RED, // 轮廓的颜色
    silhouetteSize: 0.0, // 轮廓的宽度

    // ! 模型着色
    color: Cesium.Color.WHITE, // 模型的颜色：e.g. Cesium.Color.fromCssColorString('#FF6C37').withAlpha(1)
    // 目标颜色和图元的源颜色之间混合的不同模式
    // HIGHLIGHT 将源颜色乘以目标颜色;REPLACE 将源颜色替换为目标颜色;MIX 将源颜色和目标颜色混合在一起
    colorBlendMode: Cesium.ColorBlendMode.HIGHLIGHT,
    // 用于指定 colorBlendMode 为 MIX 时的颜色强度。值0.0会产生模型的着色，而值1.0会导致纯色，介于两者之间的任何值都会导致两者混合
    colorBlendAmount: 0.5, // 混入 程度 

    imageBasedLightingFactor: new Cesium.Cartesian2(1.0, 1.0), // 指定基于漫反射和镜面反射的图像照明的贡献
    lightColor: undefined, // 为模型着色时指定浅色的属性。如果 undefined ，则使用场景的浅色。
    // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
    //   1.0e3,
    //   2.0e3
    // ),

    // nodeTransformations: undefined,
    // articulations: undefined,
    // customShader: undefined,

    // ! 裁剪平面的效果
    clippingPlanes: new Cesium.ClippingPlaneCollection({
      planes: [
        new Cesium.ClippingPlane(new Cesium.Cartesian3(0, 0, 1), 0) // 法向量平行于z轴，使得裁剪面垂直于z轴
      ],
      edgeWidth: 1,
      edgeColor: Cesium.Color.RED,
      enabled: true,
      edgeMaterial: new Cesium.PolylineOutlineMaterialProperty({
        color: Cesium.Color.RED,
        outlineWidth: 1,
        outlineColor: Cesium.Color.BLACK
      })
    }),
  }

  const entity = viewer.entities.add({
    name: "glTF模型",
    position,
    orientation, // 默认情况下，模型是直立的并面向东
    model: options // 也即一个ModelGraphics类
  });
  viewer.zoomTo(entity);
  // viewer.trackedEntity = entity // 聚焦到对应实体

  return entity
}

export {
  add
}