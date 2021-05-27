export default {
  path: "auth",
  name: "Auth",
  component: () => import("@/views/Main/Auth/index"),
  meta: { keepAlive: false },
  children: [
    {
      path: 'phoneSms',
      name: 'PhoneSms',
      meta: { title: '手机号验证' },
      component: () => import('@/views/Main/Auth/phone-sms/index.vue'),
    },
  ]
}
