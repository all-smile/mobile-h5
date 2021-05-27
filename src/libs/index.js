// 存放依赖库和工具函数

import Vue from 'vue'
import * as config from './config'
import api from './api'
import EventBus from './event'
/**
 * 全局配置
 */

Vue.prototype.Global = Object.assign(config, {
  'api': api,
})

Vue.prototype.$EventBus = EventBus
