<template>
  <div
    class="float_door"
    :style="{
      width: `${itemWidth}px`,
      height: `${itemHeight}px`,
      left: `${left}px`,
      top: `${top}px`,
    }"
    ref="floatingDoor"
    @touchstart.prevent="dragStart"
    @touchend.prevent="dragEnd"
    @touchmove.prevent="dragMove"
  >
    传送门
  </div>
</template>

<script>
// 悬浮球
export default {
  name: 'Float-Door',
  props: {},
  components: {},
  data() {
    return {
      cWidth: 0,
      cHeight: 0,
      left: 0,
      top: 0,
      gapWidth: 10, // 距离窗口的间隙 px
      itemWidth: 50, // 悬浮球的大小 px
      itemHeight: 50, // 悬浮球的大小 px
      isMoved: false, // 是否移动过悬浮球， 用来辨认点击行为
    }
  },
  computed: {},
  watch: {},
  created() {
    this.cWidth = document.documentElement.clientWidth;
    this.cHeight = document.documentElement.clientHeight;
    this.left = this.cWidth - this.itemWidth - this.gapWidth;
    this.top = this.cHeight * 0.8;
  },
  mounted() { },
  methods: {
    dragStart(e) {
      this.$refs.floatingDoor.style.transition = "none"
    },

    dragMove(e) {
      // targetTouches 多点触控
      if (e.targetTouches.length === 1) {
        let touch = e.targetTouches[0];
        this.left = touch.clientX - this.itemWidth / 2
        this.top = touch.clientY - this.itemHeight / 2
        this.isMoved = true
      }
    },

    dragEnd(e) {
      if (this.isMoved) {
        this.$refs.floatingDoor.style.transition = 'all 0.3s'
        if (this.left > this.cWidth / 2) {
          this.left = this.cWidth - this.itemWidth - this.gapWidth
        } else {
          this.left = this.gapWidth
        }
      } else {
        // 没有移动过，属于点击行为
        this.openDoor()
      }
      // 每次操作之后都重置状态
      this.isMoved = false
    },

    openDoor() {
      console.log('openDoor');
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
