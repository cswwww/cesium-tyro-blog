/*
 * @Date: 2023-07-10 17:57:05
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-25 15:17:15
 * @FilePath: \cesium-tyro-blog\src\utils\VectorData\loadCZML.js
 * @Description: 加载CZML格式数据
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import point from '@/assets/czml/point.json' // 示例点数据
import satellite from '@/assets/czml/satellite.json' // 示例卫星数据

const sourceOptions = {
  sourceUri: '', // string - Overrides the url to use for resolving relative links.
  // describe: {}, // CzmlDataSource.defaultDescribeProperty
  // markerSize: 0, // number - The size of the marker in pixels
  markerSymbol: 'park', // string - The symbol to use for the marker, e.g. 'park'
  markerColor: Cesium.Color.RED, // Cesium.Color - The color of the marker
  stroke: Cesium.Color.BLUE, // Cesium.Color - The default color of polylines and polygon outlines.面要素要设置了outline才有效
  strokeWidth: 3, // number - The default width of polylines and polygon outlines
  fill: Cesium.Color.PINK.withAlpha(0.5), // Cesium.Color - The default color for polygon interiors.
  clampToGround: true, // boolean - Whether to clamp to the ground (贴地)
  credit: '' // Credit | string - A credit for the data source
}

async function loadCzml(data = satellite, options) {
  const dataSource = await Cesium.CzmlDataSource.load(data, options)

  viewer.dataSources.add(dataSource)
  viewer.zoomTo(dataSource) // 定位过去

  setInterval(() => {
    console.log(dataSource.entities.getById('point').properties.height.getValue(viewer.clock.tick()))
  }, 2000)

  return dataSource
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Represents a Czml data source that can be loaded, updated, and monitored for changes.
 *
 * @class
 * import {CesiumCzml} from '@/utils/VectorData/loadCZML.js'
 */
class CesiumCzml {
  constructor(data, options, callback) {
    this.data = data
    this.options = options
    this.dataSource = null

    // 初始化 Czml 数据源
    this.init(callback)
  }

  // 初始化 Czml 数据源
  init(callback) {
    Cesium.CzmlDataSource.load(this.data, this.options)
      .then((dataSource) => {
        this.dataSource = dataSource
        viewer.dataSources.add(this.dataSource)

        // this.dataSource.describe = ''
        // this.dataSource.credit = ''
        // dataSource.show = true // boolean - Whether to show
        // dataSource.name = '' // string - The name of the data source

        viewer.zoomTo(this.dataSource)

        this.watch() // 开启监听
        callback && callback(this.dataSource) // 触发回调函数
      }).catch((error) => {
        console.error('矢量数据加载发生了一些错误:', error)
      })
  }

  // 更新（重新加载）数据源
  async update(newData, options) {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁')
    }

    if (typeof newData === 'object') {
      // 使用 Cesium.Resource 对象创建一个新的 Czml 数据源，这么做才能触发changeEvent
      const resource = new Cesium.Resource({
        url: URL.createObjectURL(new Blob([JSON.stringify(newData)], { type: 'application/json' }))
      })
      return await this.dataSource.load(resource, options)
    } else {
      return await this.dataSource.load(newData, options)
    }
  }

  // 新增（不替换已有的数据）数据源
  async add(newData = satellite, options) {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁')
    }

    if (typeof newData === 'object') {
      // 使用 Cesium.Resource 对象创建一个新的 Czml 数据源，这么做才能触发changeEvent
      const resource = new Cesium.Resource({
        url: URL.createObjectURL(new Blob([JSON.stringify(newData)], { type: 'application/json' }))
      })
      return await this.dataSource.process(resource, options)
    } else {
      return await this.dataSource.process(newData, options)
    }
  }

  // TODO 未完成：将数据源更新到提供的时间
  updateTime(time) {
    console.log('time should be JulianDate', time)
  }
  // 监听数据源的变化
  watch() {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁')
    }

    // 监听数据源变化事件
    this.dataSource.changedEvent.addEventListener(this.changedEvent)
    // 监听错误事件
    this.dataSource.errorEvent.addEventListener(this.errorEvent)
  }

  // 数据源变化的事件
  changedEvent(dataSource) {
    console.log('矢量数据源已被修改:', dataSource)
  }

  // 数据错误的事件
  errorEvent(err) {
    console.error('矢量数据加载发生了一些错误：', err)
  }

  // 销毁数据源和监听器
  destroy() {
    if (this.dataSource == null) {
      throw new Error('矢量数据未加载或已被销毁')
    }

    // 取消所有监听器
    this.dataSource.changedEvent.removeEventListener(this.changedEvent)
    this.dataSource.errorEvent.removeEventListener(this.errorEvent)

    // 移除数据源
    viewer.dataSources.remove(this.dataSource)
    this.dataSource = null
    console.log('CesiumCzml has been destroyed.')
  }
}

export {
  loadCzml,
  CesiumCzml
}
