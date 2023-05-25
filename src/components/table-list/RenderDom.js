const renderDom = {
  props: {
    vNode: {
      type: [Array, String, Object, Number],
    },
  },
  render(h) {
    if (typeof this.vNode === "object") {
      return this.vNode;
    }

    // 普通数据， 直接包一层div, 返回给页面
    return h(
      "div",
      {
        class: "ellipsis", // 单元格显示省略号
      },
      this.vNode
    );
  },
};

export default renderDom;
