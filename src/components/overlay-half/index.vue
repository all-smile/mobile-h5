<template>
  <div class="overlay_ware" v-if="isShow">
    <transition name="fade">
      <div class="sliderBg" @click="isShow = false"></div>
    </transition>
    <transition name="overlay-slider">
      <div class="sliderCont">
        <slot name="content"></slot>
        <div class="handle-btn">
          <van-button
            type="default"
            square
            class="cus-btn"
            @click="handleCancel"
            >取消</van-button
          >
          <van-button type="info" square class="cus-btn" @click="handleConfirm"
            >确定</van-button
          >
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Overlay-Half',
  props: {},
  components: {},
  data() {
    return {
      isShow: false,
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    open() {
      this.isShow = true
    },

    handleCancel() {
      this.isShow = false
      this.$emit('cancelcallback')
    },

    handleConfirm() {
      this.isShow = false
      this.$emit('confirmcallback')
    },
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
