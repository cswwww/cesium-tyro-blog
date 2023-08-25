/*
 * @Date: 2023-06-04 10:41:29
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-09 13:04:26
 * @FilePath: \cesium-tyro-blog\src\utils\ImageryLayer\loadTianditu.js
 * @Description: 加载天地图影像图层
 * 天地图地图服务：http://lbs.tianditu.gov.cn/server/MapService.html
 * import {loadTianditu } from '@/utils/ImageryLayer/loadTianditu.js'
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// 图层相关配置
const layerOption = {
  show: true, // 图像层是否可见
  alpha: 1, // 透明度（0，1）
  nightAlpha: 1, // 地球夜晚一侧的透明度（0，1）
  dayAlpha: 1, // 地球白天一侧的透明度（0，1）
  brightness: 1, // 亮度（-1，1）
  contrast: 1, // 对比度（0，3）
  hue: 0, // 色调（0，360）
  saturation: 1, // 饱和度（0，3）
  gamma: 1 // 伽马校正（0.01，5）
}

const token = 'ab1a5f73690be1ad06c60f819924b2a3' // 申请的key
const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'] // 服务负载子域
const projectionType = {
  '_c': '经纬度投影',
  '_w': '球面墨卡托投影'
}
const layerKey = {
  vec: '矢量底图',
  cva: '矢量注记',
  img: '影像底图',
  cia: '影像注记',
  ter: '地形晕渲',
  cta: '地形注记',
  ibo: '全球境界',
  eva: '矢量英文注记',
  eia: '影像英文注记'
}

function loadTianditu(layer = 'img', proj = '_w', option) {
  // ! imageryProvider有两种写法
  // const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
  //   url: `http://t0.tianditu.com/${layer}${proj}/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=${layer}&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&tk=${token}`,
  //   layer: "img",
  //   style: "default",
  //   format: "image/jpeg",
  //   tileMatrixSetID: "GoogleMapsCompatible"
  // })
  const imageryProvider = new Cesium.UrlTemplateImageryProvider({
    url: `https://t{s}.tianditu.gov.cn/DataServer?T=${layer}${proj}&x={x}&y={y}&l={z}&tk=${token}`,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18
  })
  const imageryLayer = new Cesium.ImageryLayer(imageryProvider, option)
  imageryLayer.id = `天地图${layerKey[layer]} (${projectionType[proj]})`
  viewer.imageryLayers.add(imageryLayer)
  return imageryLayer
}

export {
  loadTianditu,
  layerKey
}
