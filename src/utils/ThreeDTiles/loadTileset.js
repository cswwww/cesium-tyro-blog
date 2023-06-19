/*
 * @Date: 2023-05-23 10:45:33
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-19 17:52:21
 * @FilePath: \cesium-tyro-blog\src\utils\ThreeDTiles\loadTileset.js
 * @Description:  从给定 URL 加载 3D 模型，添加到场景中，并自动定位到模型所在位置
 * import { addThreeDTiles } from '@/utils/ThreeDTiles/loadTileset.js'
 * const modelPromise = addThreeDTiles('/model/Tileset/示例建筑/tileset.json')
 * const modelPromise = addThreeDTiles(69380) // 75343、8564、40866
 * modelPromise.then(tileset => {
 *   console.log('tileset: ', tileset)
 * })
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import { ElLoading } from 'element-plus'

/**
 * @function addThreeDTiles
 * @param {String} url - 模型切瓦后的瓦片索引文件URL或者Cesium Resource
 * @param {Object} [option] - 选项对象（可选） https://cesium.com/learn/cesiumjs/ref-doc/Cesium3DTileset.html#.ConstructorOptions
 */
const tilesetOption = {
  maximumMemoryUsage: 100, // 不可设置太高，目标机子空闲内存值以内，防止浏览器过于卡
  maximumScreenSpaceError: 32, // 用于驱动细节细化级别的最大屏幕空间错误;较高的值可提供更好的性能，但视觉质量较低。
  shadows: false, // 是否显示阴影
  skipLevelOfDetail: true, // 确定是否应在遍历期间应用详细级别跳过(默认false)
  baseScreenSpaceError: 1024, // When skipLevelOfDetailis true，在跳过详细级别之前必须达到的屏幕空间错误(默认1024)
  skipScreenSpaceErrorFactor: 16, // 定义要跳过的最小屏幕空间错误的乘数。与 一起使用skipLevels来确定要加载哪些图块(默认16)
  skipLevels: 1, // skipLevelOfDetail是true 一个常量，定义了加载图块时要跳过的最小级别数。为 0 时，不跳过任何级别。与 一起使用skipScreenSpaceErrorFactor来确定要加载哪些图块。(默认1)
  immediatelyLoadDesiredLevelOfDetail: false, // 当skipLevelOfDetail是时true，只会下载满足最大屏幕空间错误的图块。忽略跳过因素，只加载所需的图块(默认false)
  loadSiblings: false, // 如果为true则不会在已加载完概况房屋后，自动从中心开始超清化房屋 --- 何时确定在遍历期间skipLevelOfDetail是否true始终下载可见瓦片的兄弟姐妹(默认false)
  cullWithChildrenBounds: true, // 是否使用子边界体积的并集来剔除瓦片（默认true）
  dynamicScreenSpaceError: true, // 减少距离相机较远的图块的屏幕空间错误(默认false)
  dynamicScreenSpaceErrorDensity: 0.00278, // 数值加大，能让周边加载变快 --- 用于调整动态屏幕空间误差的密度，类似于雾密度(默认0.00278)
  dynamicScreenSpaceErrorFactor: 4.0, // 用于增加计算的动态屏幕空间误差的因素(默认4.0)
  dynamicScreenSpaceErrorHeightFalloff: 0.25// 密度开始下降的瓦片集高度的比率(默认0.25)
}
export async function addThreeDTiles(url, option) {
  // 开启加载动画
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(255, 255, 255, 0.5)',
  })
  // 开启地形深度检测:
  // 控制在渲染场景时，相机是否进行深度测试以避免将被遮挡的物体绘制在前景
  // true: 相机会根据地形高度信息进行深度测试，避免将低于地面的物体绘制在地面之上
  viewer.scene.globe.depthTestAgainstTerrain = true

  /*
  // ! 写法一：将在 1.107 版本后不支持，options.url和Cesium3DTileset.readyPromise将被移除
  return new Promise(resolve => { // 返回 Promise 对象
    const tileset = new Cesium.Cesium3DTileset({
      url // 模型切瓦后的瓦片索引文件地址或者Cesium Resource: Cesium.IonResource.fromAssetId(75343)
    })
    tileset.readyPromise.then(() => {
      viewer.scene.primitives.add(tileset)
    })
    resolve(tileset) // 返回模型对象
  })
  */

  // ! 写法二：
  let tileset = {}
  if (typeof url == 'number') {
    tileset = await Cesium.Cesium3DTileset.fromIonAssetId(url, option);
  } else {
    tileset = await Cesium.Cesium3DTileset.fromUrl(url, option);
  }

  viewer.scene.primitives.add(tileset);
  // 定位到模型
  viewer.zoomTo(
    tileset,
    new Cesium.HeadingPitchRange(
      0.0,
      -0.5,
      tileset.boundingSphere.radius * 2.0 // 模型的包围球半径的2倍
    )
  )
  loading.close()
  return tileset // 返回模型对象
}
