<template>
  <div class="ware"></div>
</template>

<script>
// 文件预览
import mixinsFilePreview from "@/mixins/filePreview.js";
import { fileMgrUrl, fileFileUrl } from "@/api/common.js";
import { baseUrl } from '@/libs/config.js'
import UploadFile from '@/base-components/Control/UploadFile'
export default {
  name: 'File-Show',
  props: {
    fileInfo: {
      type: Array,
      default: () => []
    },
    fieldList: {
      type: Array,
      default: () => []
    },
    // 信息分组的 key 值
    outerFieldName: {
      type: String,
      default: ''
    },
    innerFieldName: {
      type: String,
      default: ''
    },
    itemData: {
      type: Object,
      default: () => { }
    },
  },
  components: { UploadFile },
  mixins: [mixinsFilePreview],
  data() {
    return {}
  },
  computed: {
    files() {
      return this.itemData[this.outerFieldName][this.innerFieldName]
    }
  },
  watch: {},
  created() { },
  mounted() {
    this.$nextTick(() => {
      this.$refs.UploadFile && this.$refs.UploadFile.forEach(item => {
        const nameId = item.$attrs.nameId
        item.initVal && item.initVal({
          [nameId]: this.itemData[this.outerFieldName][nameId]
        })
      })
    })
  },
  methods: {
    viewFile(item) {
      console.log("file", item);
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.file_show {
  &-ul {
    padding: 0 0.16rem;
  }
  &-li {
    padding: 0.08rem 0;
    border-bottom: 1px solid #ebedf0;
    &:last-child {
      border: none;
    }
  }
}
</style>
