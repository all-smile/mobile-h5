// 存放工具函数
import moment from "moment/moment";
import { accessToken } from "./config";
import { isDev, baseUrl } from "./config";

/* --------------内部方法---------------- */

export const setStore = (name, content) => {
  try {
    if (content === undefined) {
      localStorage.removeItem(name);
    } else {
      localStorage.setItem(name, JSON.stringify(content));
    }
  } catch (e) {
    console.log("setStore error!");
  }
};

export const getStore = (name) => {
  try {
    let result = localStorage.getItem(name);
    return result ? JSON.parse(result) : null;
  } catch (e) {
    console.log("getStore error!");
    return null;
  }
};

export const removeStore = (name) => {
  try {
    localStorage.removeItem(name);
  } catch (e) {
    console.log("removeStore error!");
  }
};

export const clearStore = () => {
  try {
    localStorage.clearAll();
  } catch (e) {
    console.log("clearStore error!");
  }
};

/**
 * 设置sessionstorage
 */
export const setItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.log("setItem error!");
  }
};

/**
 * 获取sessionstorage
 */
export const getItem = (key) => {
  try {
    return sessionStorage.getItem(key);
  } catch (e) {
    console.log("getItem error!");
  }
};

/**
 * 删除sessionstorage
 */
export const removeItem = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.log("removeItem error!");
  }
};

/**
 * 清空sessionstorage
 */
export const clearItem = () => {
  try {
    sessionStorage.clear();
  } catch (e) {
    console.log("removeItem error!");
  }
};

/**
 * 判断是否是对象
 */
export const isObject = (obj, isEffective = false) => {
  if (Object.prototype.toString.call(obj) === "[object Object]") {
    if (isEffective) {
      return !!Object.keys(obj).length;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

/**
 * 判断是否是数组类型，
 * 并且是否是有效数组
 */
export const isArray = (array, isEffective = false) => {
  if (Object.prototype.toString.call(array) === "[object Array]") {
    if (isEffective) {
      return array.length > 0;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

/**
 * 判断是否是字符串类型
 */
export const isString = (str, isEffective = false) => {
  if (Object.prototype.toString.call(str) === "[object String]") {
    if (isEffective) {
      return !!str;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

/**
 * 判断是否是数值类型
 */
export const isNumber = (num) => {
  if (Object.prototype.toString.call(num) === "[object Number]") {
    return true;
  } else {
    return false;
  }
};

/**
 * 判断是否是布尔类型
 */
export const isBoolean = (boolean) => {
  if (Object.prototype.toString.call(boolean) === "[object Boolean]") {
    return true;
  } else {
    return false;
  }
};

// 截取url参数
/*
http://localhost:8081/#/main/auth/phoneSms
如果url采用的是hash模式（带有#号），则window.location.search为空字符串
*/
export const getQueryString = function (name) {
  try {
    let after = "";
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    if (window.location.search) {
      after = window.location.search.split("?")[1] || "";
    } else if (window.location.hash) {
      after = window.location.hash.split("?")[1] || "";
    }
    const r = after.match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return "";
    }
  } catch (err) {
    console.log(err);
    return "";
  }
};
/**
 * 延时
 * @param {number} duration
 * @returns {Promise}
 */
export const sleep = function (duration = 0) {
  return new Promise((resolve, reject) => {
    if (isNumber(duration) && duration >= 0) {
      setTimeout(() => {
        resolve();
      }, duration);
    } else {
      reject("duration需大于等于0");
    }
  });
};

/**
 * 数组移除某项 比 Array.splice高效
 * @param {Array} list
 * @param {Number} index
 */
export const ArraySpliceOne = function (list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1];
  }
  list.pop();
};

/**
 * 获取浏览器UA信息
 * @param {*} url
 */

export const getUAResult = function () {
  return new UAParser().getResult();
};

// 数组去重
export const deDuplication = function (arr) {
  try {
    // 返回新数组(去重后的数组)
    return Array.from(new Set(arr)); // es6
  } catch (err) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr.indexOf(arr[i]) === i) {
        newArr.push(arr[i]);
      }
    }
    console.log(err);
    return newArr;
  }
};

/**
 * 获取系统Token
 */
export const getToken = () => {
  return {
    [accessToken]: getItem(accessToken) || "",
  };
};

// 判断日期是不是今天、昨天、返回值[string]: 0:今天， -1:昨天 , 1-明天
// str: 2023-02-17 14:09:27
export function isWhichDay(str) {
  const date = new Date();
  const that = moment(moment(str).format("YYYY-MM-DD")).valueOf();
  const today = moment(moment(date).format("YYYY-MM-DD")).valueOf();
  const timeDiff = that - today;
  const obj = {
    "-86400000": "-1",
    0: "0",
    86400000: "1",
  };
  return obj[timeDiff] || null;
}

// 判断日期是不是当年，返回布尔值
export function isCurYear(str) {
  return moment().format("YYYY") === moment(str).format("YYYY");
}

/**
 * 格式化传入时间
 * 1、当天的显示如： 16:20
 * 2、昨天的显示如： 昨天 16:20
 * 3、昨天之前且当年的，显示如： 03-03 16:20
 * 4、昨天之前且跨年的，显示如： 2023-03-03 16:20
 * 传入时间 2023-02-17 16:20:27
 */
export function formatTime(time) {
  const t = isWhichDay(time);
  if (t === "0") {
    return moment(time).format("HH:mm");
  } else if (t === "-1") {
    return `昨天 ${moment(time).format("HH:mm")}`;
  } else if (
    isCurYear(time) &&
    new Date(time).getTime() < new Date().getTime()
  ) {
    return moment(time).format("MM-DD HH:mm");
  } else {
    return moment(time).format("YYYY-MM-DD HH:mm");
  }
}

// fileName: aa.jpg
export function isImg(fileName) {
  if (!fileName) {
    return false;
  }

  const index = fileName.lastIndexOf(".");
  if (index === -1) {
    return false;
  }
  const ext = fileName.substring(index + 1);

  if (!ext) {
    return false;
  }

  return extArr.indexOf(ext.toLowerCase()) !== -1;
}

export function processFileUrl(fileId) {
  const accessToken = encodeURI(getToken()[accessToken]);
  const path = `/api/fnd/file/preview/${fileId}?accessToken=${accessToken}`;
  return isDev ? `${baseUrl}${path}` : baseUrl + path;
}

/**
 * 外部链接验证
 * @param {String} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
