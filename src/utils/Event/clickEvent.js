import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

const screenSpaceEventTypeMap = {
  左键单击: 'LEFT_CLICK',
  左键双击: 'LEFT_DOUBLE_CLICK',
  左键按下: 'LEFT_DOWN',
  左键松开: 'LEFT_UP',
  右键单击: 'RIGHT_CLICK',
  右键双击: 'RIGHT_DOUBLE_CLICK',
  右键按下: 'RIGHT_DOWN',
  右键松开: 'RIGHT_UP',
  中键单击: 'MIDDLE_CLICK',
  中键按下: 'MIDDLE_DOWN',
  中键松开: 'MIDDLE_UP',
  鼠标移动: 'MOUSE_MOVE',
  触摸缩放: 'PINCH_MOVE',
  触摸缩放结束: 'PINCH_END',
  触摸缩放开始: 'PINCH_START'
}

/**
 * Returns the default click event handler based on the specified click type.
 *
 * @param {string} click - The type of click event to handle (defaults to 'LEFT_CLICK').
 * @return {function} - The click event handler function.
 */
function getDefaultClickEvent(click = 'LEFT_CLICK') {
  const clickHandler = viewer.screenSpaceEventHandler.getInputAction(
    Cesium.ScreenSpaceEventType[click]
  )
  return clickHandler
}

/**
 * A function that enables picking an element on the screen and invokes a callback function.
 *
 * @param {function} callback - The callback function to be invoked with the selected feature.
 * @return {void} This function does not return a value.
 */
function clickToPick(callback) {
  let feature = null; // 选中的要素对象

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 交互句柄
  handler.setInputAction((event) => {

    feature = viewer.scene.pick(event.position); // 拾取要素

    if (!Cesium.defined(feature)) return

    if (feature?.id && feature.id instanceof Cesium.Entity) {
      console.log("选中了Entity");
    }
    if (feature?.primitive instanceof Cesium.Primitive) {
      console.log("选中了Primitive");
    }
    if (feature?.primitive instanceof Cesium.Model) {
      console.log("选中了模型");
    }
    if (feature instanceof Cesium.Cesium3DTileFeature) {
      console.log("选中了3DTile");
    }

    callback?.(feature); // 将选中的要素暴露给回调函数
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 获取椭球体表面的经纬度
function getEllipsoid(callback) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 交互句柄
  handler.setInputAction(function (event) {
    // 屏幕坐标转世界坐标:将屏幕坐标（event.position）转换为椭球体上的笛卡尔坐标 Cartesian3 {x: 400390.1022929887, y: -4875636.113124782, z: 4078770.7805720475}
    const cartesian = viewer.camera.pickEllipsoid(event.position, viewer.scene.globe.ellipsoid);
    // 将笛卡尔坐标转换为地理坐标 Cartographic {longitude: -1.4888595972327463, latitude: 0.6982928317144053, height: 1.3222238854040097e-9}
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    // 将弧度转为度
    const lon = Cesium.Math.toDegrees(cartographic.longitude);
    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    // 输出经纬度
    console.log('[lon,lat]:', [lon, lat]);
    callback?.([lon, lat]); // 将选中的要素暴露给回调函数
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

// 获取地形表面经纬度和高度
function getTerrain(callback) {
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 交互句柄
  handler.setInputAction(function (event) {
    const ray = viewer.camera.getPickRay(event.position);
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);
    if (Cesium.defined(cartesian)) {
      // 将笛卡尔坐标转换为地理坐标 Cartographic {longitude: -1.4888595972327463, latitude: 0.6982928317144053, height: 1.3222238854040097e-9}
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);
      const height1 = viewer.scene.globe.getHeight(cartographic); // 使用 Cesium 的地球场景对象 globe 的 getHeight 方法来获取地形表面上某一点的高度。这个方法会考虑到地形的高程数据，比如地形瓦片、地形数据源等，来计算准确的高度
      const height = cartographic.height;
      callback?.(lon, lat, height);
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

// 实时获取鼠标经纬度
function getMouse() {
  let selft = this;
  const scene = this.viewer.scene;
  var canvas = scene.canvas;
  var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function (movement) {
    var cartesian = scene.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    var ellipsoid = scene.globe.ellipsoid;
    if (cartesian) { //能获取，显示坐标
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      var coords = '经度' + Cesium.Math.toDegrees(cartographic.longitude).toFixed(2) + ', ' + '纬度' + Cesium.Math.toDegrees(
        cartographic.latitude).toFixed(2) + '高度 ' + Math.ceil(selft.viewer.camera.positionCartographic.height);
      console.log(coords);

    } else { //不能获取不显示

    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}

export {
  getDefaultClickEvent,
  clickToPick,
  getEllipsoid,
  getTerrain,
  getMouse
}
