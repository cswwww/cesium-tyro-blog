/*
 * @Date: 2023-07-19 11:15:22
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-21 15:21:13
 * @FilePath: \cesium-tyro-blog\src\utils\Material\LineFlowMaterialProperty.js
 * @Description: 流动线材质
 */
import * as Cesium from 'cesium'

export default class LineFlowMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._speed = undefined;
    this._percent = undefined;
    this._gradient = undefined;
    this.color = options.color;
    this.speed = options.speed;
    this.percent = options.percent;
    this.gradient = options.gradient;
  };

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.LineFlowMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
    result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
    result.percent = Cesium.Property.getValueOrDefault(this._percent, time, 0.1, result.percent);
    result.gradient = Cesium.Property.getValueOrDefault(this._gradient, time, 0.01, result.gradient);
    return result
  }

  equals(other) {
    return (this === other ||
      (other instanceof LineFlowMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._percent, other._percent) &&
        Cesium.Property.equals(this._gradient, other._gradient))
    )
  }
}


Object.defineProperties(LineFlowMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  percent: Cesium.createPropertyDescriptor('percent'),
  gradient: Cesium.createPropertyDescriptor('gradient'),
})

// Cesium.LineFlowMaterialProperty = LineFlowMaterialProperty;
Cesium.Material.LineFlowMaterialProperty = 'LineFlowMaterialProperty';
Cesium.Material.LineFlowMaterialType = 'LineFlowMaterialType';
Cesium.Material.LineFlowMaterialSource =
  `
  uniform vec4 color;
  uniform float speed;
  uniform float percent;
  uniform float gradient;
  
  czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    float t =fract(czm_frameNumber * speed / 1000.0);
    t *= (1.0 + percent);
    float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
    alpha += gradient;
    material.diffuse = color.rgb;
    material.alpha = alpha;
    return material;
  }
  `

Cesium.Material._materialCache.addMaterial(Cesium.Material.LineFlowMaterialType, {
  fabric: {
    type: Cesium.Material.LineFlowMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 10.0,
      percent: 0.1,
      gradient: 0.01
    },
    source: Cesium.Material.LineFlowMaterialSource
  },
  translucent: function (material) {
    return true;
  }
})
console.log('成功加载流动线材质');


// ? 如何使用
// import LineFlowMaterialProperty from '@/utils/Material/LineFlowMaterialProperty.js'

// material: new LineFlowMaterialProperty({
//   color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
//   speed: 15 * Math.random(),
//   percent: 0.1,
//   gradient: 0.01
// })