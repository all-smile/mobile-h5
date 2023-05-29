<template>
  <van-form
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
      :placeholder="!itemData.placeholder || itemData.fieldLabel"
      clearable
      :readonly="isDisable"
      @blur="handleChange"
    >
      <template #input>
        <van-uploader
          ref="Uploader"
          v-model="fileList"
          :multiple="itemData.multiple"
          :accept="accept"
          :max-count="maxCount"
          :max-size="maxSize"
          :before-read="handleBefordRead"
          :after-read="handleAfterRead"
          :show-upload="!isDisable"
          @delete="handleDel"
          @click-preview="handlePreview"
        >
          <div class="upload_btn-outer">
            <van-button type="primary" class="upload_btn">上传文件</van-button>
          </div>
          <template #preview-cover="{ file }">
            <div class="preview-cover van-ellipsis">{{ file.name }}</div>
          </template>
        </van-uploader>
      </template>
    </van-field>
    <span class="tip" v-if="$attrs.nameId !== 'list' && !isDisable">
      支持JPG/JPEG/PNG/PDF文件，且不超过3个
    </span>
  </van-form>
</template>

<script>

import { isObject, isImg, processFileUrl } from "@/libs/utils.js";
import { fileUpload } from "@/api/common.js";
export default {
  name: 'Control-UploadFile',
  props: {
    itemData: {
      type: Object,
      default: () => { }
    }
  },
  components: {},
  data() {
    return {
      maxCount: 3,
      maxSize: 1024 * 1024 * 10,
      accept: "image/png,image/jpeg,image/jpg,application/pdf",
      fileList: Object.freeze([]),
      isDisable: false,
      // 实际上没有用到 controlForm.value 和 controlData 字段， 收集参数的时候取 carryData 字段
      controlForm: {
        value: ""
      },
      rules: [
        {
          required: this.itemData.isNotNull === 1 && !this.itemData.readonly,
          // message: this.itemData.placeholder || this.itemData.fieldLabel,
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
        if (newV.readonly) {
          this.maxCount = this.fileList.length
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    handleBefordRead(fileInfo = {}) {
      // 校验文件格式是否符合要求
      if (this.accept.indexOf(fileInfo.type) === -1) {
        this.$toast.fail('文件格式不符合要求')
        return false
      } else {
        return true
      }
    },

    handleAfterRead(fileInfo = {}) {
      const { file } = fileInfo
      let ext = ""
      if (file.name && file.name.split('.').length > 1) {
        const arr = file.name.split('.')
        ext = arr[arr.length - 1]
      }

      fileInfo.status = "uploading"
      fileInfo.message = "上传中..."

      const formData = new FormData()
      formData.append('file', file)
      fileUpload(formData)
        .then(res => {
          const { fileId = '' } = res || {}
          if (fileId) {
            setTimeout(() => {
              fileInfo.status = ""
              fileInfo.message = ""
              this.fileList[this.fileList.length - 1].fileId = fileId; // 冗余 fileId
              this.fileList[this.fileList.length - 1].ext = ext; // 冗余 ext
              this.fileList[this.fileList.length - 1].fileName = fileName; // 冗余 fileName 文件名
            }, 600)
          } else {
            fileInfo.status = "failed"
            fileInfo.message = "上传失败"
          }
        })
        .catch(err => {
          fileInfo.status = "failed"
          fileInfo.message = "上传失败"
          console.log('fileUpload-err===>', err);
        })
    },

    // 删除图片
    handleDel() {
      this.updataValue()
    },

    // 预览
    async handlePreview({ fileId, url, fileName, ext, status }) {
      if (!status) {
        console.log('handlePreview===>', fileId, url, fileName, ext, status);
        // 上传图片预览时，会触发vant的预览
        // if (isImg(fileName)) {
        //   this.$refs.Uploader.closeImagePreview() // 关闭 vant 图片预览
        // }
      }
    },

    updataValue() {
      const fileIdList = this.fileList.map(item => {
        return item.fileId
      })

      this.itemData.carryData = {
        [this.itemData.fieldName]: fileIdList
      }
    },

    // 移除校验
    clearVerify() {
      this.$refs.form && this.$refs.form.resetValidation()
    },

    // 初始化带入值
    initVal(obj = {}) {
      this.clearVerify()
      const tmpArr = obj[this.itemData.fieldName]
      if (isObject(obj) && Array.isArray(tmpArr)) {
        const _fileList = tmpArr.map(item => {
          return {
            isImage: isImg(item.fieldName),
            file: { name: item.fileName }, // 伪造一个 File 对象， 用来展示文件名
            fileName: item.fileName,
            url: processFileUrl(item.fileId), // 通过 fileId 拼接文件链接
            fileId: item.fileId,
            ext: item.ext, // .pdf
          }
        })
        this.fileList = _fileList
        this.updataValue()
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
<style lang='less' rel='stylesheet/less' scoped>
.tip {
  color: #888;
  font-size: 0.12rem;
  padding-left: calc(0.85rem + 28px);
  display: inline-block;
  width: 100%;
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  color: #fff;
  font-size: 0.12rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
/deep/ .van-uploader__preview-image,
/deep/ .van-uploader__file {
  width: 0.6rem !important;
  height: 0.6rem !important;
}
.upload_btn-outer {
  display: flex;
  align-items: center;
  height: 0.6rem;
  .upload_btn {
    font-size: 0.14rem;
    padding: 0;
    height: 0.3rem;
  }
}
</style>
