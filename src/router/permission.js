import router from './index.js'
import store from '@/store'
// import MXEventBus from '@/libs/event'
import { getStore, getToken, getQueryString } from '@/libs/utils.js'
import { accessToken, isDev } from '@/libs/config'

const whitelist = [
  '/main/nopage',
  '/main/checkFace',
  ...(isDev ? ['/main'] : [])
]

router.beforeEach((to, from, next) => {
  try {
    // let accessTokenStr = getToken()[accessToken]
    if (to?.meta?.title) {
      document.title = to.meta.title
    }
    // if (accessTokenStr) {
    //   // 已登录
    // } else {
    //   next()
    // }
    let isNext = false
    if (whitelist.includes(to.path)) {
      isNext = true
    }

    if (isNext) {
      next()
    } else {
      console.log(to.path + ' is unavailable!')
      next({
        path: '/main/nopage',
        replace: true,
        query: {
          errPath: to.path
        }
      })
    }
  } catch (err) {
    console.log(err);
  }
})

router.afterEach(() => {
  window.scrollTo(0, 0);
});

