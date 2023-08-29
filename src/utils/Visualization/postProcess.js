/*
 * @Date: 2023-07-19 14:10:25
 * @LastEditors: ReBeX  420659880@qq.com
 * @LastEditTime: 2023-08-28 17:42:12
 * @FilePath: \cesium-tyro-blog\src\utils\Visualization\postProcess.js
 * @Description: PostProcessStageLibrary
 * https://cesium.com/learn/cesiumjs/ref-doc/PostProcessStageLibrary.html?classFilter=PostProcessStageLibrary
 */
import { viewer } from '@/utils/createCesium.js' // 引入地图对象
import * as Cesium from 'cesium'

// 泛光效果
export function bloomEffect() {
  const bloom = viewer.scene.postProcessStages.bloom
  bloom.enabled = false
  // 设置泛光效果
  bloom.uniforms.glowOnly = false
  bloom.uniforms.contrast = 128
  bloom.uniforms.brightness = -0.3
  // 泛光区域叠加模糊效果
  bloom.uniforms.delta = 1
  bloom.uniforms.sigma = 2
  bloom.uniforms.stepSize = 1
}

// 镜头炫光
export function lensFlare() {
  const viewModel = {
    show: true,
    intensity: 2.0,
    distortion: 10.0,
    dispersion: 0.4,
    haloWidth: 0.4,
    dirtAmount: 0.4
  }
  const lensFlare = viewer.scene.postProcessStages.add(
    Cesium.PostProcessStageLibrary.createLensFlareStage()
  )
  lensFlare.enabled = Boolean(viewModel.show)
  lensFlare.uniforms.intensity = Number(viewModel.intensity)
  lensFlare.uniforms.distortion = Number(viewModel.distortion)
  lensFlare.uniforms.ghostDispersal = Number(viewModel.dispersion)
  lensFlare.uniforms.haloWidth = Number(viewModel.haloWidth)
  lensFlare.uniforms.dirtAmount = Number(viewModel.dirtAmount)
  lensFlare.uniforms.earthRadius = Cesium.Ellipsoid.WGS84.maximumRadiu
}

// 镜头焦距
export function focalDistance() {
  const depthOfField = viewer.scene.postProcessStages.add(
    Cesium.PostProcessStageLibrary.createDepthOfFieldStage()
  )
  depthOfField.enabled = true
  depthOfField.uniforms.focalDistance = 10
}

// 模糊（景深）效果
export function stepSize() {
  const depthOfField = viewer.scene.postProcessStages.add(
    Cesium.PostProcessStageLibrary.createDepthOfFieldStage()
  )

  depthOfField.enabled = true
  depthOfField.uniforms.delta = 1 // 用于调整景深的模糊程度
  depthOfField.uniforms.sigma = 3.78 // 调整景深效果的焦点范围
  depthOfField.uniforms.stepSize = 2.46 // 较小的步进大小可以提供更精细的景深效果
}
