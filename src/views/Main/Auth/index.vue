<template>
    <div class="auth">
        <!-- <phone-verify v-if="processStatus == 'verifying'" :processStatus.sync="processStatus" :userInfo="userInfo"></phone-verify> -->
        <!-- <separate-account
            v-if="processStatus == 'verified'"
            :processStatus.sync="processStatus"
        ></separate-account> -->
        <!-- <confirm-info v-if="processStatus == 'verified'"></confirm-info> -->
        <!-- <refuse-reason v-if="processStatus == 'refuse'"></refuse-reason> -->
        <!-- <tips></tips> -->
        <!-- <face-verify v-if="processStatus == 'face'"></face-verify> -->
        <!-- <pay-detail v-if="processStatus == 'detail'"></pay-detail> -->
        <!-- <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view> -->
        <router-view></router-view>
    </div>
</template>

<script>
import { setItem, getItem } from '@/libs/utils.js'
import { mapGetters, mapActions, mapMutations } from 'vuex'
const PhoneVerify = () => import('./phone-verify/index')
const SeparateAccount = () => import('./separate-account/index')
const RefuseReason = () => import('./refuse-reason/index')
const Tips = () => import('./tips/index')
const FaceVerify = () => import('./face-verify/index')
const ConfirmInfo = () => import('./confirm-info/index')
const PayDetail = () => import('./pay-detail/index')
export default {
    name: 'Auth',
    props: {},
    components: {
        'phone-verify': PhoneVerify,
        'separate-account': SeparateAccount,
        'refuse-reason': RefuseReason,
        'tips': Tips,
        'face-verify': FaceVerify,
        'confirm-info': ConfirmInfo,
        'pay-detail': PayDetail
    },
    data() {
        return {
            // processStatus: 'verifying' // 进度： verifying-正在验证， verified-验证通过， refuse-拒绝, face-人脸识别
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'processStatus',
            'payOrderId',
            'platform'
        ]),
        ...mapGetters('auth', [
            'customerInfo'
        ]),
    },
    watch: {},
    created() {
        // 解决刷新页面丢失vuex数据(适用于少量数据的情况)
        //在页面加载时读取sessionStorage里的状态信息
        // if (getItem('ZYDP__STORE')) {
        //     this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(getItem('ZYDP__STORE'))));
        // }
        // //在页面刷新时将vuex里的信息保存到sessionStorage里
        // window.addEventListener('beforeunload', () => {
        //     setItem('ZYDP__STORE', JSON.stringify(this.$store.state));
        // });
        this.init()
    },
    mounted() {
        // this.$EventBus.on('testEventBus', (res) => {
        //     alert('res:' + res.text)
        // })
        // this.$EventBus.off('testEventBus')
    },
    methods: {
        ...mapMutations(['SET_PAYORDERID', 'SET_PLATFORM']),
        ...mapActions(['setUserInfo']),
        ...mapActions('auth', ['set_customerInfo']),
        init() {
            const { query = {} } = this.$route || {}
            const id = query?.payOrderId || getItem('ZY__payOrderId')
            const platform = query?.platform || getItem('ZY__platform')
            if (id) {
                this.SET_PAYORDERID(id)
                setItem('ZY__payOrderId', id)
            }
            if (platform) {
                this.SET_PLATFORM(platform)
                setItem('ZY__platform', platform)
            }
            // this.setUserInfo() // 设置个人信息
            this.set_customerInfo()
        },
        goBack() {
            window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
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
