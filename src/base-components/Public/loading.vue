<template>
    <div class="loadingWrap">
        <template v-if="!full">
            <div class="loading" :style="{width:size || 'auto'}">
                <van-loading type="spinner" color="black" :size="size" style="margin: 0 auto;" />
            </div>
        </template>
        <div v-else class="fullScreen">
            <div class="loading" :style="{width:size || 'auto'}">
                <van-loading type="spinner" color="black" :size="size" style="margin: 0 auto;" />
                <span v-if="title !== ''">{{title}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'custom-loading',
    props: {
        size: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        full: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    methods: {
    },
    components: {
    }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.loadingWrap {
    position: relative;
    .loading {
        width: 32px;
        margin: 15px auto;
        > span {
            display: inline-block;
            color: #909399;
            padding-top: 5px;
        }
    }
    .fullScreen {
        // border:1px solid red;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
