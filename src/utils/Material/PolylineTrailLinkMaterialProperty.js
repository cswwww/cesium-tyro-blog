/*
 * @Date: 2023-07-19 11:15:22
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-27 11:05:05
 * @FilePath: \cesium-tyro-blog\src\utils\Material\PolylineTrailLinkMaterialProperty.js
 * @Description: 流动纹理线材质
 */
import * as Cesium from 'cesium'

export default class PolylineTrailLinkMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._image = '/src/assets/images/spriteline.png';
    this._colorSubscription = undefined;
    this.color = options.color;
    this.duration = options.duration;
    this._time = (new Date()).getTime();
  };

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.PolylineTrailLinkMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
    // result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = this._image;
    return result
  }

  equals(other) {
    return (this === other ||
      (other instanceof PolylineTrailLinkMaterialProperty &&
        Property.equals(this._color, other._color))
    )
  }
}


Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
})

// Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
Cesium.Material.PolylineTrailLinkMaterialProperty = 'PolylineTrailLinkMaterialProperty';
Cesium.Material.PolylineTrailLinkMaterialType = 'PolylineTrailLinkMaterialType';
Cesium.Material.PolylineTrailLinkMaterialSource =
  `czm_material czm_getMaterial(czm_materialInput materialInput)
  {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
  material.alpha = colorImage.a * color.a;
  material.diffuse = (colorImage.rgb+color.rgb)/2.0;
  return material;
  }
`


Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkMaterialType, {
  fabric: {
    type: Cesium.Material.PolylineTrailLinkMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
      time: 0,
      image: '/src/assets/images/spriteline.png'
    },
    source: Cesium.Material.PolylineTrailLinkMaterialSource
  },
  translucent: function (material) {
    return true;
  }
})
console.log('成功加载流动纹理线材质');


// ? 如何使用
// import PolylineTrailLinkMaterialProperty from '@/utils/Material/PolylineTrailLinkMaterialProperty.js'

// material: new PolylineTrailLinkMaterialProperty({
//   color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
//   duration: 3000,
// })