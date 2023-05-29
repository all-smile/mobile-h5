<template>
  <div>
    <div v-if="itemData.readonly" class="text-cont">
      <span class="text-label">{{
        itemData.showLabel ? itemData.fieldLabel : ""
      }}</span>
      <span class="text-main">{{ controlForm.value }}</span>
    </div>
    <van-form
      v-else
      ref="form"
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
        :type="itemData.controlType || 'text'"
        autosize
        :maxlength="itemData.maxlength"
        :show-word-limit="
          itemData.maxlength && itemData.maxlength >= 0 && !isDisable
        "
        :placeholder="!itemData.placeholder || itemData.fieldLabel"
        :error="false"
        clearable
        :readonly="isDisable"
        @blur="handleChange"
      ></van-field>
    </van-form>
  </div>
</template>

<script>
import { isObject } from "@/libs/utils.js";
export default {
  name: 'Control-Text',
  props: {
    itemData: {
      type: Object,
      default: () => { }
    }
  },
  components: {},
  data() {
    return {
      isDisable: false,
      controlForm: {
        value: ""
      },
      rules: [
        {
          required: this.itemData.isNotNull === 1 && !this.itemData.readonly,
          message: this.itemData.placeholder || this.itemData.fieldLabel,
          trigger: "onBlur"
        }
      ]
    }
  },
  computed: {},
  watch: {
    itemData: {
      handler(newV) {
        this.isDisable = newV.readonly
      },
      deep: true,
      immediate: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    // 移除校验
    clearVerify() {
      this.$refs.form && this.$refs.form.resetValidation()
    },

    // 初始化带入值
    initVal(obj = {}) {
      this.clearVerify()
      if (isObject(obj)) {
        this.controlForm.value = obj[this.itemData.fieldName]
        this.itemData.controlData = obj[this.itemData.fieldName]
      }
    },

    // 初始化默认值
    updata() {
      this.clearVerify()
      this.controlForm.value = this.itemData.defaultValue
      this.itemData.controlData = this.itemData.defaultValue
    },

    // 重置 - 恢复成默认值
    reset() {
      this.controlForm.value = this.itemData.defaultValue
      this.itemData.controlData = this.itemData.defaultValue
    },

    handleChange(event) {
      console.log('handleChange', event);
      this.itemData.controlData = this.controlForm.value
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
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "../common.less";
</style>
