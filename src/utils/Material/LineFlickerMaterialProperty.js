/*
 * @Date: 2023-07-24 15:30:19
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-24 15:43:03
 * @FilePath: \cesium-tyro-blog\src\utils\Material\lineFlickerMaterialProperty.js
 * @Description: 闪烁线
 * 参考：https://blog.csdn.net/weixin_45782925/article/details/123571988
 */
import * as Cesium from 'cesium'

export default class LineFlickerMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._speed = undefined;
    this.color = options.color;
    this.speed = options.speed;
  };

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.LineFlickerMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
    result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
    return result
  }

  equals(other) {
    return (this === other ||
      (other instanceof LineFlickerMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    )
  }
}

Object.defineProperties(LineFlickerMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
})

// Cesium.LineFlickerMaterialProperty = LineFlickerMaterialProperty;
Cesium.Material.LineFlickerMaterialProperty = 'LineFlickerMaterialProperty';
Cesium.Material.LineFlickerMaterialType = 'LineFlickerMaterialType';
Cesium.Material.LineFlickerMaterialSource =
  `
uniform vec4 color;
uniform float speed;
czm_material czm_getMaterial(czm_materialInput materialInput){
czm_material material = czm_getDefaultMaterial(materialInput);
float time = fract( czm_frameNumber  *  speed / 1000.0);
vec2 st = materialInput.st;
float scalar = smoothstep(0.0,1.0,time);
material.diffuse = color.rgb * scalar;
material.alpha = color.a * scalar ;
return material;
}
`

Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlickerMaterialType, {
  fabric: {
    type: Cesium.Material.LineFlickerMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 5.0,
    },
    source: Cesium.Material.LineFlickerMaterialSource
  },
  translucent: function (material) {
    return true;
  }
})

console.log('成功加载闪烁线材质');

// ? 如何使用
// import LineFlickerMaterialProperty from '@/utils/Material/LineFlickerMaterialProperty.js'
//
// material: new LineFlickerMaterialProperty({
//   color: Cesium.Color.YELLOW,
//   speed: 20 * Math.random(), // 设置随机变化速度
// }),
