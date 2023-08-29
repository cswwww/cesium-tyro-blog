/*
 * @Date: 2023-06-28 08:42:51
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-29 09:35:55
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\clusterEntity.js
 * @Description: 點聚合
 * 沙盒示例：https://sandcastle.cesium.com/index.html?src=Clustering.html
 * 示例数据：https://sandcastle.cesium.com/SampleData/kml/facilities/facilities.kml
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import pointSample from '@/assets/geojson/point.json' // 示例点要素

async function setClustering(data) {
  let dataSource = null
  if (!data) {
    dataSource = await Cesium.GeoJsonDataSource.load(pointSample)
    viewer.dataSources.add(dataSource)
    viewer.zoomTo(dataSource) // 定位过去
  } else {
    dataSource = data
  }

  dataSource.clustering.enabled = true
  dataSource.clustering.pixelRange = 15
  dataSource.clustering.minimumClusterSize = 3

  const pinBuilder = new Cesium.PinBuilder()
  dataSource.clustering.clusterEvent.addEventListener((clusteredEntities, cluster) => {
    const pinImg = pinBuilder
      .fromText(cluster.label.text, Cesium.Color.RED, 48)
      .toDataURL()
    cluster.label.show = false
    cluster.billboard.image = pinImg
    cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM
    cluster.billboard.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
    cluster.billboard.show = true
  })
}

async function addClustering(data) {
  // ! 加载点数据
  let dataSource = null
  if (!data) {
    dataSource = await Cesium.GeoJsonDataSource.load(pointSample)
    viewer.dataSources.add(dataSource)
    viewer.zoomTo(dataSource) // 定位过去
  } else {
    dataSource = data
  }

  const options = {
    enabled: true, // boolean, Default: false
    pixelRange: 15, // number, Default: 80; 扩展屏幕空间边界框的像素范围
    minimumClusterSize: 3, // number, Default: 2;可以聚合的最小屏幕空间对象
    clusterBillboards: true, // boolean, Default: true; Whether or not to cluster the billboards of an entity.
    clusterLabels: true, // boolean, Default: true; Whether or not to cluster the labels of an entity.
    clusterPoints: true, // boolean, Default: true; Whether or not to cluster the points of an entity.
    show: true // boolean, Default: false
  }

  dataSource.clustering = new Cesium.EntityCluster(options)

  // 添加監聽事件
  dataSource.clustering.clusterEvent.addEventListener(function(entities, cluster) {
    cluster.label.show = true
    cluster.billboard.show = true
    cluster.point.show = true

    cluster.label.text = entities.length.toLocaleString()
  })
}

export {
  setClustering,
  addClustering
}
