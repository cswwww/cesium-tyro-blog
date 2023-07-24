/*
 * @Date: 2023-07-20 19:08:08
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-24 15:33:27
 * @FilePath: \cesium-tyro-blog\src\utils\Material\SpritelineMaterialProperty.js
 * @Description: 穿梭线材质
 * 参考：https://blog.csdn.net/weixin_45782925/article/details/122559827
 */
import * as Cesium from 'cesium'

export default class SpritelineMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    // this._duration = undefined
    // this._image = undefined
    this._time = performance.now()
    this.duration = options.duration
    this.image = options.image
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType() {
    return Cesium.Material.SpritelineMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {}
    }
    result.image = this.image
    result.time = ((performance.now() - this._time) % this.duration) / this.duration

    return result
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof SpritelineMaterialProperty &&
        Cesium.Property.equals(this.duration, other.duration)
      )
    )
  }
}

Object.defineProperties(SpritelineMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed')
})

// Cesium.SpritelineMaterialProperty = SpritelineMaterialProperty;
Cesium.Material.SpritelineMaterialProperty = 'SpritelineMaterialProperty';
Cesium.Material.SpritelineMaterialType = 'SpritelineMaterialType'; // 材质类型id，对应的Cesium是一种材质类
Cesium.Material.SpritelineMaterialSource =
  `
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
  czm_material material = czm_getDefaultMaterial(materialInput);
  vec2 st = materialInput.st;
  vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
  material.alpha = colorImage.a;
  material.diffuse = colorImage.rgb * 1.5 ;
  return material;
  }
`
// st :二维纹理坐标
// czm_material：保存可用于照明的材质信息

// 保存材质
Cesium.Material._materialCache.addMaterial(Cesium.Material.SpritelineMaterialType, {
  fabric: { // 材质的构造
    type: Cesium.Material.SpritelineMaterialType,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: '',
      transparent: true,
      time: 20,
    },
    source: Cesium.Material.SpritelineMaterialSource
  },
  translucent: function () {
    return true;
  }
})
console.log('成功加载穿梭线材质');

// ? 如何使用
// import SpritelineMaterialProperty from '@/utils/Material/SpritelineMaterialProperty.js'
//
// material: new SpritelineMaterialProperty({
//   duration: 1000,
//   image: '/src/assets/images/spriteline.png',
// }),
