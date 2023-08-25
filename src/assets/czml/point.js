// https://www.bilibili.com/video/BV1Qg4y137Zp/?spm_id_from=333.788&vd_source=814c2ce816d31f8a2d3129e05764f50c

export const dynamicPoint = [// pocket
  // 必须的节点，document
  {
    id: 'document',
    name: 'CZML Point - Time Dynamic',
    version: '1.0',
    clock: {
      interval: '2012-08-04T16:00:00Z/2012-08-04T16:00:59Z',
      currentTime: '2012-08-04T16:00:00'
      // multiplier: 10,
    }
  },
  {
    id: 'point',
    // availability: "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",
    position: {
      // epoch: "2012-08-04T16:00:00Z",
      cartographicDegrees: [
        '2012-08-04T16:00:00Z',
        -70,
        20,
        150000,
        '2012-08-04T16:00:10Z',
        -80,
        44,
        150000,
        '2012-08-04T16:00:40Z',
        -90,
        18,
        150000,
        '2012-08-04T16:00:59Z',
        -98,
        52,
        150000
      ]
    },
    point: {
      color: {
        rgba: [255, 255, 255, 128]
      },
      outlineColor: {
        rgba: [255, 0, 0, 128]
      },
      outlineWidth: 3,
      pixelSize: 15
    },
    properties: {
      // interval方式
      // height: [
      //     {
      //         interval: "2012-08-04T16:00:00Z/2012-08-04T16:00:10Z",
      //         number: 5
      //     },
      //     {
      //         interval: "2012-08-04T16:00:10Z/2012-08-04T16:00:59Z",
      //         number: 6
      //     },
      // ]

      // sample方式
      height: {
        number: [
          '2012-08-04T16:00:00Z', 5,
          '2012-08-04T16:00:59Z', 6
        ]
      }

      // position: {
      //     cartesian: [
      //         0, 4650397.56551457, -3390535.52275848, -4087729.48877329,
      //         300, 3169722.12564676, -2787480.80604407, -5661647.74541255,
      //         600, 1369743.14695017, -1903662.23809705, -6663952.07552171
      //     ]
      // }

      // testRGB: [
      //     {
      //         interval: "2012-08-04T16:00:00Z/2012-08-04T16:00:10Z",
      //         rgba: [255, 255, 255, 255]
      //     },
      //     {
      //         interval: "2012-08-04T16:00:10Z/2012-08-04T16:00:59Z",
      //         rgba: [255, 255, 255, 254]
      //     },
      // ]
    }
  }
]
