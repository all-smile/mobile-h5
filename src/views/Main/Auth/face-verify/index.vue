<template>
    <div class="faceVerify">
        <div v-if="!openFaceVerify && !isVerified">
            <img class="faceVeriffy__faceBg" :src="faceBg" alt="img">
            <div class="faceVeriffy__tip">
                <div class="faceVeriffy__tip-item">勿戴帽</div>
                <div class="faceVeriffy__tip-item">勿戴眼镜</div>
            </div>
            <div class="faceVeriffy__tip">
                <div class="faceVeriffy__tip-item">正面平视</div>
                <div class="faceVeriffy__tip-item">光线充足</div>
            </div>
            <div class="faceVeriffyBtn_outer">
                <van-button class="faceVeriffy_btn" type="primary" @click="notifyPhoto">开始人脸识别</van-button>
            </div>
        </div>
        <webrtc-face-verify v-if="openFaceVerify && !isVerified" ref="faceVerifyCtrl" :openFaceVerify.sync="openFaceVerify"></webrtc-face-verify>
        <tips v-if="isVerified" ref="tipsCtrl" @close="closeTips"></tips>
    </div>
</template>

<script>
import WebrtcFaceVerify from '@components/webrtc-face-verify/index'
// v-if + 懒加载的方式无法在this.$nextTick()通过ref里获取到组件实例
// const WebrtcFaceVerify = () => import('@components/webrtc-face-verify/index')
import Tips from '../tips/index'
export default {
    name: 'FaceVerify',
    props: {},
    components: {
        'webrtc-face-verify': WebrtcFaceVerify,
        'tips': Tips
    },
    data() {
        return {
            faceBg: require('./img/face_bg.png'),
            openFaceVerify: false,
            isVerified: false
        }
    },
    computed: {},
    watch: {},
    created() {
        this.setHeaderTitle('人脸识别')
    },
    mounted() { },
    methods: {
        notifyPhoto() {
            this.openFaceVerify = true
            this.$nextTick(() => {
                this.$refs.faceVerifyCtrl && this.$refs.faceVerifyCtrl.initFaceApiModel((res) => {
                    this.handleStatus(res) // 返回识别成功或失败
                })
            })
        },
        handleStatus(res) {
            console.log(res)
            this.isVerified = true
            this.$nextTick(() => {
                this.$refs.tipsCtrl && this.$refs.tipsCtrl.open(res)
            })
        },
        closeTips(arg) {
            console.log('close', arg)
            if (arg === 'reVerifyFace') {
                // 识别失败 - 重新识别
                this.openFaceVerify = false
                this.isVerified = false
            } else {
                // 识别成功 - 关闭
            }
        }
    },
    updated() { },
    beforeDestroy() { },
    beforeRouteLeave(to, from, next) {
        next()
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
