import Vue from 'vue'
import axios from 'axios'
Vue.prototype.axios = axios

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // config.withCredentials = true
    let method = config.method
    // 请求参数不是一个对象时
    if (typeof config.params !== 'object') {
      config.params = {}
    }
    if (typeof config.data !== 'object') {
      config.data = {}
    }

    // 解决浏览器缓存请求
    if (method === 'get') {
      Object.assign(config.params, {
        '_@time': new Date() * 1
      })
    }

    // 请求挂载企业
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error)
  }
)
