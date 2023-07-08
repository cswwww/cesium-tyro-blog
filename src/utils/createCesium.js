/*
 * @Date: 2023-02-09 14:57:52
 * @LastEditTime: 2023-07-08 17:38:04
 * @FilePath: \cesium-tyro-blog\src\utils\createCesium.js
 * @Description: 创建地图单例
 */
import * as Cesium from 'cesium'
import tycho2t380px from '@/assets/images/tycho2t3_80_px.jpg'
import tycho2t380mx from '@/assets/images/tycho2t3_80_mx.jpg'
import tycho2t380py from '@/assets/images/tycho2t3_80_py.jpg'
import tycho2t380my from '@/assets/images/tycho2t3_80_my.jpg'
import tycho2t380pz from '@/assets/images/tycho2t3_80_pz.jpg'
import tycho2t380mz from '@/assets/images/tycho2t3_80_mz.jpg'

let viewer = {} // 地图对象

const viewerOption = {
  homeButton: false, // 是否显示Home按钮
  animation: false, // 是否创建动画小器件，左下角仪表
  baseLayerPicker: false, // 是否显示图层选择器
  fullscreenButton: false, // 是否显示全屏按钮
  geocoder: false, // 是否显示geocoder小器件，右上角查询按钮
  infoBox: false, // 是否显示信息框
  sceneMode: Cesium.SceneMode.SCENE3D, // 初始场景模式, SCENE2D | SCENE3D | COLUMBUS_VIEW
  sceneModePicker: false, // 是否显示3D/2D选择器
  scene3DOnly: true, // 如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
  selectionIndicator: false, // 是否显示选取指示器组件
  vrButton: false, // vr模式
  timeline: false, // 是否显示时间轴
  navigationHelpButton: false, // 是否显示右上角的帮助按钮
  baselLayerPicker: false, // 将图层选择的控件关掉，才能添加其他影像数据
  shadows: false, // 是否显示背影
  shouldAnimate: true,
  clock: new Cesium.Clock(), // 用于控制当前时间的时钟对象
  imageryProvider: undefined, // 不添加默认影像图层
  selectedImageryProviderViewModel: undefined, // 当前图像图层的显示模型，仅baseLayerPicker设为true有意义
  imageryProviderViewModels: Cesium.createDefaultImageryProviderViewModels(), // 可供BaseLayerPicker选择的图像图层ProviderViewModel数组
  selectedTerrainProviderViewModel: undefined, // 当前地形图层的显示模型，仅baseLayerPicker设为true有意义
  terrainProviderViewModels: Cesium.createDefaultTerrainProviderViewModels(), // 可供BaseLayerPicker选择的地形图层ProviderViewModel数组
  terrainProvider: new Cesium.EllipsoidTerrainProvider(), // 地形图层提供者，仅baseLayerPicker设为false有意义
  fullscreenElement: document.body, // 全屏时渲染的HTML元素,
  useDefaultRenderLoop: true, // 如果需要控制渲染循环，则设为true
  targetFrameRate: undefined, // 使用默认render loop时的帧率
  showRenderLoopErrors: false, // 如果设为true，将在一个HTML面板中显示错误信息
  automaticallyTrackDataSourceClocks: true, // 自动追踪最近添加的数据源的时钟设置
  contextOptions: undefined, // 传递给Scene对象的上下文参数（scene.options）
  mapProjection: new Cesium.WebMercatorProjection(), // 地图投影体系
  dataSources: new Cesium.DataSourceCollection(), // 需要进行可视化的数据源的集合
  creditContainer: document.createElement('div'), // 创建空div，可实现移除版权信息的效果
  // terrainProvider: Cesium.createWorldTerrain(),
  // skyBox: new Cesium.SkyBox({ // 天空盒
  //   sources: {
  //     positiveX: tycho2t380px,
  //     negativeX: tycho2t380mx,
  //     positiveY: tycho2t380py,
  //     negativeY: tycho2t380my,
  //     positiveZ: tycho2t380pz,
  //     negativeZ: tycho2t380mz
  //   }
  // })
}

