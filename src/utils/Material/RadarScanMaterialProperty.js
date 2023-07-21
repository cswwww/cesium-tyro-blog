/*
 * @Date: 2023-07-19 17:46:24
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-21 15:21:27
 * @FilePath: \cesium-tyro-blog\src\utils\Material\RadarScanMaterialProperty.js
 * @Description: 扫描材质
 */
import * as Cesium from 'cesium'

export default class RadarScanMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._speed = undefined;
    this.color = options.color; // 扫码源颜色
    this.speed = options.speed; // 扫码旋转速度
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType() {
    return Cesium.Material.RadarScanMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
    result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
    return result
  }

  equals(other) {
    return (this === other ||
      (other instanceof RadarScanMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    )
  }
}

Object.defineProperties(RadarScanMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed')
})

// Cesium.RadarScanMaterialProperty = RadarScanMaterialProperty;
Cesium.Material.RadarScanMaterialProperty = 'RadarScanMaterialProperty';
Cesium.Material.RadarScanMaterialType = 'RadarScanMaterialType'; // 材质类型id，对应的Cesium是一种材质类
Cesium.Material.RadarScanMaterialSource =
  `
  uniform vec4 color;
  uniform float speed;

  #define PI 3.14159265359

  czm_material czm_getMaterial(czm_materialInput materialInput){
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  vec2 scrPt = st * 2.0 - 1.0;
  float time = czm_frameNumber * speed / 1000.0 ;
  vec3 col = vec3(0.0);
  mat2 rot;
  float theta = -time * 1.0 * PI - 2.2;
  float cosTheta, sinTheta;
  cosTheta = cos(theta);
  sinTheta = sin(theta);
  rot[0][0] = cosTheta;
  rot[0][1] = -sinTheta;
  rot[1][0] = sinTheta;
  rot[1][1] = cosTheta;
  vec2 scrPtRot = rot * scrPt;
  float angle = 1.0 - (atan(scrPtRot.y, scrPtRot.x) / 6.2831 + 0.5);
  float falloff = length(scrPtRot);
  material.alpha = pow(length(col + vec3(.5)),5.0);
  material.diffuse =  (0.5 +  pow(angle, 2.0) * falloff ) *   color.rgb    ;
  return material;
  }
  `

// 保存材质
Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarScanMaterialType, {
  fabric: { // 材质的构造
    type: Cesium.Material.RadarScanMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 10.0
    },
    source: Cesium.Material.RadarScanMaterialSource
  },
  translucent: function () {
    return true;
  }
})
console.log('成功加载雷达扫描材质');

// ? 如何使用
// import RadarScanMaterialProperty from '@/utils/Material/RadarScanMaterialProperty.js'
//
// material: new RadarScanMaterialProperty({
//   color: new Cesium.Color(1.0, 1.0, 0.0, 0.2),
//   speed: 20.0,
// }),