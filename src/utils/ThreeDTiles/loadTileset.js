/*
 * @Date: 2023-05-23 10:45:33
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-14 19:35:48
 * @FilePath: \cesium-tyro-blog\src\utils\ThreeDTiles\loadTileset.js
 * @Description:  从给定 URL 加载 3D 模型，添加到场景中，并自动定位到模型所在位置
 * import { addThreeDTiles } from '@/utils/ThreeDTiles/loadTileset.js'
 * e.g.: addThreeDTiles('/model/Tileset/示例建筑/tileset.json')
 * const modelPromise = addThreeDTiles(Cesium.IonResource.fromAssetId(75343))
 * modelPromise.then(model => {
 *   console.log('tileset: ', model)
 * })
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

/**
 * @function addThreeDTiles
 * @param {String} url - 模型切瓦后的瓦片索引文件URL或者Cesium Resource
 * @param {Object} [option] - 选项对象（可选） https://cesium.com/learn/cesiumjs/ref-doc/Cesium3DTileset.html#.ConstructorOptions
 */
const tilesetOption = {
  skipLevelOfDetail: true,
  baseScreenSpaceError: 1024,
  skipScreenSpaceErrorFactor: 16,
  skipLevels: 1,
  immediatelyLoadDesiredLevelOfDetail: false,
  loadSiblings: false,
  cullWithChildrenBounds: true
}
export async function addThreeDTiles(url, option) {
  // 开启地形深度检测:
  // 控制在渲染场景时，相机是否进行深度测试以避免将被遮挡的物体绘制在前景
  // true: 相机会根据地形高度信息进行深度测试，避免将低于地面的物体绘制在地面之上
  viewer.scene.globe.depthTestAgainstTerrain = true

  /*
  // ! 写法一：将在 1.107 版本后不支持，options.url和Cesium3DTileset.readyPromise将被移除
  return new Promise(resolve => { // 返回 Promise 对象
    const tileset = new Cesium.Cesium3DTileset({
      url // 模型切瓦后的瓦片索引文件地址或者Cesium Resource
    })
    tileset.readyPromise.then(() => {
      viewer.scene.primitives.add(tileset)
    })
    resolve(tileset) // 返回模型对象
  })
  */

  // ! 写法二：
  if (typeof url !== 'string') { // 如果传入的url不是一个json索引文件地址，而是Cesium.IonResource，则需要处理：
    url = await url;
  }
  const tileset = await Cesium.Cesium3DTileset.fromUrl(url, option);
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
  return tileset // 返回模型对象
}
