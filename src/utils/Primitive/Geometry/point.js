import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// Create a pointPrimitive collection with two points
const points = scene.primitives.add(
  new Cesium.PointPrimitiveCollection({
    modelMatrix: Cesium.Matrix4.IDENTITY,
    debugShowBoundingVolume: false,
    // OPAQUE 完全不透明；TRANSLUCENT 完全透明；OPAQUE_AND_TRANSLUCENT 不透明和半透明
    blendOption: Cesium.BlendOption.OPAQUE_AND_TRANSLUCENT,
  })
);
// add PointPrimitive
points.add({
  position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.53883, 1000.0),
  color: Cesium.Color.YELLOW,
});
points.add({
  position: Cesium.Cartesian3.fromDegrees(-74.59777, 40.53883, 1000.0),
  color: Cesium.Color.CYAN,
});