<template>
  <div class="list">
    <van-tabs v-model="listQuery.isFinish" @change="onChange">
      <van-tab
        v-for="item in statusList"
        :key="item.val"
        :name="item.val"
        :title="item.desc"
      >
        <div
          ref="tabContWare"
          class="tab_cont"
          v-if="listQuery.isFinish === item.val"
        >
          <scroll-wrap
            v-if="item.val !== ''"
            @pullingDown="onPullingDown"
            @pullingUp="onPullingUp"
            :refreshInfo="refreshInfo"
            :immediateCheck="false"
          >
            <template v-slot:content>
              <template v-if="listData.length > 0">
                <tab-content
                  v-for="(item, index) in listData"
                  :key="`${item.operId}-${index}`"
                  :itemData="item"
                  :isFinished="listQuery.isFinish"
                  @keepPos="keepPos"
                ></tab-content>
              </template>
            </template>
          </scroll-wrap>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { fetchTaskList } from "@/api/index.js"
import ScrollWrap from "@/components/scroll-wrap";
import TabContent from './Vue/tab-content'
import { EopBizTypeEnum, EwLevel } from "@/contants/enumVars.js"
import { formatTime } from "@/libs/utils.js"
export default {
  name: 'List',
  props: {},
  components: {
    ScrollWrap,
    TabContent
  },
  data() {
    return {
      // 记录进入详情页时的列表滚动位置，只有从详情页返回的时候才保持原来的位置
      scrollY: 0,
      refreshInfo: {
        isRefreshing: false,
        isFinished: false,
        loading: false,
      },
      listQuery: {
        current: 1,
        size: 10,
        isFinish: "N", // Y-已办 N-待办
      },
      listData: Object.freeze([
        // {
        //   operId: '123',
        //   bizType: 'EOP_WITHDRAWALS', // 提款申请
        //   todoTaskType: '',
        //   title: '河南省郑州市金水区发起的提款申请，提款金额8960.00元',
        //   operTime: '2023-03-15 10:00',
        //   createTime: '2023-03-15 10:00',
        //   ewLevel: 'COMMON',
        //   ewLevelName: '一般预警'
        // }
      ]),
      statusList: Object.freeze([
        {
          id: 1,
          val: "N",
          desc: '待办'
        },
        {
          id: 2,
          val: "Y",
          desc: '已办'
        },
      ])
    }
  },
  computed: {},
  watch: {},
  created() {
    const { isFinish = "N" } = this.$route.query; // ?isFinish=xxx
    this.listQuery.isFinish = isFinish
    this.initData()
  },
  mounted() {
    this.$EventBus.on('delTaskItem', ({ operId }) => {
      console.log('delTaskItem', operId);
      // 手动删除
      this.listData.splice(this.listData.findIndex(item => item.operId === operId), 1)
    })
  },
  methods: {
    initData() {
      try {
        this.refreshInfo.isRefreshing = true
        fetchTaskList(this.listQuery)
          .then((res) => {
            console.log(res);
            let { total = 0, records: list = [] } = res || {}
            total = total || 0
            list = list || []
            if (+total === 0) {
              this.refreshInfo.isFinished = true
            }
            let tmpArr = []
            if (list && Array.isArray(list) && list.length > 0) {
              list.forEach(item => {
                if (item.createTime) {
                  item._createTime = formatTime(item.createTime)
                }
                if (item.operTime) {
                  item._operTime = formatTime(item.operTime)
                }
                let obj = { ...item }
                obj.bizTypeInfo = EopBizTypeEnum[item.bizType]
                obj.ewLevelInfo = EwLevel[item.ewLevel || 'DEFAULT']
                tmpArr.push(obj)
              })
            }
            if (this.listQuery.current === 1) {
              this.listData = Object.assign([], [...tmpArr])
            } else {
              this.listData = Object.assign([], [this.listData.concat(tmpArr)])
            }
            if (parseInt(total) === this.listData.length) {
              this.refreshInfo.isFinished = true
            }
            this.loaded()
          })
          .catch(err => {
            this.refreshInfo.isFinished = true
            this.loaded()
            console.log('fetchTaskList-err===>', err);
          })
      } catch (err) {
        console.log('initData-err', err);
      }
    },
    loaded() {
      this.refreshInfo.isRefreshing = false
      this.refreshInfo.loading = false // 加载结束
    },

    onChange() {
      console.log('change tab');
      this.refreshInfo.isFinished = false
      this.listData = []
      this.listQuery.current = 1
      this.initData()
    },

    // 下拉刷新
    onPullingDown() {
      this.listQuery.current = 1;
      this.listData = []
      this.initData()
    },

    // 上拉加载更多
    onPullingUp() {
      console.log('上拉加载更多');
      this.listQuery.current += 1
      this.initData()
    },

    // 记录滚动位置
    keepPos() {
      console.log('scrollTop', this.$refs.tabContWare[0].scrollTop);
      this.scrollY = this.$refs.tabContWare[0].scrollTop
    }
  },

  // 组件路由守卫
  beforeRouteEnter(to, from, next) {
    // 增加 isBack 标记，用来标记是否从详情页返回列表页
    to.meta.isBack = false
    if (from.name === "Detail") {
      to.meta.isBack = true
    }
    next()
  },
  activated() {
    if (!this.$route.meta.isBack) {
      // 不是从详情页返回，则获取需要打开的tab页，定位到顶部并触发下拉刷新
      const { isFinish = 'N' } = this.$route.params
      this.listQuery.isFinish = isFinish
      this.$refs.tabContWare[0].scrollTop = 0
      this.onPullingDown()
    } else {
      // 从详情页面返回，则恢复原先的滚动位置，其它保持不变
      this.$refs.tabContWare[0].scrollTop = this.scrollY
    }
  },
  updated() { },
  beforeDestroy() { },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
.list {
  height: 100%;
  background: #f4f4f4;
}
</style>
