<template>
  <div>
    <template v-if="isGroup">
      <!-- 提货 - 抵质押物编号 -->
      <div v-for="(info, index) in itemData[outerFieldName]" :key="index">
        <!-- 分割线 -->
        <van-divider></van-divider>
        <template v-for="(item, index) in fieldList">
          <control-text
            v-show="!item.noShow"
            :itemData="info"
            :fieldInfo="item"
            :key="index"
            :isLast="isLast"
          ></control-text>
        </template>
      </div>
    </template>
    <template v-else>
      <template v-for="(item, index) in fieldList">
        <control-text
          v-show="!item.noShow"
          :itemData="itemData"
          :outerFieldName="outerFieldName"
          :fieldInfo="item"
          :key="index"
          :isLast="isLast"
        ></control-text>
      </template>
    </template>
  </div>
</template>

<script>
import ControlText from "@/base-components/ControlShow/Text";
export default {
  name: 'Text-Show',
  props: {
    fieldList: {
      type: Array,
      default: () => []
    },
    // 信息分组的 key 值
    outerFieldName: {
      type: String,
      default: ''
    },
    itemData: {
      type: Object,
      default: () => { }
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  components: { ControlText },
  data() {
    return {}
  },
  computed: {
    // 根据数据结构，判断是否分组展示
    isGroup() {
      let flag = false;
      const data = this.itemData[this.outerFieldName]
      if (Array.isArray(data) && data.length > 0) {
        flag = true
      }
      return flag
    }
  },
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
