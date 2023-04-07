import './libs'
import Vue from "vue";
import App from "./App.vue";
import { sync } from 'vuex-router-sync'
import router from "./router";
import store from "./store";
import './router/permission'
import "./directive/index"

import '@/globalComponents'

// 引入全局mixin
import mixins from '@/mixins/index.js'
Vue.mixin(mixins)

sync(store, router, { moduleName: 'RouteModule' }) // vue-router的状态同步到vuex中

// 引入vant
import Vant from 'vant';
import 'vant/lib/index.css';
import '@vant/touch-emulator'; // vant 桌面端适配
Vue.use(Vant);
// import '@/plugin/axios/index'
// import '@/plugin/vant/index'

Vue.config.productionTip = false;

new Vue({
  mixins,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
