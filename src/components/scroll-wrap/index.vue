<template>
  <van-pull-refresh
    v-model="refreshInfo.isRefreshing"
    @refresh="onRefresh"
    class="refresh_ware"
  >
    <van-list
      v-model="refreshInfo.loading"
      offset="150"
      :finished="refreshInfo.isFinished"
      :immediate-check="immediateCheck"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <slot name="content"></slot>
    </van-list>
  </van-pull-refresh>
</template>

<script>
export default {
  name: 'Scroll-Wrap',
  props: {
    refreshInfo: {
      type: Object,
      default: () => { }
    },
    immediateCheck: {
      type: Boolean,
      default: true
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
  methods: {
    // 加载更多
    onLoad() {
      this.$emit("pullingUp")
    },

    // 下拉刷新
    onRefresh() {
      this.refreshInfo.isFinished = false
      this.refreshInfo.loading = true
      this.$emit("pullingDown")
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.refresh_ware {
  min-height: 100%;
}
</style>