/**
 * @description: 初始化地球
 * @param {string} target - 地球挂载的div容器
 * @return {*}
 */
class CesiumMap {
  constructor(target, Option = viewerOption) {
    // 首次使用构造器实例
    if (!CesiumMap.instance) {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ODRiMTU0NS05NmJlLTRhNzYtYjA3OS02N2JmY2RhMDE0NDgiLCJpZCI6MTA3OTM5LCJpYXQiOjE2NjMxMjk1Nzd9.XmVmA2d7T2qG6y4vAcQrmb9msWbnLxCe5qYtnlK8h5k';

      this.target = target // Type: Element | String
      this.viewer = new Cesium.Viewer(target, Option)
      this.viewer.imageryLayers.removeAll() // 移除所有图层，只显示蓝色地球


      // 修改场景环境,关闭相关特效
      this.viewer.scene.debugShowFramesPerSecond = false// 显示fps
      this.viewer.scene.moon.show = false// 月亮
      this.viewer.scene.sun.show = false// 太阳
      this.viewer.scene.skyBox.show = true// 天空盒
      this.viewer.scene.skyAtmosphere.show = false; // 隐藏天空大气
      // this.this.scene.skyAtmosphere.atmosphereLightIntensity=50//天空大气效果亮度
      this.viewer.scene.fog.enabled = false// 雾
      // this.viewer.scene.fog.minimumBrightness = 0.1//雾效果最小亮度
      // this.viewer.scene.fog.density = 0.0003//浓度
      // this.viewer.scene.backgroundColor = Cesium.Color.GREEN;
      // this.viewer.scene.highDynamicRange=true //HDR效果

      this.viewer.resolutionScale = 1.0// 画面细度，默认值为1.0

      // 地球相关配置
      this.viewer.scene.globe.enableLighting = false // 激活基于太阳位置的光照（场景光照
      // this.viewer.scene.globe.baseColor = Cesium.Color.TRANSPARENT // 基础色，默认是蓝色 Cesium.Color.BLUE
      // this.viewer.scene.globe.translucency.enabled = true // 一定要为 true，否则 undergroundColor 设置无效
      // this.viewer.scene.globe.undergroundColor = Cesium.Color.TRANSPARENT // 地下色，默认是黑色 Cesium.Color.BLACK
      // this.viewer.scene.globe.showGroundAtmosphere = true//开启地表大气效果
      // this.viewer.scene.globe.atmosphereLightIntensity = 10//设置地表大气亮度

      viewer = this.viewer

      // 将this挂载到CesiumMap这个类的instance属性上
      CesiumMap.instance = this
    }
    return CesiumMap.instance
  }

  // 地形切换
  changeTerrain(key) {
    // 水面、法向量、光照相关
    switch (key) {
      case 1:
        viewer.terrainProvider = Cesium.createWorldTerrain() // 使用Cesium在线Ion地形
        break
      case 2:
        viewer.terrainProvider = new Cesium.CesiumTerrainProvider({
          // url: 'https://tiles.geovis.online/base/v1/terrain?token=fd2cddddcf70866a1a334a47b78b8cba1941af00c93b3a97e49c65ab5182922a',
          url: Cesium.IonResource.fromAssetId(3956), // 1
          requestWaterMask: true,  // 请求水体效果所需要的海岸线数据
          requestVertexNormals: true // 请求地形照明数据:增加法线提高光照效果
        })
        break
      case 3:
        viewer.terrainProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
          url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
          token: "KED1aF_I4UzXOHy3BnhwyBHU4l5oY6rO6walkmHoYqGp4XyIWUd5YZUC1ZrLAzvV40pR6gBXQayh0eFA8m6vPg..",
        })
        break
      default:
        viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider() // 不使用地形
        break
    }
  }
}

export { CesiumMap, viewer }
