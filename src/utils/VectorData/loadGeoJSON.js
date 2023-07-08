/*
 * @Date: 2023-06-16 15:27:53
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-05 18:13:57
 * @FilePath: \cesium-tyro-blog\src\utils\VectorData\loadGeoJSON.js
 * @Description: 加载GeoJson或者TopoJSON格式数据
 * const vectorPromise = loadGeoJSON(pointSample)
 * vectorPromise.then(dataSource => {
 *   console.log('dataSource: ', dataSource)
 * })
 */

import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

import pointSample from '@/assets/geojson/point.json' // 示例点要素
import lineSample from '@/assets/geojson/line.json' // 示例线要素
import polygonSample from '@/assets/geojson/polygon.json' // 示例面要素
import collectionSample from '@/assets/geojson/collection.json' // 示例要素集合

const sourceOptions = {
  sourceUri: '', // string - Overrides the url to use for resolving relative links.
  // describe: {}, // GeoJsonDataSource.defaultDescribeProperty	
  // markerSize: 0, // number - The size of the marker in pixels
  markerSymbol: 'park', // string - The symbol to use for the marker, e.g. 'park'
  markerColor: Cesium.Color.RED, // Cesium.Color - The color of the marker
  stroke: Cesium.Color.BLUE, // Cesium.Color - The default color of polylines and polygon outlines.面要素要设置了outline才有效
  strokeWidth: 3,// number - The default width of polylines and polygon outlines
  fill: Cesium.Color.PINK.withAlpha(0.5), // Cesium.Color - The default color for polygon interiors.
  clampToGround: true, // boolean - Whether to clamp to the ground (贴地)
  credit: '' // Credit | string - A credit for the data source
}


/**
 * Loads GeoJSON or TopoJSON data into a Cesium GeoJsonDataSource object and adds it to the viewer.
 *
 * @param {Resource | string | object} data - The GeoJson data to load. Defaults to lineSample.
 * @param {Object} [options] - Options for the GeoJsonDataSource.load() function.
 * @param {Function} [callback] - A function to be executed after the data is loaded.
 * @return {Promise<Cesium.GeoJsonDataSource>} A Promise that resolves with the loaded GeoJsonDataSource.
 */
async function loadGeoJSON(data, options) {
  const dataSource = await Cesium.GeoJsonDataSource.load(data, options)

  viewer.dataSources.add(dataSource)
  viewer.zoomTo(dataSource) // 定位过去

  return dataSource
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Represents a GeoJSON data source that can be loaded, updated, and monitored for changes.
 *
 * @class
 */
class CesiumGeoJSON {
  constructor(data, options, callback) {
    this.data = data;
    this.options = options;
    this.dataSource = null;

    // 初始化 GeoJSON 数据源
    this.init(callback);
  }

  // 初始化 GeoJSON 数据源
  init(callback) {
    Cesium.GeoJsonDataSource.load(this.data, this.options)
      .then((dataSource) => {
        this.dataSource = dataSource
        viewer.dataSources.add(this.dataSource);

        // this.dataSource.describe = ''
        // this.dataSource.credit = ''
        // dataSource.show = true // boolean - Whether to show
        // dataSource.name = '' // string - The name of the data source

        viewer.zoomTo(this.dataSource)

        this.watch() // 开启监听
        callback && callback(this.dataSource) // 触发回调函数
      }).catch((error) => {
        console.error('矢量数据加载发生了一些错误:', error);
      })
  }

  // 更新（重新加载）数据源
  async update(newData, options) {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁');
    }

    if (typeof newData == 'object') {
      // 使用 Cesium.Resource 对象创建一个新的 GeoJSON 数据源，这么做才能触发changeEvent
      const resource = new Cesium.Resource({
        url: URL.createObjectURL(new Blob([JSON.stringify(newData)], { type: 'application/json' }))
      });
      return await this.dataSource.load(resource, options)
    } else {
      return await this.dataSource.load(newData, options)
    }
  }

  // 新增（不替换已有的数据）数据源
  async add(newData = pointSample, options) {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁');
    }

    if (typeof newData == 'object') {
      // 使用 Cesium.Resource 对象创建一个新的 GeoJSON 数据源，这么做才能触发changeEvent
      const resource = new Cesium.Resource({
        url: URL.createObjectURL(new Blob([JSON.stringify(newData)], { type: 'application/json' }))
      });
      return await this.dataSource.process(resource, options)
    } else {
      return await this.dataSource.process(newData, options)
    }
  }

  // TODO 未完成：将数据源更新到提供的时间
  updateTime(time) {
    console.log('time should be JulianDate', time);
  }
  // 监听数据源的变化
  watch() {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁');
    }

    // 监听数据源变化事件
    this.dataSource.changedEvent.addEventListener(this.changedEvent);
    // 监听错误事件
    this.dataSource.errorEvent.addEventListener(this.errorEvent);
  }

  // 数据源变化的事件
  changedEvent(dataSource) {
    console.log('矢量数据源已被修改:', dataSource);
  }

  // 数据错误的事件
  errorEvent(err) {
    console.error('矢量数据加载发生了一些错误：', err);
  }

  // 销毁数据源和监听器
  destroy() {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁');
    }

    // 取消所有监听器
    this.dataSource.changedEvent.removeEventListener(this.changedEvent);
    this.dataSource.errorEvent.removeEventListener(this.errorEvent)

    // 移除数据源
    viewer.dataSources.remove(this.dataSource);
    this.dataSource = null;
    console.log('CesiumGeoJSON has been destroyed.');
  }
}

// TODO 未完成
function loadGeoJSONInPrimitive(features) {
  const instances = [];
  for (let i = 0; i < features.length; i++) {
    for (let j = 0; j < features[i].geometry.coordinates.length; j++) {
      const polygonArr = features[i].geometry.coordinates[j].toString().split(',');
      const polygon = new Cesium.PolygonGeometry({
        polygonHierarchy: new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray(polygonArr)
        ),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
      });
      const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
      instances.push(new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom({ alpha: 0.7 })),
        },
      }));
    }
  }

  const primitive = new Cesium.Primitive({
    geometryInstances: instances,
    appearance: new Cesium.PerInstanceColorAppearance({ // 为每个instance着色
      translucent: true,
      closed: false
    }),
    asynchronous: false,  // 确定基元是异步创建还是阻塞直到准备就绪
  });

  scene.primitives.add(primitive);
}
export {
  loadGeoJSON,
  CesiumGeoJSON
}