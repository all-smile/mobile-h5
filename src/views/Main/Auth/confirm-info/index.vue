<template>
    <div class="confirm-info">
        <div class="top_intro">
            <img class="intro__img" :src="clasp" alt="img">
            <p class="top_intro-title">{{orderInfo.companyName || '--'}}</p>
            <div class="top_intro-money">
                <span class="top_intro-sub">可用余额</span>
                &nbsp;&nbsp;
                <span class="top_intro-sub">{{ParseMoney(orderInfo.acountAmt || 0, 2)}}</span>
                <span class="top_intro-sub">元</span>
                <span class="top_intro-sub top_intro-red" v-if="isTipsErr">余额不足</span>
            </div>
        </div>
        <div class="mid_info">
            <p class="mid_info-top">应付总金额</p>
            <p>
                <span class="mid_info-money">{{ParseMoney(orderInfo.payAmtSum || 0, 2)}}</span>
                <span class="mid_info-unit">元</span>
            </p>
            <p>
                <span class="mid_info-l">扣缴总金额</span>
                <span class="mid_info-r">{{`${ParseMoney(orderInfo.deductionAmtSum || 0, 2)}元`}}</span>
            </p>
            <p>
                <span class="mid_info-l">实发总金额</span>
                <span class="mid_info-r">{{`${ParseMoney(orderInfo.actualAmtSum || 0)}元`}}</span>
            </p>
            <div class="mid_info-line"></div>
            <p>
                <span class="mid_info-l">申请时间</span>
                <span class="mid_info-r">{{orderInfo.applyData || '--'}}</span>
            </p>
            <p>
                <span class="mid_info-l">批次号</span>
                <span class="mid_info-r">{{orderInfo.payOrderId || '--'}}</span>
            </p>
        </div>
        <div class="bot_info">
            <p class="bot_info-title">应付笔数</p>
            <div class="bot_info-cont">
                <span class="bot_info-num align-bot">{{orderInfo.counts || 0}}</span>
                <span class="bot_info-unit align-bot">笔</span>
                <span class="bot_info-right align-bot" @click="viewDetail">
                    <span class="bot_info-right--word align-mid">查看明细</span>
                    <img class="bot_info-right--icon align-mid" :src="backIcon" alt="img">
                </span>
            </div>
        </div>
        <div class="bot_button">
            <van-button class="bot_button-refuse" @click="cancel">取消</van-button>
            <van-button class="bot_button-agree" @click="confirm">确认付款</van-button>
        </div>
    </div>
</template>

<script>
import { setItem } from '@/libs/utils.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'ConfirmInfo',
    props: {},
    components: {},
    data() {
        return {
            loading: true,
            clasp: require('./img/clasp.png'),
            backIcon: require('./img/back_icon.png'),
            // isTipsErr: false,
            orderInfo: {}
        }
    },
    computed: {
        ...mapGetters(['payOrderId']),
        isTipsErr() {
            let flag = false
            if (this.orderInfo && (parseFloat(this.orderInfo.payAmtSum) - parseFloat(this.orderInfo.acountAmt) > 0)) {
                flag = true
            }
            return flag
        }
    },
    watch: {},
    created() {
        this.setHeaderTitle('付款确认')
        this.initData()
    },
    mounted() { },
    methods: {
        ...mapMutations(['SET_PROCESSSTATUS']),
        async initData() {
            try {
                if (!this.payOrderId) {
                    this.$toast.fail('订单号缺失')
                    setTimeout(() => {
                        this.$router.replace('/main/nopage')
                    }, 2000)
                    return
                }
                let res = await this.Global.api.getOrderPayInfo({
                    payOrderId: this.payOrderId
                })
                if (res.status === this.Global.RES_OK) {
                    this.orderInfo = res.signedValue || {}
                    if (this.orderInfo.counts) {
                        setItem('ZY__payCounts', this.orderInfo.counts)
                    }
                } else {
                    this.$toast.fail(res.message)
                }
                console.log('res:', res)
            } catch (err) {
                console.log(err)
            }
        },
        cancel() {
            this.$dialog.confirm({
                title: '取消付款',
                message: '取消后将无法撤回，确认取消吗？',
            })
                .then(() => {
                    // on confirm
                    this.$router.push('/main/auth/refuseReason')
                })
                .catch(() => {
                    // on cancel
                });
        },
        confirm() {
            this.$dialog.confirm({
                title: '确认付款',
                message: '付款后将无法撤回，确认付款吗？',
            })
                .then(() => {
                    // on confirm
                    this.$router.push('/main/auth/faceVerify')
                })
                .catch(() => {
                    // on cancel
                });
        },
        viewDetail() {
            if (this.orderInfo.counts > 0) {
                this.SET_PROCESSSTATUS('detail')
                this.$router.push('/main/auth/payDetail')
            }
        }
    },
    updated() { },
    beforeDestroy() { }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
