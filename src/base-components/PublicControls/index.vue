<template>
    <div class="PublicControls">
        <Header></Header>
    </div>
</template>
<script>
import Header from './Header/index'

export default {
    name: 'PublicControls',
    data() {
        return {
        }
    },
    created() {
    },
    methods: {
    },
    components: {
        'Header': Header
    }
}
</script>
<style lang='less' rel='stylesheet/less' scoped>
.PublicControls {
    z-index: 9000;
}
</style>
