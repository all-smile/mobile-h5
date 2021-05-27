<template>
    <div class="separateAccount">
        <div class="caseIntro">
            <img class="intro__img" :src="clasp" alt="img">
            <p class="intro__caseId">{{`案件号${caseId}`}}</p>
            <p class="intro__money">
                <span class="intro__money-num">{{ParseMoney(money, 3)}}</span>
                <span class="intro__money-unit">元</span>
            </p>
            <p class="intro__caseName">{{caseName}}</p>
        </div>
        <div class="caseInfo">
            <van-row>
                <van-col class="caseInfo__left van-ellipsis" span="8">委托律所</van-col>
                <van-col class="caseInfo__right van-ellipsis" span="16">大河律师事务所 </van-col>
            </van-row>
            <van-row>
                <van-col class="caseInfo__left van-ellipsis" span="8">原告</van-col>
                <van-col class="caseInfo__right van-ellipsis" span="16">李强</van-col>
            </van-row>
            <van-row>
                <van-col class="caseInfo__left van-ellipsis" span="8">被告</van-col>
                <van-col class="caseInfo__right van-ellipsis" span="16">河南xx工业集团</van-col>
            </van-row>
            <van-row>
                <van-col class="caseInfo__left van-ellipsis" span="8">分账发起时间</van-col>
                <van-col class="caseInfo__right van-ellipsis" span="16">2021-03-14 15:32:15</van-col>
            </van-row>
        </div>
        <div class="caseCost">
            <div class="caseCost__part">
                <h3 class="caseCost__part-num">{{`-&nbsp;${ParseMoney(pay)}`}}</h3>
                <h4 class="caseCost__part-words">元&nbsp;律师费</h4>
                <p class="caseCost__part-desc">以上费用包含：律师分账金（分账总额*5%+3000元固定金额）、平台服务费（分账总额*1%），固定金额包括律师垫付的费用。</p>
            </div>
            <div class="caseCost__part">
                <h4 class="caseCost__part-words2">原告实际到账&nbsp;</h4>
                <h3 class="caseCost__part-num2">{{`${ParseMoney(money - pay)}元`}}</h3>
                <p class="caseCost__part-desc">授权通过后，此笔款项将自动提现至您绑定的银行卡中，请确认该卡可以正常使用。</p>
            </div>
        </div>
        <div class="caseMyCard">
            <p class="caseMyCard__name">李强</p>
            <p class="caseMyCard__cardInfo">6222 50** **** 8888 中原银行</p>
            <p class="caseMyCard__phone">手机号 18602839989</p>
        </div>
        <div class="caseBtn">
            <van-button class="caseBtn__refuse" @click="refuse">拒绝</van-button>
            <van-button class="caseBtn__agree" @click="agree">同意分账</van-button>
            <!-- <span
                class="caseBtn__refuse"
                @click="refuse"
            >拒绝</span>
            <span
                class="caseBtn__agree"
                @click="agree"
            >同意分账</span> -->
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: 'SeparateAccount',
    props: {},
    components: {},
    data() {
        return {
            clasp: require('./img/clasp.png'),
            caseId: '2323445',
            caseName: '李强诉河南xx工业集团追索合同款',
            money: 150008000.896,
            pay: 8000,
        }
    },
    computed: {},
    watch: {},
    created() {
        this.setHeaderTitle('分账信息')
    },
    mounted() { },
    methods: {
        ...mapMutations(['SET_PROCESSSTATUS']),
        refuse() {
            console.log(123)
            this.SET_PROCESSSTATUS('refuse')
            // this.$emit('update:processStatus', 'refuse')
        },
        agree() {
            this.SET_PROCESSSTATUS('face')
            // this.$emit('update:processStatus', 'face')
        }
    },
    updated() { },
    beforeDestroy() { }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
