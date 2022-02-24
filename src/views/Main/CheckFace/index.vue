<!--
 * @Author: your name
 * @Date: 2021-09-06 20:36:38
 * @LastEditTime: 2021-09-06 20:53:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mobile-h5\src\views\Main\CheckFace\index.vue
-->
<template>
  <div class="CheckFace">
    <div class="open-face">
      <van-button type="primary" @click="notifyPhoto">开始人脸识别</van-button>
    </div>
    <webrtc-face-verify v-if="openFaceVerify" ref="faceVerifyCtrl" :openFaceVerify.sync="openFaceVerify"></webrtc-face-verify>
  </div>
</template>

<script>
import WebrtcFaceVerify from '@components/webrtc-face-verify/index'
export default {
  name: 'CheckFace',
  props: {},
  components: {
    'webrtc-face-verify': WebrtcFaceVerify,
  },
  data() {
    return {
      openFaceVerify: false,
    }
  },
  computed: {},
  watch: {},
  created() {
    this.setHeaderTitle('人脸识别')
  },
  mounted() {
    // this.test()
  },
  methods: {
    async test() {
      try {
        let res = await this.Global.api.testModel()
        console.log(res);
      } catch (err) {
        console.log("test", err);
      }
    },
    notifyPhoto() {
      this.openFaceVerify = true
      this.$nextTick(() => {
        this.$refs.faceVerifyCtrl && this.$refs.faceVerifyCtrl.initFaceApiModel((res) => {
          // this.handleStatus(res) // 返回识别成功或失败
          console.log(res);
        })
      })
    },
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
