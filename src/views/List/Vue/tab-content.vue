<template>
  <div class="list_card" @click="viewDetail(itemData.operId)">
    <div class="list_card-ware">
      <div class="list_card-title">
        <div v-if="itemData.bizTypeInfo" class="list_card-type" :style="{backgound: itemData.bizTypeInfo.color}">
          {{itemData.bizTypeInfo.name}}
        </div>
      </div>
      <div class="list_card-cont">
        <p class="list_card-p">
          <span class="list_card-span align-mid">
            {{itemData.title}}
          </span>
        </p>
        <!-- 预警等级 EOP_WARNING -->
        <span v-if="itemData.bizType === 'EOP_WARNING'" class="list_card-warn" :style="{border: `1px solid ${itemData.ewLevelInfo.color}`, color: itemData.ewLevelInfo.color}">
          {{itemData.ewLevelInfo.name}}
        </span>
      </div>
    </div>
    <p class="list_card-time">
      {{isFinish === 'Y' ? itemData._operTime : itemData._createTime}}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Tab-Content',
  props: {
    itemData: {
      type: Object,
      default: () => { }
    },
    isFinish: {
      type: String,
      default: 'N'
    }
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() { },
  mounted() { },
  methods: {
    viewDetail(operId) {
      if (!operId) {
        this.$toast.fail('该条信息缺失operId参数')
        return
      }
      // 触发位置记录
      this.$emit('keepPos')
      this.$router.push({
        path: `/detail?operId=${operId}`
      })
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.list_card {
  padding: 0.08rem;
  margin-bottom: 0.05rem;
  position: relative;
  background: #fff;
  cursor: pointer;
  &-ware {
    display: flex;
    align-items: flex-start;
  }
  &-title {
    width: 0.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &-cont {
    flex: 1;
  }
  &-type {
    display: flex;
    vertical-align: middle;
    width: 0.4rem;
    height: 0.4rem;
    padding: 0.05rem;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    text-align: center;
    font-size: 0.12rem;
  }
  &-span {
    font-size: 0.14rem;
  }
  &-warn {
    font-size: 0.12rem;
    display: inline-block;
    border-radius: 3px;
    line-height: 0.14rem;
  }
  &-time {
    font-size: 0.12rem !important;
    text-align: right;
  }
}
</style>
