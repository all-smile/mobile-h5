<template>
  <table-list :fieldList="fieldList" :recordsList="recordsList"></table-list>
</template>

<script>
import TableList from "@/components/table-list";
export default {
  name: 'Table-Show',
  props: {
    fieldList: {
      type: Array,
      default: () => []
    },
    /**
     * 表格数据
     * 支付信息- 接口获取
     * 放款预警-预警详情表格数据传入
     */
    recordsList: {
      type: Array,
      default: () => []
    },
  },
  components: { TableList },
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
