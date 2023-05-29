<template>
  <van-form
    ref="form"
    class="selectDownBox"
    :label-width="itemData.labelWidth"
    :label-position="itemData.labelPosition"
    validate-first
    scroll-to-error
    @failed="onFailed"
  >
    <van-field
      class="control"
      :required="itemData.isNotNull === 1 && !isDisable"
      :rules="rules"
      v-model="controlForm.value"
      :label="itemData.showLabel ? itemData.fieldLabel : ''"
      value-key="dictCode"
      :placeholder="!itemData.placeholder || `请选择${itemData.fieldLabel}`"
      :disabled="isDisable"
      readonly
      filterable
      clearable
      @click="showPicker = true"
      @change="handleChange"
    ></van-field>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="options"
        value-key="dictName"
        :default-index="selectIndex"
        item-height="0.3rem"
        @confirm="handleChange"
        @cancel="showPicker = false"
      ></van-picker>
    </van-popup>
  </van-form>
</template>

<script>
import { isObject, isString } from "@/libs/utils.js";
import { fetchApproveUserList } from "@/api/index.js";
export default {
  name: 'Control-Select',
  props: {
    itemData: {
      type: Object,
      default: () => { }
    }
  },
  components: {},
  data() {
    return {
      selectIndex: 0,
      apis: {
        fetchApproveUserList,
      },
      options: Object.freeze([]),
      tempItemData: this.itemData,
      controlForm: {
        value: ""
      },
      rules: [
        {
          required: this.itemData.isNotNull === 1 && !this.itemData.readonly,
          // message: this.itemData.placeholder || this.itemData.fieldLabel,
          trigger: "onBlur"
        }
      ],
      showPicker: false,
    }
  },
  computed: {
    isDisable() {
      let flag = false;
      if (this.tempItemData.readonly) {
        flag = true
      }
      return flag
    }
  },
  watch: {
  },
  created() { },
  mounted() {
    // 获取下一审批人数据
    if (this.itemData.remoteOtherApi) {
      // 普通接口获取业务数据写这里
      this.getApiData()
    }
  },
  methods: {
    // 移除校验
    clearVerify() {
      this.$refs.form && this.$refs.form.resetValidation()
    },

    // 初始化带入值
    initVal(obj = {}) {
      this.clearVerify()
      if (isObject(obj)) {
        let tmp = obj[this.itemData.fieldName]
        if (isString(tmp) && this.itemData.multiple) {
          // 多选
          tmp = tmp.split(',')
        }
        this.controlForm.value = tmp
        this.itemData.controlData = tmp
      }
    },

    // 初始化默认值
    updata() {
      this.clearVerify()
      this.controlForm.value = this.itemData.defaultValue
      this.itemData.controlData = this.itemData.defaultValue
      if (this.itemData.defaultOptions) {
        this.options = this.itemData.defaultOptions
      }
    },

    // 重置 - 恢复成默认值
    reset() {
      this.controlForm.value = this.itemData.defaultValue
      this.itemData.controlData = this.itemData.defaultValue
      if (this.itemData.defaultOptions) {
        this.options = this.itemData.defaultOptions
      }
    },

    handleChange(val, index) {
      /* {
        dictCode: "AGREE",
        dictName: "同意"
      } */
      let tmpV = val;
      if (isObject(val)) {
        tmpV = tmpV.dictCode
        this.controlForm.value = val.dictName
        this.selectIndex = index
        if (this.itemData.fieldName === 'userId') {
          this.itemData.carryData = {
            userName: val.dictName
          }
        }
      }

      // 审批结果字段，选择同意-隐藏原因字段 ， 拒绝-显示原因字段
      if (this.itemData.fieldName === "operResult") {
        if (this.itemData.relatedFields && this.itemData.relatedFields !== '') {
          const info = {
            operResult: tmpV
          }
          this.$emit('handleRelatedFields', info, this.itemData.relatedFields)
        }
      }

      this.showPicker = false
      this.itemData.controlData = tmpV
      // this.$emit('update:controlData', val || '')
    },

    // 全局表单验证
    verifyForm() {
      // 滚动到表单项
      this.$refs.form.scrollToField()
      // 校验结果交给上一层组件处理 (异步的)
      return this.$refs.form.validate()
    },

    onFailed(err) {
      console.log('failed===>', err);
    },

    // 获取下一审批人
    getApiData() {
      const { operId = '' } = this.$route.query
      this.apis[this.itemData.remoteOtherApi]({ operId })
        .then(res => {
          this.options = (res || []).map(item => {
            return {
              dictCode: item.userId,
              dictName: item.userName,
            }
          })
        })
        .catch(err => {
          console.log('remoteOtherApi-err===>', err);
        })
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
</style>
