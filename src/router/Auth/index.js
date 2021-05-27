export default {
  path: "auth",
  name: "Auth",
  component: () => import("@/views/Main/Auth/index"),
  meta: { keepAlive: false },
  children: [
    {
      path: 'phoneVerify',
      name: 'PhoneVerify',
      meta: { title: '手机号验证' },
      component: () => import('@/views/Main/Auth/phone-verify/index.vue'),
    },
    {
      path: 'confirmInfo',
      name: 'ConfirmInfo',
      meta: { title: '付款确认' },
      component: () => import('@/views/Main/Auth/confirm-info/index.vue'),
    },
    {
      path: 'separateAccount',
      name: 'SeparateAccount',
      meta: { title: '分账信息' },
      component: () => import('@/views/Main/Auth/separate-account/index.vue'),
    },
    {
      path: 'payDetail',
      name: 'PayDetail',
      meta: { title: '付款明细' },
      component: () => import('@/views/Main/Auth/pay-detail/index.vue'),
    },
    {
      path: 'refuseReason',
      name: 'RefuseReason',
      meta: { title: '取消原因' },
      component: () => import('@/views/Main/Auth/refuse-reason/index.vue'),
    },
    {
      path: 'faceVerify',
      name: 'FaceVerify',
      meta: { title: '人脸识别' },
      component: () => import('@/views/Main/Auth/face-verify/index.vue'),
    }
  ]
}
