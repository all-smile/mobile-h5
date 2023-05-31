<template>
  <div class="form-control">
    <div
      v-for="(item, index) in fieldList"
      :key="index"
      class="list-item"
      :style="{ width: item.formWidth }"
    >
      <div v-show="!item.noShow">
        <component
          v-bind:is="`control-${item.controlName}`"
          :itemData="item"
          :nameId="item.fieldName"
          ref="control"
          @handleRelatedFields="handleRelatedFields"
        ></component>
      </div>
    </div>
  </div>
</template>

<script>
import TextControl from "@/base-components/Control/Text";
import Controls from "@/base-components/Control/index.js";
export default {
  name: 'Form-Control',
  props: {
    // 控件字段信息
    fieldList: {
      type: Array,
      default: () => [
        {
          controlName: "Text",
          fieldName: "approvalOption",
          fieldLabel: true,
          controlData: "",
          defaultValue: "",
          defaultOptions: "",
          labelWidth: "0.85rem",
          labelPosition: "right",
          isNotNull: 0,
          placeholder: "",
          readonly: false, // 是否禁用 （下拉框没有只读，采取禁用方式） / 只读
          clearable: false, // 是否显示清除按钮 （日期字段）
          editable: false, // 是否可以输入 (日期字段)
          multiple: true, // 是否可以多选 (文件上传)
          noShow: true, // 不显示当前字段
        }
      ]
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
  components: { TextControl, ...Controls },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.initFieldData()
  },
  methods: {
    initFieldData(objParams = {}) {
      this.fieldList.forEach((oriItem) => {
        if (this.$refs.control) {
          this.$refs.control.forEach(item => {
            if (oriItem.fieldName === item.$attrs.nameId) {
              // 初始化字段参数， 和一些特殊处理
              if (Object.prototype.hasOwnProperty.call(objParams, item.$attrs.nameId)) {
                if (item.initVal) {
                  item.initVal(objParams)
                }
              } else {
                if (item.updata) {
                  item.updata()
                }
              }
            }
          })
        }
      })
    },

    // 相关字段逻辑处理
    handleRelatedFields(data, fieldStr) {
      const fieldList = fieldStr.split(';')
      fieldList.forEach(ele => {
        if (ele != '') {
          const fieldItems = ele.split('=')
          if (fieldItems[0] && fieldItems[1] && this.$refs.control) {
            this.$refs.control.forEach(item => {
              if (item.$attrs.nameId === fieldItems[0]) {
                /**
                 * 审批处理
                 * 审批结果-operResult=AGREE ? 审批意见-operOpinoin-不显示， 显示下一审批人 -userId
                 * 审批结果-operResult=REFUSE ? 审批意见-operOpinoin-显示， 不显示下一审批人 -userId
                 * operOpinoin 字段单独处理，需要修改的是 noShow 值
                */
                switch (fieldItems[0]) {
                  case operOpinoin:
                    if (data.operResult === "AGREE") {
                      item.itemData.noShow = true;
                      if (item.initVal) {
                        item.initVal({
                          [item.$attrs.nameId]: ""
                        })
                      }
                    } else {
                      item.itemData.noShow = false;
                    }
                    break;
                  case userId:
                    if (data.operResult === "REFUSE") {
                      item.itemData.noShow = true;
                      if (item.initVal) {
                        item.initVal({
                          [item.$attrs.nameId]: ""
                        })
                      }
                    } else {
                      if (this.isLast) {
                        item.itemData.noShow = true;
                      } else {
                        item.itemData.noShow = false;
                      }
                    }
                    break;
                  default:
                    item.initVal({
                      [item.$attrs.nameId]: data[fieldItems[1]]
                    })
                    break;
                }
              }
            })
          }
        }
      })
    },

    // submit
    async doSubmit(cb = null) {
      if (this.$refs.control) {
        try {
          // 记录组件校验通过的个数
          let passCount = 0;
          // 页面显示的组件的个数
          const showControlNum = this.fieldList.filter(item => item.noShow === false).length
          this.$refs.control.forEach(item => {
            if (!item.itemData.noShow) {
              item.verifyForm()
                .then(res => {
                  // 校验通过
                  ++passCount;
                  if (passCount === showControlNum) {
                    // 都校验通过， 才会触发回调
                    cb && cb(true)
                  }
                })
                .catch(err => {
                  // 校验未通过
                  cb && cb(false)
                })
            }
          })
        } catch (err) {
          console.log('err===>', err);
        }
      }
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
</style>
