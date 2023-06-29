/*
 * @Date: 2023-06-28 08:42:51
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-28 08:48:40
 * @FilePath: \cesium-tyro-blog\src\utils\Entity\entityCluster.js
 * @Description: Entity 聚合
 */
// TODO 未完成

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

var options = {
  camera: viewer.scene.camera,
  canvas: viewer.scene.canvas,
};
var dataSourcePromise = viewer.dataSources.add(
  Cesium.KmlDataSource.load("./data/kml/facilities/facilities.kml", options)
);
dataSourcePromise.then(function (dataSource) {
  var pixelRange = 15;
  var minimumClusterSize = 3;
  var enabled = true;

  dataSource.clustering.enabled = enabled;
  dataSource.clustering.pixelRange = pixelRange; // 扩展屏幕空间边界框的像素范围
  dataSource.clustering.minimumClusterSize = minimumClusterSize; // 可以聚合的最小屏幕空间对象

  var removeListener;

  var pinBuilder = new Cesium.PinBuilder();
  var pin50 = pinBuilder.fromText("50+", Cesium.Color.RED, 48).toDataURL();
  var pin40 = pinBuilder
    .fromText("40+", Cesium.Color.ORANGE, 48)
    .toDataURL();
  var pin30 = pinBuilder
    .fromText("30+", Cesium.Color.YELLOW, 48)
    .toDataURL();
  var pin20 = pinBuilder
    .fromText("20+", Cesium.Color.GREEN, 48)
    .toDataURL();
  var pin10 = pinBuilder.fromText("10+", Cesium.Color.BLUE, 48).toDataURL();

  var singleDigitPins = new Array(8);
  for (var i = 0; i < singleDigitPins.length; ++i) {
    singleDigitPins[i] = pinBuilder
      .fromText("" + (i + 2), Cesium.Color.VIOLET, 48)
      .toDataURL();
  }

  function customStyle() {
    if (Cesium.defined(removeListener)) {
      removeListener();
      removeListener = undefined;
    } else {
      removeListener = dataSource.clustering.clusterEvent.addEventListener(
        function (clusteredEntities, cluster) {
          cluster.label.show = false;
          cluster.billboard.show = true;
          cluster.billboard.id = cluster.label.id;
          cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

          if (clusteredEntities.length >= 50) {
            cluster.billboard.image = pin50;
          } else if (clusteredEntities.length >= 40) {
            cluster.billboard.image = pin40;
          } else if (clusteredEntities.length >= 30) {
            cluster.billboard.image = pin30;
          } else if (clusteredEntities.length >= 20) {
            cluster.billboard.image = pin20;
          } else if (clusteredEntities.length >= 10) {
            cluster.billboard.image = pin10;
          } else {
            cluster.billboard.image =
              singleDigitPins[clusteredEntities.length - 2];
          }
        }
      );
    }

    // force a re-cluster with the new styling
    var pixelRange = dataSource.clustering.pixelRange;
    dataSource.clustering.pixelRange = 0;
    dataSource.clustering.pixelRange = pixelRange;
  }

  // start with custom style
  customStyle();

  var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (movement) {
    var pickedLabel = viewer.scene.pick(movement.position);
    if (Cesium.defined(pickedLabel)) {
      var ids = pickedLabel.id;
      if (Array.isArray(ids)) {
        for (var i = 0; i < ids.length; ++i) {
          ids[i].billboard.color = Cesium.Color.RED;
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
});