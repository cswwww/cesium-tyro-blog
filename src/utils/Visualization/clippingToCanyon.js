/*
 * @Date: 2023-07-25 14:24:15
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-25 15:13:11
 * @FilePath: \cesium-tyro-blog\src\utils\Visualization\clippingToCanyon.js
 * @Description: https://sandcastle.cesium.com/?src=Terrain%20Clipping%20Planes.html
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

export function loadGrandCanyon() {
  // Pick a position at the Grand Canyon
  const position = Cesium.Cartographic.toCartesian(
    new Cesium.Cartographic.fromDegrees(-113.2665534, 36.0939345, 100)
  );
  const distance = 3000.0;
  const boundingSphere = new Cesium.BoundingSphere(position, distance);

  viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
    modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),
    planes: [
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(1.0, 0.0, 0.0),
        distance
      ),
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(-1.0, 0.0, 0.0),
        distance
      ),
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(0.0, 1.0, 0.0),
        distance
      ),
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(0.0, -1.0, 0.0),
        distance
      ),
    ],
    unionClippingRegions: true,
    edgeWidth: 1.0, // 0.0,
    edgeColor: Cesium.Color.WHITE,
    enabled: true,
  });
  viewer.scene.globe.backFaceCulling = false;
  viewer.scene.globe.showSkirts = false;

  viewer.camera.viewBoundingSphere(
    boundingSphere,
    new Cesium.HeadingPitchRange(0.5, -0.5, boundingSphere.radius * 5.0)
  );
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
}