const moment = require("moment");

/**
 * 金额千分位表示法
 * 9999 -> 9,999
 * @param {number} num
 * @returns
 */
export function toThousandFilter(num) {
  return (+num || 0)
    .toString()
    .replace(/^-?\d/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","));
}

/**
 * 金额千分位表示法(四舍五入)
 * 9999 -> 9,999
 * @param {number} num
 * @returns
 */
export function toThousandFilterNum(num) {
  return (+num || 0).toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
}

/**
 * 金额千分位表示法(向下取)
 * 9999 -> 9,999
 * @param {number} num
 * @returns
 */
export function toThousandFilterNumFloor(num) {
  return (Math.floor((+num || 0) * 100) / 100)
    .toFixed(2)
    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
}

/**
 * 金额千分位表示法(向上取)
 * 9999 -> 9,999
 * @param {number} num
 * @returns
 */
export function toThousandFilterNumCeil(num) {
  return (Math.ceil((+num || 0) * 100) / 100)
    .toFixed(2)
    .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
}

/**
 * 英文首字母大写
 * @param {String} string
 * @returns
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * 日期格式化
 * @param {String} str
 * @param {String} option
 * @returns
 */
export function formatTimeLint(str, option = "YYYY-MM-DD") {
  return moment(str).format(option);
}
