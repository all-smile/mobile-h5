<template>
  <div>
    <div class="text-field text-cont" v-if="fieldInfo.fieldType !== 'title'">
      <span class="text-label">{{ fieldInfo.fieldLabel }}</span>
      <span class="text-main">{{ pickUpValue }}</span>
    </div>
    <!-- 分组编号 抵质押物 预警条目 -->
    <div class="text-field text-title" v-else>
      {{ `${fieldInfo.fieldLabel} ${pickUpValue}` }}
    </div>
  </div>
</template>

<script>
import { isObject } from "@/libs/utils.js";
import { formatTimeLint, toThousandFilterNum } from "@/filters/index.js";
export default {
  name: 'ControlShow-Text',
  props: {
    itemData: {
      type: Object,
      default: () => { }
    },
    fieldInfo: {
      type: Object,
      default: () => { }
    },
    // 信息分组的 key 值
    outerFieldName: {
      type: String,
      default: ""
    }
  },
  components: {},
  data() {
    return {
      lints: {
        formatTimeLint,
        toThousandFilterNum
      }
    }
  },
  computed: {
    // 提取数据
    pickUpValue() {
      /**
       * 放款预警-预警详情（多条数据） 在 text-show 组件处理数据 （上游数据处理）
       * 这里只处理两种情况， 以保证下游数据的统一， 一种是只有 outerFieldName 字段， 另一种是 key 有多层。
       * 写 (outerFieldName: "ewLoanDetailDO") 比用 . 写key的方式快， (outerFieldName: "ewLoanDetailDO.bebeficiaryName")
      */
      let val = ""
      let obj = this.itemData
      const { fieldName, formatName, formatOption } = this.fieldInfo
      const keys = fieldName.split('.')
      // 判断 fieldName 是否存在层级，如果有则循环取值
      if (keys.length > 1) {
        keys.forEach(k => {
          const tmp = obj[k];
          if (isObject(tmp)) {
            obj = tmp;
          } else {
            val = tmp
          }
        })
      } else {
        // 如果 fieldName 不存在层级， 判断是否存在上层字段
        // 目前业务数据只有两个维度， 应该没有扩展的可能
        if (this.outerFieldName) {
          val = obj[this.outerFieldName][fieldName]
        } else {
          val = obj[fieldName]
        }
      }

      // 格式化
      if (formatName && this.lints[formatName]) {
        val = this.lints[formatName](val, formatOption)
      }
      return val;
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
.text-cont {
  display: flex;
}
.text-title {
  color: #5a93d6;
  position: relative;
  &::before {
    content: "";
    display: inline-block;
    position: absolute;
    left: 10px;
    height: 0.22rem;
    width: 2px;
    background: #5a93d6;
  }
}
</style>
