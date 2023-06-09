import Vue from "vue";
import Router from "vue-router";

import NoPage from "./NoPage/index";

// 处理 NavigationDuplicated
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

Vue.use(Router);

const routes = [
  {
    path: "/",
    redirect: "/main/checkFace",
  },
  {
    path: "/test",
    name: "Test",
    meta: {
      belong: ["xxx", "xxx"],
    },
    component: () => import("@/views/test"),
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home"),
  },
  {
    path: "/list",
    name: "List",
    meta: {
      title: "智能仓管平台",
    },
    component: () => import("@/views/List"),
  },
  {
    path: "/main",
    name: "Main",
    component: () => import("@/views/Main/index"),
    children: [
      NoPage,
      {
        path: "checkFace",
        name: "CheckFace",
        component: () => import("@/views/Main/CheckFace"),
      },
      {
        path: "checkFaceV2",
        name: "CheckFaceV2",
        component: () => import("@/views/Main/CheckFaceV2/faceDemo.vue"),
      },
    ],
  },
];

const router = new Router({
  mode: "hash", // 'history',
  base: process.env.VUE_APP_PATH,
  routes,
});

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  if (isChunkLoadFailed) {
    // 用路由的replace方法，并没有相当于F5刷新页面，失败的js文件并没有从新请求，会导致一直尝试replace页面导致死循环，而用 location.reload 方法，相当于触发F5刷新页面，虽然用户体验上来说会有刷新加载察觉，但不会导致页面卡死及死循环，从而曲线救国解决该问题
    location.reload();
    // const targetPath = $router.history.pending.fullPath;
    // $router.replace(targetPath);
  }
});

export default router;
