/*
 * @Date: 2023-07-05 17:37:20
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-05 17:39:14
 * @FilePath: \cesium-tyro-blog\src\utils\Event\cameraEvent.js
 * @Description: 相机事件
 */
// TODO 未完成

viewer.scene.screenSpaceCameraController.tiltEventTypes = [
  Cesium.CameraEventType.RIGHT_DRAG,
  Cesium.CameraEventType.PINCH,
  {
    eventType: Cesium.CameraEventType.LEFT_DRAG,
    modifier: Cesium.KeyboardEventModifier.CTRL,
  },
  {
    eventType: Cesium.CameraEventType.RIGHT_DRAG,
    modifier: Cesium.KeyboardEventModifier.CTRL,
  },
];

viewer.scene.screenSpaceCameraController.zoomEventTypes = [
  Cesium.CameraEventType.MIDDLE_DRAG,
  Cesium.CameraEventType.WHEEL,
  Cesium.CameraEventType.PINCH,
];