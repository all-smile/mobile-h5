<template>
    <div class="refuseReason">
        <van-field class="refuseDesc" v-model="message" rows="5" :autosize={maxHeight:120} required type="textarea" maxlength="500" placeholder="请填写拒绝原因。" show-word-limit />
        <van-button class="refuseBtn" @click="refuse">提交</van-button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'RefuseReason',
    props: {},
    components: {},
    data() {
        return {
            message: ''
        }
    },
    computed: {
        ...mapGetters(['payOrderId']),
    },
    watch: {},
    created() {
        this.setHeaderTitle('取消原因')
    },
    mounted() { },
    methods: {
        async refuse() {
            try {

                let res = await this.Global.api.cancelPay({
                    orderId: this.payOrderId,
                    reason: this.message
                })
                console.log(res)
                if (res.status === this.Global.RES_OK) {
                    this.$dialog.confirm({
                        message: '提交成功，付款已取消',
                        showCancelButton: false,
                        confirmButtonText: '关闭'
                    })
                        .then(() => {
                            // on confirm
                        })
                } else {
                    this.$toast.fail(res.message)
                }
            } catch (err) {
                console.log(err)
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
