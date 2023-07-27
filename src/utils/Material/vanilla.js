/*
 * @Date: 2023-07-27 12:12:28
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-07-27 12:20:22
 * @FilePath: \cesium-tyro-blog\src\utils\Material\vanilla.js
 * @Description: 原生的MaterialProperty类
 * https://zhuanlan.zhihu.com/p/380320237
 */

// 1.ColorMaterialProperty 颜色材质
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-55.0, 40.0, 100000.0),
  ellipse: {
    semiMajorAxis: 300000.0, // 长半轴距离
    semiMinorAxis: 200000.0, // 短半轴距离
    height: 20000.0,
    material: new Cesium.ColorMaterialProperty(Cesium.Color.BLUE.withAlpha(0.5)),
  },
});

// 2.ImageMaterialProperty 贴图材质
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-65.0, 40.0, 100000.0),
  ellipse: {
    semiMajorAxis: 300000.0, // 长半轴距离
    semiMinorAxis: 200000.0, // 短半轴距离
    height: 20000.0,
    material: new Cesium.ImageMaterialProperty({
      image: "./images/bumpmap.png",
      repeat: new Cesium.Cartesian2(4, 4),
      color: Cesium.Color.BLUE,
    }),
  },
});

// 3.CheckerboardMaterialProperty 棋盘纹理
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 100000.0),
  ellipse: {
    semiMajorAxis: 300000.0, // 长半轴距离
    semiMinorAxis: 200000.0, // 短半轴距离
    height: 20000.0,
    material: new Cesium.CheckerboardMaterialProperty({
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: new Cesium.Cartesian2(4, 4),
    }),
  },
});

// 4.StripeMaterialProperty 条纹纹理
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-85.0, 40.0, 100000.0),
  ellipse: {
    semiMajorAxis: 300000.0, // 长半轴距离
    semiMinorAxis: 200000.0, // 短半轴距离
    height: 20000.0,
    material: new Cesium.StripeMaterialProperty({
      orientation: Cesium.StripeOrientation.VERTICAL,
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: 16,
    }),
  },
});

// 5.GridMaterialProperty 网格
viewer.entities.add({
  position: Cesium.Cartesian3.fromDegrees(-95.0, 40.0, 100000.0),
  ellipse: {
    semiMajorAxis: 300000.0, // 长半轴距离
    semiMinorAxis: 200000.0, // 短半轴距离
    height: 20000.0,
    material: new Cesium.GridMaterialProperty({
      color: Cesium.Color.YELLOW,
      cellAlpha: 0.5,
      lineCount: new Cesium.Cartesian2(8, 8),
      lineThickness: new Cesium.Cartesian2(2.0, 2.0),
      lineOffset: new Cesium.Cartesian2(0.0, 0.0),
    }),
  },
});

// 6.PolylineGlowMaterialProperty 发光材质
viewer.entities.add({
  name: "Glowing blue line on the surface",
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
    width: 10,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.8,
      taperPower: 0.5,
      color: Cesium.Color.CORNFLOWERBLUE,
    }),
  },
});

// 7.PolylineOutlineMaterialProperty 外轮廓材质
viewer.entities.add({
  name: "Orange line with black outline at height and following the surface",
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      -75,
      39,
      250000,
      -125,
      39,
      250000,
    ]),
    width: 5,
    material: new Cesium.PolylineOutlineMaterialProperty({
      color: Cesium.Color.ORANGE,
      outlineWidth: 5,
      outlineColor: Cesium.Color.BLACK,
    }),
  },
});

// 8.PolylineArrowMaterialProperty 带有箭头的线
viewer.entities.add({
  name: "Purple straight arrow at height",
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      -75,
      43,
      500000,
      -125,
      43,
      500000,
    ]),
    width: 10,
    arcType: Cesium.ArcType.NONE,
    material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
  },
});

// 9.PolylineDashMaterialProperty 虚线
viewer.entities.add({
  name: "Blue dashed line",
  polyline: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      -75,
      45,
      500000,
      -125,
      45,
      500000,
    ]),
    width: 4,
    material: new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.CYAN,
    }),
  },
});