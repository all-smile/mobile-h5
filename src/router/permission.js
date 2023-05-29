import router from "./index.js";
import store from "@/store";
// import $eventBus from '@/libs/event'
import { getStore, getToken, getQueryString } from "@/libs/utils.js";
import { accessToken, isDev } from "@/libs/config";

const DPSQ = ["/main/nopage", "/main/checkFace"];

const whitelist = [
  "/home",
  "/list",
  "/main/nopage",
  "/main/checkFace",
  "/main/checkFaceV2",
  ...(isDev ? ["/main"] : []),
];

router.beforeEach((to, from, next) => {
  try {
    // let accessTokenStr = getToken()[accessToken]
    if (to?.meta?.title) {
      document.title = to.meta.title;
    }
    // const { belong = [] } = to.meta
    // const authInfo = ["platform", "action"]
    // if (accessTokenStr) {
    //   // 已登录, 做点什么
    //   // belong <--> authInfo
    // } else {
    //   next()
    // }
    let isNext = false;
    if (whitelist.includes(to.path)) {
      isNext = true;
    }

    if (isNext) {
      next();
    } else {
      console.log(to.path + " is unavailable!");
      next({
        path: "/main/nopage",
        replace: true,
        query: {
          errPath: to.path,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});
