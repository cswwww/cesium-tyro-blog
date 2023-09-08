// https://cesium.com/learn/cesiumjs/ref-doc/ViewportQuad.html?classFilter=ViewportQuad

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// 使用ViewportQuad创建一个显示图片的区域
var viewportQuad = new Cesium.ViewportQuad()
viewportQuad.rectangle = new Cesium.BoundingRectangle(5, 5, 80, 92)
viewer.scene.primitives.add(viewportQuad)

viewportQuad.material = new Cesium.Material({
  fabric: {
    type: 'Image',
    uniforms: {
      color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
      image: Cesium.buildModuleUrl('Assets/Images/bing_maps_credit.png')
    }
  }
})
