/*
 * @Date: 2023-06-04 10:41:29
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-04 15:26:06
 * @FilePath: \cesium-tyro-blog\src\utils\ImageryLayer\loadImagery.js
 * @Description: 加载影像图层
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// 图层相关配置
const layerOption = {
  show: true, // 图像层是否可见
  alpha: 1, // 透明度
  nightAlpha: 1, // 地球夜晚一侧的透明度
  dayAlpha: 1, // 地球白天一侧的透明度
  brightness: 1, // 亮度
  contrast: 1, // 对比度
  hue: 0, // 色调
  saturation: 1, // 饱和度
  gamma: 1, // 伽马校正
}

export const loadImagery = {
  // 加载arcgis地图服务
  arcgis: (url, option) => {
    const imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
      url,
      token: '',
      layers: '', // 要显示的子图层 ID 数组
      credit: '', // 于表示影像图层的来源及版权信息
      enablePickFeatures: true, // 是否应该返回用于选择的附加要素数据
      usePreCachedTilesIfAvailable: true, // 如果为 true，则使用服务器的预缓存切片（如果可用）。如果为 false，则忽略任何预缓存的切片并使用'导出'服务。
    })
    const layer = new Cesium.ImageryLayer(imageryProvider, option)
    // viewer.imageryLayers.add(layer, index) // 可以为图层设置index
    viewer.imageryLayers.add(layer)
    console.log(viewer.imageryLayers.indexOf(layer)); // 显示地图的加载层级
    return layer
  },
  // Cesium ION 服務
  // 3812:Black Marble 影像服务
  // 3845:World Imagery 影像服务
  ion: (option, id = 3812) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.IonImageryProvider({ assetId: id }),
      option
    )
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载osm地图
  osm: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' }),
      option
    )
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载Humanitarian OpenStreetMap Team style地图
  hot: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c'] }),
      option
    )
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载carto Basemaps 航海风格地图
  cartoVoyager: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png' }),
      option
    )
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载carto Basemaps 黑暗风格地图
  cartoDark: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'] }),
      option
    )
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载Stamen地图
  stamen: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png' }),
      option
    )
    viewer.imageryLayers.add(layer)
    return layer
  }
}