<template>
    <div class="ware">
        金融创新部H5前端架构
        <div>
            <van-button type="primary">主要按钮</van-button>
            <van-button type="info">信息按钮</van-button>
        </div>
        <van-cell-group>
            <van-cell
                title="单元格"
                value="内容"
            ></van-cell>
            <van-cell
                title="单元格"
                value="内容"
            ></van-cell>
        </van-cell-group>
        <router-link to="/auth">授权</router-link>
        <van-row>
            <van-col span="8">span: 8</van-col>
            <van-col span="8">span: 8</van-col>
            <van-col span="8">span: 8</van-col>
        </van-row>
    </div>
</template>

<script>
// import { Button, Cell, CellGroup } from 'vant';
export default {
    name: 'Home',
    props: {},
    components: {
        // 'van-button': Button,
        // 'van-cell-group': CellGroup,
        // 'van-cell': Cell
    },
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() { },
    mounted() {
        console.log('Global', this.Global)
        // console.log('api---', this.Global.api.getListAPI())
        this.initData()
    },
    methods: {
        async initData() {
            try {
                let res = await this.Global.api.getListAPI()
                console.log(res)
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
