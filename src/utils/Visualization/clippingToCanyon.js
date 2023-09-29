/*
 * @Date: 2023-07-25 14:24:15
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-09-28 19:56:44
 * @FilePath: \cesium-tyro-blog\src\utils\Visualization\clippingToCanyon.js
 * @Description: https://sandcastle.cesium.com/?src=Terrain%20Clipping%20Planes.html
 * https://blog.csdn.net/qq_36213352/article/details/122844540
 * 裁剪获得一个区域
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

export function loadGrandCanyon() {
  const position = Cesium.Cartographic.toCartesian(
    new Cesium.Cartographic.fromDegrees(-113.2665534, 36.0939345, 100)
  )
  const distance = 3000.0

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
      )
    ],
    unionClippingRegions: true,
    edgeWidth: 1.0, // 0.0,
    edgeColor: Cesium.Color.WHITE,
    enabled: true
  })
  viewer.scene.globe.backFaceCulling = false
  viewer.scene.globe.showSkirts = false

  const boundingSphere = new Cesium.BoundingSphere(position, distance)
  viewer.camera.viewBoundingSphere(
    boundingSphere,
    new Cesium.HeadingPitchRange(0.5, -0.5, boundingSphere.radius * 5.0)
  )
  viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
}

// type false:保留多边形外 true:保留多边形内
// [
//   {
//     "x": 831378.7404354169,
//     "y": -4856690.379372356,
//     "z": 4036359.538261747
//   },
//   {
//     "x": 3334347.320785613,
//     "y": -4763032.687230717,
//     "z": 2613474.0729391705
//   },
//   {
//     "x": 133401.66014090632,
//     "y": -6152120.724266897,
//     "z": 1671946.9335355863
//   }
// ]
export function areaClipping(points, type = true) {
  const pointsCoor = points.map(({ x, y, z }) => new Cesium.Cartesian3(x, y, z))

  let sum = 0
  for (let i = 0; i < pointsCoor.length; i++) {
    const pointA = pointsCoor[i]
    const pointB = pointsCoor[(i + 1) % pointsCoor.length]

    const crossProduct = Cesium.Cartesian3.cross(pointA, pointB, new Cesium.Cartesian3())

    sum += crossProduct.z
  }

  if (sum > 0 && type) {
    console.log('逆时针')
    points.reverse()
  } else if (sum < 0 && !type) {
    console.log('顺时针')
    points.reverse()
  }

  const clippingPlanes = [] // 存储ClippingPlane集合

  for (let i = 0; i < points.length; ++i) {
    const nextIndex = (i + 1) % points.length

    // Computes the componentwise sum of two Cartesians. 计算两个坐标点的分量和
    const midpoint = Cesium.Cartesian3.add(points[i], points[nextIndex], new Cesium.Cartesian3())
    Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint)

    const up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3()) // 计算单位向量

    const right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3()) // 建立空间向量
    Cesium.Cartesian3.normalize(right, right) // 计算单位向量

    const normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
    Cesium.Cartesian3.normalize(normal, normal) // 计算单位向量

    const originCenteredPlane = new Cesium.Plane(normal, 0.0)
    const distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint)

    clippingPlanes.push(new Cesium.ClippingPlane(normal, distance))
  }

  viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
    planes: clippingPlanes,
    enabled: true, // Determines whether the clipping planes are active.
    modelMatrix: Cesium.Matrix4.IDENTITY,
    unionClippingRegions: type, // 内 || 外
    edgeColor: Cesium.Color.YELLOW,
    edgeWidth: 1.0
  })

  viewer.scene.globe.backFaceCulling = false
  viewer.scene.globe.showSkirts = false

  // viewer.scene.globe.clippingPlanes = null // 销毁
}
