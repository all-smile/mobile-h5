<template>
    <div class="errordata">
        <van-empty image="error" :description="title" />
    </div>
</template>

<script>
export default {
    name: 'errordata',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    components: {},
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() { },
    mounted() { },
    methods: {},
    updated() { },
    beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
</style>
