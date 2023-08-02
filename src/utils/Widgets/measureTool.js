/*
 * @Date: 2023-07-31 12:28:08
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-02 19:54:33
 * @FilePath: \cesium-tyro-blog\src\utils\Widgets\measureTool.js
 * @Description: 测量工具
 * import { CoordinatePicker } from '@/utils/Widgets/measureTool.js'
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'
import { pickCursor } from '@/utils/Event/cursorEvent.js'

// 坐标获取与转换
function _coordsTransform(event, got, not) {
  const ray = viewer.camera.getPickRay(event.position || event.endPosition); // 从摄影机位置创建一条光线，穿过世界坐标中position处的像素。
  // const cartesian = viewer.scene.pickPosition(event.position || event.endPosition); // 获取倾斜摄影或模型点击处的坐标
  const cartesian = viewer.scene.camera.pickEllipsoid(event.position || event.endPosition, viewer.scene.globe.ellipsoid); // 获取鼠标点的对应椭球面位置
  // const cartesian = viewer.scene.globe.pick(ray, viewer.scene); // 获取加载地形后对应的经纬度和高程
  if (Cesium.defined(cartesian)) {
    got?.(cartesian);
  } else {
    not?.();
  }
}

function getLength(points) {
  if (points.length < 2) {
    return 0
  }
  // 计算距离
  let length = Cesium.Cartesian3.distance(points[points.length - 2], points[points.length - 1]);
  return length
}

// 坐标拾取
class CoordinatePicker {
  constructor() {
    this.globeElement = document.getElementById("cesiumContainer"); // 替换为你的地球场景容器元素ID
    this.floatInfoElement = document.createElement('div'); // 创建指针旁的浮动信息元素
    this.measureHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);// 测量工具的交互句柄单例

    // 新建DataSource用来管理entities
    this.measureCollection = new Cesium.CustomDataSource("measureEntityCollection");
    viewer.dataSources.add(this.measureCollection);

    this._floatInfoStyle()
  }

  // 修改浮动信息元素的样式和内容
  _floatInfoStyle() {
    this.globeElement.appendChild(this.floatInfoElement);

    this.floatInfoElement.style.position = 'fixed';
    this.floatInfoElement.style.bottom = '10px';
    this.floatInfoElement.style.left = '10px';

    this.floatInfoElement.onmouseover = () => {
      this.floatInfoElement.style.display = 'none';
    }
  }

  // 鼠标移动事件处理函数
  _onMouseMove(movement) {
    if (!movement) {
      this.floatInfoElement.style.display = 'none';
    }
    _coordsTransform(movement, (cartesian) => {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);

      // 更新经纬度信息
      this.floatInfoElement.innerHTML = `经度: ${longitude.toFixed(6)}<br>纬度: ${latitude.toFixed(6)}`;
      this.floatInfoElement.style.display = 'block';
      this.floatInfoElement.style.left = `${movement.endPosition.x + 10}px`;
      this.floatInfoElement.style.top = `${movement.endPosition.y + 10}px`;
    }, () => {
      this.floatInfoElement.style.display = 'none';
    })
  }

  // 添加广告牌
  _addBillboard(event) {
    _coordsTransform(event, (cartesian) => {
      // 将 Cartesian3 坐标转换为 Cartographic 格式
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      // 将弧度表示的经纬度转换为度表示
      const longitude = Cesium.Math.toDegrees(cartographic.longitude);
      const latitude = Cesium.Math.toDegrees(cartographic.latitude);
      const height = cartographic.height;
      // 绘制一个圆点
      const point = this.measureCollection.entities.add({
        position: cartesian,
        point: {
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          outlineWidth: 1
        },
      });
      // 创建广告牌并显示经纬度信息
      const label = this.measureCollection.entities.add({
        position: cartesian,
        billboard: {
          // image: '',
          scale: 1.0,
        },
        label: {
          text: `经度: ${longitude.toFixed(6)}\n纬度: ${latitude.toFixed(6)}`,
          showBackground: true,
          backgroundColor: new Cesium.Color(0.2, 0.2, 0.2, 0.7),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -30), // 广告牌位置上移一些
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          disableDepthTestDistance: Number.POSITIVE_INFINITY, // 避免被遮挡
        }
      });
    })
  }

  // ! 坐标拾取
  start() {
    pickCursor() // 修改指针
    this.measureHandler.setInputAction(this._onMouseMove.bind(this), Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.measureHandler.setInputAction(this._addBillboard.bind(this), Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  // ! 清空所有测量绘制
  clear() {
    this.measureCollection.entities.removeAll()
  }

  // ! 销毁所有测量功能
  destroy() {
    pickCursor(false)
    this.clear()
    this.floatInfoElement.style.display = 'none';
    this.measureHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.measureHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }
}

class MeasureDistance {
  activePoint // 动态点
  distance = 0 // 距离
  dynamicDistance = 0
  constructor() {
    if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
      window.alert(
        "This browser does not support polylines on terrain."
      );
    }
    if (!MeasureDistance.instance) { // 首次使用构造器实例
      this.globeElement = document.getElementById("cesiumContainer"); // 替换为你的地球场景容器元素ID
      this.floatInfoElement = document.createElement('div'); // 创建指针旁的浮动信息元素
      this._floatInfoStyle()

      // 新建DataSource用来管理entities
      this.nodeCollection = new Cesium.CustomDataSource("nodeEntityCollection");
      this.lineCollection = new Cesium.CustomDataSource("lineEntityCollection");
      this.labelCollection = new Cesium.CustomDataSource("labelEntityCollection");
      viewer.dataSources.add(this.nodeCollection);
      viewer.dataSources.add(this.lineCollection);
      viewer.dataSources.add(this.labelCollection);

      this.addHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 新增点位的交互句柄
      this.finHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 完成点选的交互句柄
      this.moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas); // 完成点选的交互句柄

      viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK); // 关闭左键双击事件
      MeasureDistance.instance = this // 将this挂载到MeasureDistance这个类的instance属性上
    }
    return MeasureDistance.instance // 返回单例
  }
  // 修改浮动信息元素的样式和内容
  _floatInfoStyle() {
    this.globeElement.appendChild(this.floatInfoElement);

    this.floatInfoElement.style.position = 'fixed';
    this.floatInfoElement.style.bottom = '10px';
    this.floatInfoElement.style.left = '10px';

    this.floatInfoElement.onmouseover = () => {
      this.floatInfoElement.style.display = 'none';
    }
  }
  // ! 开始绘制
  start() {
    pickCursor(true, 'pointer')

    this.activePoint = this.createCursorPoint({ x: 0, y: 0, z: 0 }); // 默认显示动态点
    this.activePoint.position.setValue(undefined); // 隐藏指针点

    let pointList = []; // 初始化当前的线坐标数组
    // 事件：新增点
    this.addHandler.setInputAction(event => {
      this.distance = parseFloat(this.distance) + parseFloat(this.dynamicDistance)

      _coordsTransform(event, (cartesian) => {
        this.nodeCollection.entities.add(this.createNodePoint(cartesian)); // 绘制节点
        pointList.push(cartesian);
        // 绘制动态线：首次点击后触发
        if (pointList.length === 1) {
          pointList.push(cartesian) // 加入一个动态点
        }
        // 绘制线：点击2次后触发
        if (pointList.length === 2) {
          const dynamicPositions = new Cesium.CallbackProperty(() => pointList, false);
          this.lineCollection.entities.add(this.createNormalLine(dynamicPositions)) // 绘制线
        }
        // this.labelCollection.entities.add(this.createNodeLabel(cartesian)); // 绘制节点
        console.log('this.createNodeLabel(cartesian): ', this.createNodeLabel(cartesian));
      })
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 事件：鼠标移动
    this.moveHandler.setInputAction(event => {
      if (!event) {
        this.floatInfoElement.style.display = 'none';
      }
      _coordsTransform(event, (cartesian) => {
        this.activePoint.position.setValue(cartesian);
        if (pointList.length > 0) {
          pointList.pop();
          pointList.push(cartesian);
        }
        this.dynamicDistance = getLength(pointList)
        this.floatInfoElement.innerHTML = (this.dynamicDistance + this.distance).toFixed(2) + '米';
        this.floatInfoElement.style.display = 'block';
        this.floatInfoElement.style.left = `${event.endPosition.x + 10}px`;
        this.floatInfoElement.style.top = `${event.endPosition.y + 10}px`;
      }, () => {
        this.floatInfoElement.style.display = 'none';
      })
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    // 事件：完成绘制
    this.finHandler.setInputAction(event => {
      pointList.pop();

      if (pointList.length < 1) { // 一个节点都没添加
        alert('请至少选2个点')
        return
      } else if (pointList.length < 2) { // 如果点击了一次，就会马上创建点和线，那么就需要清除掉最末的entity，否则会污染数据集
        alert('请至少选2个点')
        this.nodeCollection.entities.remove(this.nodeCollection.entities.values[this.nodeCollection.entities.values.length - 1]);
        return
      }
      this.stop()
      this.start()
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  // 结束绘制
  stop() {
    this.distance = 0
    this.dynamicDistance = 0
    this.addHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    this.moveHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    this.finHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK)

    viewer.entities.remove(this.activePoint); // 移除动态点
  }

  // 绘制：节点
  createNodePoint(cartesian) {
    return new Cesium.Entity({
      position: cartesian,
      point: {
        pixelSize: 3, // 像素大小，默认: 1 
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.BLUE, // 默认: 白
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      }
    })
  }
  // 绘制：动态点
  createCursorPoint(cartesian) {
    const point = viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 5, // 像素大小，默认: 1 
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 表示相对于地形的位置
        color: Cesium.Color.SKYBLUE, // 默认: 白
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    return point;
  }
  createNodeLabel(cartesian) {
    const label = viewer.entities.add({
      position: cartesian,
      label: {
        text: 0,
        pixelOffset: new Cesium.Cartesian2(0, -20), // 在点的上方偏移
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        font: "24px Helvetica",
        // FILL	填充；OUTLINE 只显示边框；FILL_AND_OUTLINE 既有填充又有边框
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        scale: 1.0,
        showBackground: true,
        backgroundColor: Cesium.Color.BLUE,
        backgroundPadding: new Cesium.Cartesian2(7, 5),
        eyeOffset: Cesium.Cartesian3.ZERO,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        fillColor: Cesium.Color.SKYBLUE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    return label;
  }
  // 绘制：线
  createNormalLine(list) {
    return new Cesium.Entity({
      polyline: {
        positions: list,
        clampToGround: true,
        width: 2,
      },
    })
  }
  clear() {
    this.nodeCollection.entities.removeAll()
    this.lineCollection.entities.removeAll()
    this.labelCollection.entities.removeAll()
  }

  // 销毁：清空绘制与监听
  destroy() {
    this.floatInfoElement.style.display = 'none';

    pickCursor(false)
    this.stop()
    this.clear()
  }
}

export {
  CoordinatePicker, MeasureDistance
}
