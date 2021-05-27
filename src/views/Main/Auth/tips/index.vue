<template>
    <div class="tips">
        <img class="tips__icon" :src="status === 'Y' ? successIcon : errorIcon" alt="img">
        <template v-if="status === 'N'">
            <h3 class="tips__title">人脸识别失败</h3>
            <p class="tips__ps">请重新进行人脸识别</p>
            <div class="tips__btn-outer">
                <van-button class="tips__btn" @click="backToVerifyFace">返回</van-button>
            </div>
        </template>
        <template v-else>
            <h3 class="tips__title">授权成功</h3>
            <p class="tips__ps">{{successTips.DPLM}}</p>
        </template>
    </div>
</template>

<script>

export default {
    name: 'Tips',
    props: {},
    components: {},
    data() {
        return {
            status: 'N', // Y-成功， N-失败
            successIcon: require('./img/success.png'),
            errorIcon: require('./img/error.png'),
            /* 
            DPSQ("DPSQ","“闪签”律师平台资金监管项目"),
            DPPM("DPPM","“爆品趣拍”平台保证金存管项目"),
            DPLM("DPLM","“灵猫”灵活用工平台项目"),
            DPHQ("DPHQ","“伴零工”灵活用工平台项目");
             */
            successTips: {
                DPSQ: '预计3个工作日内审核完成',
                DPLM: '实际到账以收款银行为准'
            }
        }
    },
    computed: {},
    watch: {},
    created() {
        this.setHeaderTitle('提示')
    },
    mounted() { },
    methods: {
        open(flag) {
            this.status = flag ? 'Y' : 'N'
        },
        backToVerifyFace() {
            this.$emit('close', 'reVerifyFace')
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
