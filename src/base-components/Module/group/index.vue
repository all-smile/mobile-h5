<template>
  <div class="ware">
    <div v-for="(item, i) in itemData" :key="i">
      <!-- 分组 （放款预警-预警详情） -->
      <!-- 分割线 -->
      <van-divider v-if="itemData.length > 1"></van-divider>
      <div v-for="(groupItem, index) in groups" :key="index">
        <!-- 一个组下的文字组+表格组 -->
        <component
          ref="control"
          :fieldList="groupItem.fieldList"
          :itemData="item[groupItem.outerFieldName]"
          :recordsList="item[groupItem.outerFieldName]"
          :fieldType="groupItem.fieldType"
          v-bind:is="`component-${groupItem.fieldType || 'text'}`"
        ></component>
        <!-- :skipVerify="groupItem.skipVerify"
        :modelName="groupItem.modelName"
        :isLast="isLast" -->
      </div>
    </div>
  </div>
</template>

<script>
import ComponentUnit from "../index.js";
export default {
  name: 'Group',
  props: {
    groups: {
      type: Array,
      default: () => []
    },
    itemData: {
      type: Array,
      default: () => []
    }
  },
  components: { ...ComponentUnit },
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
@import "./zh-cn.less";
@import "./en.less";
</style>
