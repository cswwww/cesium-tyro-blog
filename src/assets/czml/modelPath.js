export const modelPath = [// pocket
  // 必须的节点，document
  {
    id: 'document',
    name: 'CZML Path',
    version: '1.0',
    clock: {
      interval: '2012-08-04T10:00:00Z/2012-08-04T15:00:00Z',
      currentTime: '2012-08-04T10:00:00Z',
      multiplier: 100
    }
  },
  {
    id: 'path',
    name: 'path with GPS flight data',
    description:
      '<p>Hang gliding flight log data from Daniel H. Friedman.<br>Icon created by Larisa Skosyrska from the Noun Project</p>',
    availability: '2012-08-04T10:00:00Z/2012-08-04T15:00:00Z',
    path: {
      material: {
        polylineOutline: {
          color: {
            rgba: [255, 0, 255, 255]
          },
          outlineColor: {
            rgba: [0, 255, 255, 255]
          },
          outlineWidth: 5
        }
      },
      width: 8,
      leadTime: 5, // 头部时间显示：提前显示5秒?后的路径
      trailTime: 50000, // 尾部时间显示：保留50000秒?后的路径
      resolution: 5
    },
    orientation: { // 设置模型的方向，可以根据DebugModelMatrixPrimitive来辅助调整姿态，可见文件末注释代码
      'unitQuaternion': [
        0.19134171618254486,
        -0.3314135740355918,
        0.4619397662556433,
        0.8001031451912656
      ]
    },
    model: {
      gltf: '../model/glb/Cesium_Air.glb'
    },
    position: {
      epoch: '2012-08-04T10:00:00Z',
      cartographicDegrees: [
        0,
        -122,
        39.50935,
        8776,
        3000,
        -122,
        39.60918,
        8773,
        4000,
        -122,
        39.70883,
        8772
      ]
    }
  }
]

// viewer.trackedEntity.orientation = Cesium.Quaternion.fromHeadingPitchRoll(new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(-60), Cesium.Math.toRadians(45), Cesium.Math.toRadians(0)));
// console.log(viewer.trackedEntity.orientation)

// let matrix = viewer.trackedEntity.computeModelMatrix(Cesium.JulianDate.fromIso8601('2012-08-04T10:00:00Z'))
// viewer.scene.primitives.add(
//     new Cesium.DebugModelMatrixPrimitive({
//         modelMatrix: matrix,  // primitive to debug
//         length: 100000.0,
//         width: 10.0
//     })
// );
