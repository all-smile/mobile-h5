// 存放工具函数
import { accessToken } from './config'

/* --------------内部方法---------------- */

export const setStore = (name, content) => {
  try {
    if (content === undefined) {
      localStorage.removeItem(name)
    } else {
      localStorage.setItem(name, JSON.stringify(content))
    }
  } catch (e) {
    console.log('setStore error!')
  }
}

export const getStore = name => {
  try {
    let result = localStorage.getItem(name)
    return result ? JSON.parse(result) : null
  } catch (e) {
    console.log('getStore error!')
    return null
  }
}

export const removeStore = name => {
  try {
    localStorage.removeItem(name)
  } catch (e) {
    console.log('removeStore error!')
  }
}

export const clearStore = () => {
  try {
    localStorage.clearAll()
  } catch (e) {
    console.log('clearStore error!')
  }
}

/**
 * 设置sessionstorage
 */
export const setItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value)
  } catch (e) {
    console.log('setItem error!')
  }
}

/**
* 获取sessionstorage
*/
export const getItem = (key) => {
  try {
    return sessionStorage.getItem(key)
  } catch (e) {
    console.log('getItem error!')
  }
}

/**
* 删除sessionstorage
*/
export const removeItem = (key) => {
  try {
    sessionStorage.removeItem(key)
  } catch (e) {
    console.log('removeItem error!')
  }
}

/**
* 清空sessionstorage
*/
export const clearItem = () => {
  try {
    sessionStorage.clear()
  } catch (e) {
    console.log('removeItem error!')
  }
}

/**
 * 判断是否是对象
 */
export const isObject = (obj, isEffective = false) => {
  if (Object.prototype.toString.call(obj) === '[object Object]') {
    if (isEffective) {
      return !!Object.keys(obj).length
    } else {
      return true
    }
  } else {
    return false
  }
}

/**
 * 判断是否是数组类型，
 * 并且是否是有效数组
 */
export const isArray = (array, isEffective = false) => {
  if (Object.prototype.toString.call(array) === '[object Array]') {
    if (isEffective) {
      return array.length > 0
    } else {
      return true
    }
  } else {
    return false
  }
}

/**
 * 判断是否是字符串类型
 */
export const isString = (str, isEffective = false) => {
  if (Object.prototype.toString.call(str) === '[object String]') {
    if (isEffective) {
      return !!str
    } else {
      return true
    }
  } else {
    return false
  }
}


/**
 * 判断是否是数值类型
 */
export const isNumber = num => {
  if (Object.prototype.toString.call(num) === '[object Number]') {
    return true
  } else {
    return false
  }
}

/**
* 判断是否是布尔类型
*/
export const isBoolean = boolean => {
  if (Object.prototype.toString.call(boolean) === '[object Boolean]') {
    return true
  } else {
    return false
  }
}

// 截取url参数
export const getQueryString = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  } else {
    return ''
  }
}
/**
 * 延时
 * @param {number} duration
 * @returns {Promise}
 */
export const sleep = function (duration = 0) {
  return new Promise((resolve, reject) => {
    if (isNumber(duration) && duration >= 0) {
      setTimeout(() => {
        resolve()
      }, duration)
    } else {
      reject('duration需大于等于0')
    }
  })
}

/**
 * 数组移除某项 比 Array.splice高效
 * @param {Array} list
 * @param {Number} index
 */
export const ArraySpliceOne = function (list, index) {
  for (; index + 1 < list.length; index++) {
    list[index] = list[index + 1]
  }
  list.pop()
}

/**
* 获取浏览器UA信息
* @param {*} url
*/

export const getUAResult = function () {
  return new UAParser().getResult()
}

// 数组去重
export const deDuplication = function (arr) {
  try {
    // 返回新数组(去重后的数组)
    return Array.from(new Set(arr)) // es6
  } catch (err) {
    let newArr = []
    for (let i = 0; i < arr.length; i++) {
      if (arr.indexOf(arr[i]) === i) {
        newArr.push(arr[i])
      }
    }
    console.log(err)
    return newArr
  }
}

/**
 * 获取系统Token
 */
export const getToken = () => {
  return {
    [accessToken]: JSON.parse(getItem(accessToken) || '{}').value || '',
  }
}
