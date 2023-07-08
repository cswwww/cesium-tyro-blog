/*
 * @Date: 2023-06-04 10:41:29
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-08 17:22:24
 * @FilePath: \cesium-tyro-blog\src\utils\ImageryLayer\loadImagery.js
 * @Description: 加载影像图层
 * 各个provider的参考：https://zhuanlan.zhihu.com/p/340669216
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
  gamma: 1, // 伽马校正（0.01，5）
}

export const loadImagery = {
  // 加载arcgis地图服务
  // 'http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer'
  // 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
  arcgis: (url, option, callback) => {
    const imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
      url,
      token: '',
      layers: '', // 要显示的子图层 ID 数组,有多个就用逗号隔开：'0,1'
      credit: '', // 于表示影像图层的来源及版权信息
      // rectangle:window.Cesium.Rectangle.fromDegrees(117.26344486210633, 36.67686347861695, 117.273444862106332,  36.68686347861695), // 地图显示范围，弧度制[东,南,西,北]
      maximumLevel: 18,
      enablePickFeatures: true, // 是否应该返回用于选择的附加要素数据，服务需支持Identify操作
      usePreCachedTilesIfAvailable: true, // 如果为 true，则使用服务器的预缓存切片（如果可用）。如果为 false，则忽略任何预缓存的切片并使用'导出'服务。
    })
    const layer = new Cesium.ImageryLayer(imageryProvider, option)
    // viewer.imageryLayers.add(layer, index) // 可以为图层设置index

    // !选取要素信息
    if (callback) {
      viewer.screenSpaceEventHandler.setInputAction(async function onLeftClick(event) {
        // 获取鼠标点击位置的屏幕坐标
        const position = event.position;
        const cartographic = window.Cesium.Cartographic.fromCartesian(window.viewer.scene.pickPosition(position))

        // 使用pickFeatures方法获取选择的要素信息
        // pickFeatures的条件比较苛刻，比如输入18，则缩放必须处于18级才能点选
        const promise = imageryProvider.pickFeatures(position.x, position.y, 18, cartographic.longitude, cartographic.latitude);
        const features = await promise

        callback(features) // 触发回调函数
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    viewer.imageryLayers.add(layer) // (layer,index)
    return layer
  },
  // Cesium ION 服務
  // 3812:Black Marble 影像服务
  // 3845:World Imagery 影像服务
  // 3954:Bing Maps
  ion: (option, id = 3812) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.IonImageryProvider({ assetId: id }),
      option
    )
    layer.id = 'Cesium ION ' + id
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载osm地图
  osm: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.OpenStreetMapImageryProvider({ url: 'https://a.tile.openstreetmap.org/' }),
      option
    )
    layer.id = 'OpenStreetMap'
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载Humanitarian OpenStreetMap Team style地图
  hot: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c'] }),
      option
    )
    layer.id = 'HumanitarianOpenStreetMap'
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载carto Basemaps 航海风格地图
  cartoVoyager: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png' }),
      option
    )
    layer.id = 'CartoVoyager'
    // layer.defaultOption = option || layerOption
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载carto Basemaps 黑暗风格地图
  cartoDark: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', subdomains: ['a', 'b', 'c', 'd'] }),
      option
    )
    layer.id = 'CartoDark'
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载Stamen地图
  stamen: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.UrlTemplateImageryProvider({ url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png' }),
      option
    )
    layer.id = 'StamenWater'
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载网格（调试用）
  debugGrid: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.GridImageryProvider(),
      option
    )
    layer.id = 'debugGrid'
    viewer.imageryLayers.add(layer)
    return layer
  },
  // 加载瓦片信息图层：显示瓦片层级、行列号（调试用）
  debugTile: (option) => {
    const layer = new Cesium.ImageryLayer(
      new Cesium.TileCoordinatesImageryProvider(),
      option
    )
    layer.id = 'debugTile'
    viewer.imageryLayers.add(layer)
    return layer
  },
  // TODO 未完成：加载WMTS
  wmts: () => {
    const imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
      url: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg",
      layer: "MODIS_Terra_CorrectedReflectance_TrueColor", // 要显示图层
      credit: '', // 于表示影像图层的来源及版权信息
      style: 'default',
      tileMatrixSetID: "250m",
      maximumLevel: 5,
      format: "image/jpeg",
      clock: viewer.clock,
    })
    const layer = new Cesium.ImageryLayer(imageryProvider, option)
    // viewer.imageryLayers.add(layer, index) // 可以为图层设置index
    viewer.imageryLayers.add(layer)
    return layer
  },
  // TODO 未完成：加载WMS
  wms: () => {
    const imageryProvider = new Cesium.WebMapServiceImageryProvider({
      url: "https://nationalmap.gov.au/proxy/http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows",
      layers: "Hydrography:bores",
      parameters: {
        service: "WMS",
        format: "image/png",
        transparent: true
      },
    })
    const layer = new Cesium.ImageryLayer(imageryProvider, option)
    // viewer.imageryLayers.add(layer, index) // 可以为图层设置index
    viewer.imageryLayers.add(layer)
    return layer
  },
  mapbox: () => {
    const imageryProvider = new Cesium.MapboxStyleImageryProvider({
      username: "你的账号名称",
      styleId: '你的地图Id',
      accessToken: '你的accessToken',
    })
    const layer = new Cesium.ImageryLayer(imageryProvider, option)
    // viewer.imageryLayers.add(layer, index) // 可以为图层设置index
    viewer.imageryLayers.add(layer)
    return layer
  },
}