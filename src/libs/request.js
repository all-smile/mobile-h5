/**
 *  * 封装axios
 * aes + rsa
 * 1、请求前参数加密 (目前针对post类型，body加密)
 * VUE_APP_RUNTIME
 * 生产环境 prod: 加密
 * 生产测试环境 prod-test: 明文传输，便于查看参数
 * 开发环境： 明文传输，便于查看报文参数
 * 2、获取响应数据，解密处理，判断 res.headers.keycipher 是否需要解密
 * 密文： 前端获取一律需要解密转 json
 */
import { Toast } from "vant";
import axios from "axios";
import moment from "moment";
import { isObject, isString, getItem, setItem } from "./utils";
import $EventBus from "@/libs/event";
import { aesKey, isDev, baseUrl, inUseMockdata } from "./config";
import { aesEncrypt, aesDecrypt } from "./crypto";
import { rsaEncrypt, rsaDecrypt } from "./jsencrypt";

axios.defaults.headers.post["Content-Type"] = "application/json; charset=UTF-8";

let retry = 2; // 重发次数
let retryDelay = 200; // 重发时延

// 1. 创建新的axios实例，
const instance = axios.create({
  // 公共接口--这里注意后面会讲
  baseURL: !isDev ? baseUrl : "",
  // `withCredentials`指示是否跨站点访问控制请求
  withCredentials: true,

  // “responseType”表示服务器将响应的数据类型
  // 包括 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
  responseType: "json",

  // headers`是要发送的自定义 headers
  headers: {
    // 'X-Requested-With': 'XMLHttpRequest',
    "Cache-Control": "no-store", // IE 禁用缓存 // 'no-cache'
  },
  // 超时时间 单位是ms，这里设置了30s的超时时间
  timeout: 30 * 1000,
  transformRequest: [
    function (data, headers) {
      // console.log("transformRequest data = ", data);
      // console.log("transformRequest headers = ", headers);
      if (isObject(data)) {
        data = JSON.stringify(data);
        // 一、请求参数加密
        if (process.env.VUE_APP_ENCRY === "1") {
          headers["keyCipher"] = rsaEncrypt(aesKey); // 传输 aes key 密文
          data = aesEncrypt(data); // 加密请求参数
        }
        return data;
      }
      return data;
    },
  ],
  transformResponse: [
    function (data, headers) {
      // console.log("transformResponse data = ", data);
      // console.log("transformResponse headers = ", headers);
      if (data && isString(data)) {
        try {
          // 先对 axios 返回的源数据处理
          data = JSON.parse(data);
          // console.log("data=====", data);
          /**
           * 二、获取响应数据之后解密
           * 判断 headers.keycipher 是否需要解密 (后端在接口报错的情况下，直接返回的是明文，不对错误信息加密)
           * 1、rsa 解密后端生成的 aes key
           * 2、aes 解密返参密文
           */
          const { keycipher = "" } = headers || {};
          if (keycipher) {
            // 解密
            const resAesKey = rsaDecrypt(keycipher);
            const dataStr = aesDecrypt(data, resAesKey) || "{}";
            data = JSON.parse(dataStr);
          }
          // console.log("res data ====", data);
        } catch (err) {
          console.log("transformResponse-err", err);
        }
      }
      return data;
    },
  ],
});

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方法未允许",
  406: "请求的格式不可得。",
  408: "请求超时",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  501: "网络未实现",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
  505: "http版本不支持该请求",
};

// 2. 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // console.log("request", config);
    if (config.url) {
      config.headers = {
        ...config.headers,
        timeStamp: moment().format("YYYYMMDDHHmmss"),
        UserAuthorization: getItem("Authorization") || "",
      };

      // 请求路径增加时间戳，防止命中缓存
      if (config.url.indexOf("?") !== -1) {
        config.url += `&timeStamp=${config.headers.timeStamp}`;
      } else {
        config.url += `?timeStamp=${config.headers.timeStamp}`;
      }
      return config;
    } else {
      return Promise.reject("接口不合法");
    }
  },
  (error) => {
    // 对请求错误做些什么
    console.log("request-err", error);
    Toast.fail(error);
    return Promise.reject(error);
  }
);

// 3. 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error) => {
    // 对响应错误做点什么
    console.log("response-err", error);
    /***** 接收到异常响应的处理开始 *****/
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      const { status, config, statusText } = error.response;
      if (status) {
        const errorText = codeMessage[status] || statusText || "出错了";
        Toast.fail(`请求错误 ${status}: ${config.url}\n${errorText}`);
      } else {
        Toast.fail("您的网络发生异常，无法连接服务器");
      }
    } else {
      // 其它异常处理
      console.log("error===pre-retry===>", error);
      let { config = {} } = error || {};
      // 记录请求次数
      config.requestCount = config.requestCount || 1;
      if (config.requestCount < retry) {
        config.requestCount++; // 重发次数累加
        let backoff = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, retryDelay || 100);
        });
        // 重发 更新时间戳
        const retryUrl =
          config.url.split("?")[0] +
          `?timeStamp=${moment().format("YYYYMMDDHHmmssSSS")}`;
        config.url = retryUrl;
        console.log("err===retry-config===>", config);
        return backoff.then(() => {
          return axios.request(config);
        });
      } else {
        Toast.fail("连接服务器失败，请稍后再试");
      }
      /* // 超时处理
      if (JSON.stringify(error).toLocaleLowerCase().includes("timeout")) {
        Toast.fail("服务器响应超时，请刷新当前页");
      } else {
        Toast.fail("连接服务器失败");
      } */
    }

    /***** 处理结束 *****/
    return Promise.reject(error);
  }
);

export default instance;
