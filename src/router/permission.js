import router from './index.js'
import store from '@/store'
// import MXEventBus from '@/libs/event'
import { getStore, getToken, getQueryString } from '@/libs/utils.js'
import { accessToken, isDev } from '@/libs/config'

/* 
DPSQ("DPSQ","“闪签”律师平台资金监管项目"),
DPPM("DPPM","“爆品趣拍”平台保证金存管项目"),
DPLM("DPLM","“灵猫”灵活用工平台项目"),
DPHQ("DPHQ","“伴零工”灵活用工平台项目");
 */
const DPSQ__list = [
  '/main/auth/phoneVerify',
  '/main/auth/confirmInfo',
  '/main/auth/separateAccount',
  '/main/auth/payDetail',
  '/main/auth/refuseReason',
  '/main/auth/faceVerify',
  '/main/auth/phoneSms'
]
const whitelist = [
  '/main/nopage',
  ...DPSQ__list,
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

