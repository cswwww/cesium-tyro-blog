import { ref, markRaw, onMounted } from 'vue'

// 功能组件
import ManageImagery from '../components/ManageImagery.vue';
import ManageTileset from '../components/ManageTileset.vue';
import GlobalConfig from '../components/GlobalConfig.vue';
import DrawPolyline from '../components/DrawPolyline.vue';

// 图标图片：SuperMap GIS产品彩色系功能图标库
// https://www.iconfont.cn/collections/detail?spm=a313x.7781069.0.da5a778a4&cid=32519
import 环境设置 from '@/assets/images/环境设置.svg'
import 影像图层 from '@/assets/images/影像图层.svg'
import 静态模型 from '@/assets/images/静态模型.svg'
import 对象绘制 from '@/assets/images/对象绘制.svg'

export const functionList = markRaw([
  {
    name: '全局配置',
    icon: 环境设置,
    component: GlobalConfig
  },
  {
    name: '影像图层',
    icon: 影像图层,
    component: ManageImagery
  }, {
    name: '3D Tiles',
    icon: 静态模型,
    component: ManageTileset
  }, {
    name: '画多段线',
    icon: 对象绘制,
    component: DrawPolyline
  }
])