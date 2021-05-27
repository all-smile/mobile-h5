<template>
    <div class="pay-detail">
        <div class="table-header-outer">
            <van-row class="table-header">
                <van-col class="ellipsis" span="2">序号</van-col>
                <van-col class="ellipsis" span="2">姓名</van-col>
                <van-col class="ellipsis" span="5">银行卡号</van-col>
                <van-col class="ellipsis" span="4">应付金额</van-col>
                <van-col class="ellipsis" span="4">实发金额</van-col>
                <van-col class="ellipsis" span="3">扣缴金额</van-col>
                <van-col class="ellipsis" span="4">摘要</van-col>
            </van-row>
        </div>
        <van-list v-model="loading" :finished="finished" :loading-text='loadingText' :finished-text="finishedText" offset="50" immediate-check @load="onLoad">
            <div class="table-body-outer" v-if="listData.length > 0">
                <template v-for="(item, index) in listData">
                    <van-row class="table-body" :key="index+item.payCard">
                        <van-col class="ellipsis" span="2">{{index+1}}</van-col>
                        <van-col class="ellipsis" span="2">{{item.payName}}</van-col>
                        <van-col class="ellipsis" span="5">{{item.payCard}}</van-col>
                        <van-col class="ellipsis" span="4">{{item.payAmt}}</van-col>
                        <van-col class="ellipsis" span="4">{{item.actualAmt}}</van-col>
                        <van-col class="ellipsis" span="3">{{item.deductionAmt}}</van-col>
                        <van-col class="ellipsis" span="4">{{item.scrap}}</van-col>
                    </van-row>
                </template>
            </div>
            <nodata v-else-if="!loading && listData.length == 0"></nodata>
        </van-list>
    </div>
</template>

<script>
import { getItem, isArray } from '@/libs/utils.js'
import { mapGetters } from 'vuex'
export default {
    name: 'PayDetail',
    props: {},
    components: {},
    data() {
        return {
            loading: false, // 加载状态
            finished: false, // 是否加载完成，完成之后不再触发load
            loadingText: '', // 自带提示文字不显示
            finishedText: '',
            pageNum: 0,
            pageSize: 20,
            listData: [],
            totalCount: getItem('ZY__payCounts') || 0
        }
    },
    computed: {
        ...mapGetters(['payOrderId'])
    },
    watch: {},
    created() {
        this.setHeaderTitle('付款明细')
        // this.getListData()
    },
    mounted() { },
    methods: {
        async getListData() {
            try {
                this.pageNum++
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: false,
                    loadingType: 'spinner',
                })
                console.log('this.pageNum', this.pageNum)
                // 后端接口需要传totalCount？？？
                let res = await this.Global.api.getOrderPayList({
                    currPage: this.pageNum,
                    orderId: this.payOrderId,
                    pageSize: this.pageSize,
                    totalCount: this.totalCount
                })
                if (res.status === this.Global.RES_OK) {
                    this.loading = false
                    setTimeout(() => {
                        this.$toast.clear()
                    }, 200)
                    if (res.signedValue && res.signedValue.list && isArray(res.signedValue.list)) {
                        this.listData.push(...res.signedValue.list)
                    }
                } else {
                    this.loading = false
                    this.$toast.clear()
                    this.finished = true
                    this.$toast.fail(res.message)
                }
            } catch (err) {
                this.loading = false
                this.$toast.clear()
                this.finished = true
                console.log(err)
            }
        },
        async onLoad() {
            try {
                console.log('load--------------')
                if (this.listData.length - this.totalCount >= 0) {
                    this.finished = true
                    this.$toast('没有更多了')
                    return
                }
                // 请求接口
                this.getListData()
                // this.loadingText = '';
                // this.finishedText = '';
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
