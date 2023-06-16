/*
 * @Date: 2023-06-16 15:27:53
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-06-16 19:00:28
 * @FilePath: \cesium-tyro-blog\src\utils\VectorData\loadGeoJson.js
 * @Description: 加载GeoJson格式数据
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
 * Loads a GeoJSON data and adds it to the Cesium viewer.
 *
 * @param {Resource | string | object} data - The GeoJson data to load. Defaults to lineSample.
 * @param {Object} options - Options for loading the GeoJson data source.
 * @return {Promise<Cesium.GeoJsonDataSource>} A Promise that resolves with the loaded GeoJsonDataSource.
 */
async function loadGeoJSON(data = collectionSample, options) {
  const dataSource = await Cesium.GeoJsonDataSource.load(data, options)
  viewer.dataSources.add(dataSource)
  
  viewer.zoomTo(dataSource)
  return dataSource
}

export {
  loadGeoJSON
}