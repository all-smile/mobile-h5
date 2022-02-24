// 封装api
import http from './http'

export default {
  getListAPI(params) {
    const api = {
      url: 'getListAPI',
      mockUrl: './mock_data/getListAPI.json'
    }
    return http.get(api, params)
  },
  getUserInfo(params) {
    const api = {
      url: 'getUserInfo',
      mockUrl: './mock_data/getUserInfo.json'
    }
    return http.get(api, params)
  },
  getOrderPayInfo(params) {
    const { payOrderId = '' } = params
    const api = {
      url: `api/zypg/order/queryBehalfPayMentOrderInfo/${payOrderId}`,
      mockUrl: ''
    }
    return http.post(api)
  },
  getOrderPayList(params) {
    const api = {
      url: 'api/zypg/order/queryBehalfPayMentAmtDetail',
      mockUrl: ''
    }
    return http.post(api, params)
  },
  getAutherInfo(params) {
    const api = {
      url: 'api/zypg/openWarranty',
      mockUrl: ''
    }
    return http.post(api, params)
  },
  getPhoneSms(params) {
    const api = {
      url: 'api/zypg/smsVerification',
      mockUrl: ''
    }
    return http.post(api, params)
  },
  authLogin(params) {
    const api = {
      url: 'api/zypg/verificationCode',
      mockUrl: ''
    }
    return http.post(api, params)
  },
  cancelPay(params) {
    const api = {
      url: 'api/zypg/order/cancelPay',
      mockUrl: ''
    }
    return http.post(api, params)
  },
  testModel(params) {
    const api = {
      url: 'model-face/age_gender_model-weights_manifest.json',
      mockUrl: ''
    }
    return http.get(api, params)
  },
}
