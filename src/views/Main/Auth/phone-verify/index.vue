<template>
    <div class="phoneVerify">
        <div class="phoneVerify__phone">
            <p class="phoneVerify__phone-num">{{userInfo.phone}}</p>
            <span class="phoneVerify__phone-ps">我们将发送验证码至您的预留手机号</span>
        </div>
        <div class="phoneVerify__field">
            <van-field class="phoneVerify__sms" v-model="sms" center clearable clear-trigger='always' placeholder="请输入验证码">
                <template #extra>
                    <span v-if="!isSend" class="sms_btn" @click="getSms">获取验证码</span>
                    <span v-else class="sms_reBtn">{{`${countDown}s重新获取`}}</span>
                </template>
            </van-field>
            <p v-if="errorMessage" class="phoneVerify__field-err">{{errorMessage}}</p>
        </div>
        <van-button :class="!sms ? 'phoneVerify__next': 'phoneVerify__next-active'" :disabled="!sms" type="primary" :loading="isLoading" loading-text="下一步" @click="phoneVerifyNext">下一步</van-button>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'PhoneVerify',
    props: {
    },
    components: {},
    data() {
        return {
            isLoading: false,
            sms: '',
            errorMessage: '', // 验证码错误
            isSend: false, // 是否已发送验证码
            countDown: 60, // 倒计时
            timer: null,
        }
    },
    computed: {
        ...mapGetters([
            'userInfo',
        ]),
    },
    watch: {},
    created() {
        this.setHeaderTitle('手机号验证')
    },
    mounted() {
    },
    methods: {
        ...mapMutations(['SET_PROCESSSTATUS']),
        async getSms() {
            try {
                // 调用获取验证码接口
                let res = await this.Global.api.getPhoneSms({
                    userId: '',
                    warrantyUserId: '',
                    phone: '',
                    platform: ''
                })
                console.log(res)
                this.isSend = true
                this.timer && clearInterval(this.timer)
                this.timer = setInterval(() => {
                    this.countDown--
                    if (this.countDown <= 0) {
                        this.isSend = false
                        clearInterval(this.timer)
                        this.countDown = 60
                    }
                }, 1000);
                console.log('sms')
                // this.$EventBus.emit('testEventBus', {
                //     'text': '测试eventbus'
                // })
            } catch (err) {
                console.log(err)
            }
        },
        async phoneVerifyNext() {
            try {
                // 校验验证码是否正确
                let res = await this.Global.api.authLogin({
                    userId: '',
                    warrantyUserId: '',
                    phone: '',
                    platform: '',
                    code: ''
                })
                console.log('res', res)
                this.isLoading = true
                setTimeout(() => {
                    this.$emit('update:processStatus', 'verified')
                    this.SET_PROCESSSTATUS('verified')
                    this.$router.push('/main/auth/confirmInfo')
                }, 1000)
            } catch (err) {
                console.log(err)
            }
        }
    },
    updated() { },
    beforeDestroy() {
        this.timer && clearInterval(this.timer)
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
