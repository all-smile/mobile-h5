<template>
    <div class="Header">
        <div class="Header-back">
            <img class="Header-back-icon" @click="toBack()" v-show="show" :src="backIcon" alt="img">
        </div>
        <div class="Header-title">{{headerTitle}}</div>
        <div class="Header-operat">
            <div v-if="menuState&&menuState.show" @click="menuClick()">
                <template v-if="menuState.icon">
                    <i class="iconfont" :class="menuState.icon"></i>
                </template>
                <template v-else>{{menuState.title}}</template>
            </div>
        </div>
    </div>
</template>
<script>

import { mapGetters } from 'vuex'
export default {
    name: 'Header',
    data() {
        return {
            backIcon: require('./img/back_icon.png'),
            show: true,
            menuState: '',
        }
    },
    computed: {
        ...mapGetters(['headerTitle'])
    },
    created() {
    },
    mounted() {
        this.backShow()
    },
    methods: {
        // menuClick() {
        //     let { actions } = this.menuState
        //     actions.forEach(action => {
        //         action()
        //     })
        // },

        toBack() {
            console.log('toBack')
            this.$router.back(-1)
        },
        backShow() {
            if (this.$route.path.indexOf('/main/auth/phoneVerify') != -1) {
                this.show = false
            } else if (!this.show) {
                this.show = true
            }
        }
    },
    watch: {
        $route(to, from) {
            if (to) {
                this.backShow()
            }
        }
    },
    components: {

    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.Header {
    width: 100%;
    height: 0.41rem;
    line-height: 0.41rem;
    text-align: center;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    color: white;
    display: flex;
    overflow: hidden;
    padding-left: 0.1rem;
    padding-right: 0.1rem;
    font-size: 0.18rem;
    border-bottom: 1px solid #eaeaea;
    color: #000;
    &-title {
        flex: 1;
        padding-left: 0.04rem;
        padding-right: 0.04rem;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.18rem;
    }
    &-back {
        color: #000;
        width: 0.44rem;
        overflow: hidden;
        .iconfont {
            font-size: 0.28rem;
        }
        &-icon {
            display: inline-block;
            vertical-align: middle;
            width: 0.11rem;
            height: 0.21rem;
        }
    }
    &-operat {
        color: #000;
        width: 0.44rem;
        overflow: hidden;
        text-overflow: ellipsis;
        .iconfont {
            font-size: 0.28rem;
        }
    }
}
</style>
