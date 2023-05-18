/* eslint-disable */
// 注册全局自定义指令， `v-imgSrc` 占位显示
import Vue from "vue";

const initImg = require("@assets/images/initImg.jpg");
Vue.directive("imgSrc", {
  bind: function (el, binging) {
    el.src = initImg;
    let Img = new Image();
    if (!binging.value) {
      el.src = initImg;
      return;
    }
    Img.onload = () => {
      el.src = Img.src;
      Img = null;
    };
    Img.onerror = () => {
      el.src = Img.src;
      Img = null;
    };
    Img.src = binging.value;
  },
  inserted: function () {},
  update: function (el, binging) {
    // 指令数据更新后图片处理
    el.src = initImg;
    let Img = new Image();
    if (!binging.value) {
      el.src = initImg;
      return;
    }
    Img.onload = () => {
      el.src = Img.src;
      Img = null;
    };
    Img.onerror = () => {
      el.src = Img.src;
      Img = null;
    };
    Img.src = binging.value;
  },
  componentUpdated: function () {},
  unbind: function () {},
});
