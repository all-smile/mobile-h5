<template>
  <div
    v-if="isExternal"
    class="svg-external-icon svg-icon"
    :style="styleExternalIcon"
  ></div>
</template>

<script>
import { isExternal } from "@/libs/utils";
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: ''
    }
  },
  components: {},
  data() {
    return {}
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass)
    },
    iconName() {
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      if (this.className) {
        return `svg-icon ${this.className}`
      }
      return 'svg-icon'
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      }
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
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
