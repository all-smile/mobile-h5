<template>
  <div id="app">
    <!-- <public-controls class="appHeader"></public-controls> -->
    <div class="appBody">
      <!-- <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view> -->
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { Toast } from 'vant'
import PublicControls from '@/base-components/PublicControls/index'
export default {
  name: 'App',
  props: {},
  components: {
    'public-controls': PublicControls,
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {},
  created() {
  },
  mounted() {
    // 将所有 Toast 的展示时长设置为 2000 毫秒
    Toast.setDefaultOptions({ duration: 2000 });
  },
  methods: {
  },
  updated() { },
  beforeDestroy() {
  }
}
</script>

<style lang="less">
@import "~@/assets/less/reset.less";
</style>
<style lang="less">
#app {
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  background: #fff;
  flex-direction: column;
  .appHeader {
    height: 0.41rem;
  }
  .appBody {
    flex: 1;
    position: relative;
  }
}
</style>
