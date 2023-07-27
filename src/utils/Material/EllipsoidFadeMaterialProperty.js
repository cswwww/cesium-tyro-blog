/*
 * @Date: 2023-07-21 15:15:32
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-27 11:13:17
 * @FilePath: \cesium-tyro-blog\src\utils\Material\EllipsoidFadeMaterialProperty.js
 * @Description: 扩散圆材质
 */
import * as Cesium from 'cesium'

export default class EllipsoidFadeMaterialProperty {
  constructor(options) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this._time = (new Date()).getTime();
    this.color = options.color;
    this.duration = options.duration;
  };

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.EllipsoidFadeMaterialType;
  }

  getValue(time, result) {
    if (!Cesium.defined(result)) {
      result = {};
    }

    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
  }

  equals(other) {
    return (this === other ||
      (other instanceof EllipsoidFadeMaterialProperty &&
        Property.equals(this._color, other._color))
    )
  }
}

Object.defineProperties(EllipsoidFadeMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
})

// Cesium.EllipsoidFadeMaterialProperty = EllipsoidFadeMaterialProperty;
Cesium.Material.EllipsoidFadeMaterialProperty = 'EllipsoidFadeMaterialProperty';
Cesium.Material.EllipsoidFadeMaterialType = 'EllipsoidFadeMaterialType';
Cesium.Material.EllipsoidFadeMaterialSource =
  `
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
    czm_material material = czm_getDefaultMaterial(materialInput);
    material.diffuse = 1.5 * color.rgb;
    vec2 st = materialInput.st;
    float dis = distance(st, vec2(0.5, 0.5));
    float per = fract(time);
    if(dis > per * 0.5){
      material.alpha = 0.0;
      discard;
    }else {
      material.alpha = color.a  * dis / per / 1.0;
    }
    return material;
  }
  `
  // "czm_material czm_getMaterial(czm_materialInput materialInput)\n" +
  // "{\n" +
  // "czm_material material = czm_getDefaultMaterial(materialInput);\n" +
  // "material.diffuse = 1.5 * color.rgb;\n" +
  // "vec2 st = materialInput.st;\n" +
  // "float dis = distance(st, vec2(0.5, 0.5));\n" +
  // "float per = fract(time);\n" +
  // "if(dis > per * 0.5){\n" +
  // "material.alpha = 0.0;\n"+                     
  // "discard;\n" +
  // "}else {\n" +
  // "material.alpha = color.a  * dis / per / 1.0;\n" +
  // "}\n" +
  // "return material;\n" +
  // "}";

// material.diffuse  入射光。color这个变量，来源于之前fabric里面uniforms的值。因为我更改其他地方的color命名没有效果，更改fabric里面的才有效果。
// material.diffuse = 1.5*color.rgb; 控制的效果是这个颜色的亮度。把1.5改成0.5它会明显变得更暗。如果把1.5改成3或者6，明显可以看到颜色更亮了。而且有些地方的透明效果不太行了。
// distance在opengl中可以求两个点point的距离。materialInpu.st是整个画布的大小，dis主要是扩散中心，从哪个位置开始扩散的。如果改成distance(st,vec2(0,0.5)，那么它扩散的中心就变成了下方中点
// fract方法，在opengl中是求一个数的小数点部分。这个time应该是动态变化的，毕竟时间一直在走，可能和cesium不一样，它的时间数不是整数，而是小数。
// 接下来就是一个if判断了，然后就是设置透明度alpha为0。discard关键词在opengl中是片段截取的意思，相当于这一块不要了。else里面则是将透明度进行了一个计算。
// ! 上述内容来源：https://blog.csdn.net/GhostPaints/article/details/124382690


Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidFadeMaterialType, {
  fabric: {
    type: Cesium.Material.EllipsoidFadeMaterialType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1),
      time: 0
    },
    source: Cesium.Material.EllipsoidFadeMaterialSource
  },
  translucent: function (material) {
    return true;
  }
})
console.log('成功加载扩散圆材质');


// ? 如何使用
// import EllipsoidFadeMaterialProperty from '@/utils/Material/EllipsoidFadeMaterialProperty.js'

// material: new EllipsoidFadeMaterialProperty({
//   color: new Cesium.Color(1.0, 1.0, 0.0, 0.8),
//   duration: 3000,
// })