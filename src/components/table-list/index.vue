<template>
  <div class="table text-field">
    <!-- 表头 -->
    <van-row type="flex" class="table-header">
      <van-col
        v-for="(item, index) in fieldList"
        :key="index"
        :style="{ width: `${100 / fieldList.length}%` }"
        >{{ item.fieldLabel }}</van-col
      >
    </van-row>
    <!-- 内容单元格 -->
    <div class="table-body">
      <van-row type="flex" v-for="(record, i) in recordsList" :key="i">
        <van-col
          v-for="(item, index) in fieldList"
          :key="index"
          :style="{ width: `${100 / fieldList.length}%` }"
        >
          <RenderDom
            :vNode="returnValue(record[item.fieldName], item)"
          ></RenderDom>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
import { isObject } from "@/libs/utils.js";
import { formatTimeLint, toThousandFilterNum } from "@/filters/index.js";
import RenderDom from "./RenderDom";
export default {
  name: 'Table-List',
  props: {
    fieldList: {
      type: Array,
      default: () => []
    },
    recordsList: {
      type: Array,
      default: () => []
    }
  },
  components: { RenderDom },
  data() {
    return {
      lints: {
        formatTimeLint,
        toThousandFilterNum
      }
    }
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    returnValue(val, { fieldName, formatName, formatOption }) {
      // 格式化
      if (formatName === "entrustedPaymentId") {
        // 关联入库单
        return <span style="color: #0079f5">查看</span>
      }
      return val;
    },

    handleClick(item, val) {
      console.log('handleClick===>', item, val);
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@borderColor: #ccc;
.vanCol {
  border-left: 1px solid @borderColor;
  display: flex;
  align-items: center;
  justify-content: center;
  word-break: break-word;
  &:first-child {
    border-left: none;
  }
}
.table {
  border-collapse: collapse;
  text-align: center;
  margin: 0 0.16rem 0.1rem !important;
}
.table-header {
  border: 1px solid @borderColor;
  .van-col {
    .vanCol;
  }
}
.table-body {
  border: 1px solid @borderColor;
  border-top: none;
  .van-row {
    border-bottom: 1px solid @borderColor;
    &:last-child {
      border-bottom: none;
    }
  }
  .van-col {
    .vanCol;
  }
}
</style>
