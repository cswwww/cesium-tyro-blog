/*
 * @Date: 2023-07-19 11:15:22
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-24 11:55:35
 * @FilePath: \cesium-tyro-blog\src\utils\Material\WallFlowMaterialProperty.js
 * @Description: 流动墙材质
 */
import * as Cesium from 'cesium'

export default class WallFlowMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._speed = undefined;
    this.color = options.color;
    this.speed = options.speed;
    this.image = options.image
  };

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.WallFlowMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
    result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 5.0, result.speed);
    result.image = this.image
    return result
  }

  equals(other) {
    return (this === other ||
      (other instanceof WallFlowMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    )
  }
}


Object.defineProperties(WallFlowMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
})

// Cesium.WallFlowMaterialProperty = WallFlowMaterialProperty;
Cesium.Material.WallFlowMaterialProperty = 'WallFlowMaterialProperty';
Cesium.Material.WallFlowMaterialType = 'WallFlowMaterialType';
Cesium.Material.WallFlowMaterialSource =
  `czm_material czm_getMaterial(czm_materialInput materialInput)
  {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec4 colorImage = texture(image, vec2(fract((st.t - speed*czm_frameNumber*0.005)), st.t));
    vec4 fragColor;
    fragColor.rgb = color.rgb / 1.0;
    fragColor = czm_gammaCorrect(fragColor);
    material.alpha = colorImage.a * color.a;
    material.diffuse = (colorImage.rgb+color.rgb)/2.0;
    material.emission = fragColor.rgb;
    return material;
  }
`


Cesium.Material._materialCache.addMaterial(Cesium.Material.WallFlowMaterialType, {
  fabric: {
    type: Cesium.Material.WallFlowMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      speed: 10.0,
      image: ''
    },
    source: Cesium.Material.WallFlowMaterialSource
  },
  translucent: function (material) {
    return true;
  }
})
console.log('成功加载流动墙材质');


// ? 如何使用
// import WallFlowMaterialProperty from '@/utils/Material/WallFlowMaterialProperty.js'

// material: new WallFlowMaterialProperty({
//   color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
//   speed: 10.0,
//   image: '/src/assets/images/spriteline.png',
// })