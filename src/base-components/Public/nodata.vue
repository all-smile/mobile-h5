<template>
    <div class="nodata">
        <!-- <img
            v-if="img"
            :src="getSrc()"
        >
        <div>{{title}}</div> -->
        <van-empty :description="title">
            <span v-if="showReload">
                <van-icon class="align-mid" name="replay" />
                <span class="align-mid">重新加载</span>
            </span>
        </van-empty>
    </div>
</template>
<script>
export default {
    name: 'nodata',
    props: {
        img: {
            type: String,
            default: 'noData'
        },
        title: {
            type: String,
            default: '暂无数据'
        },
        showReload: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    methods: {
        getSrc() {
            return '/images/noData/' + this.img + '.png'
        }
    },
    components: {

    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.nodata {
    position: relative;
    text-align: center;
    padding: 10px 0 10px;
    color: #909399;
    // font-size: 14px;
    > img {
        max-width: 150px;
    }
    > div {
        margin: 10px 0;
    }
}
</style>
