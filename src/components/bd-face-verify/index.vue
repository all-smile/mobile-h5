<template>
  <div class="container">
    <div v-if="isSupported" class="facePhoto">
      <div class="center">
        <div :class="['tip', { running: colorRunning }]">
          {{ tip }}
          <div v-if="tip && !colorRunning && query.isAction">
            {{ actionIndex + "/" + query.actionNumber }}
          </div>
        </div>
        <div class="ui-camera">
          <div id="videoParent" class="ui-camera-inner">
            <video
              id="face-live-detection-video"
              :muted="true"
              :playsinline="true"
              :autoplay="true"
            >
              Please update your browser.
            </video>
          </div>
        </div>
      </div>
      <div
        v-if="currentColorIdx === 0"
        :class="['circle', 'circle1']"
        :style="{ backgroundColor: currentColorValue }"
      ></div>
      <div
        v-if="currentColorIdx === 1"
        :class="['circle', 'circle2']"
        :style="{ backgroundColor: currentColorValue }"
      ></div>
      <div
        v-if="currentColorIdx === 2"
        :class="['circle', 'circle3']"
        :style="{ backgroundColor: currentColorValue }"
      ></div>
    </div>
  </div>
</template>

<script>
import BDFaceLiveDetection from '@/libs/sdk/BDFaceSdk.esm.min.js';

// console.log('BDFaceLiveDetection', BDFaceLiveDetection);
const IS_PROD = ["production", 'prod'].includes(process.env.NODE_ENV)

// 动作乱序
function getRandom(arr, n) {
  const result = new Array(n)
  let len = arr.length
  const taken = new Array(len)
  if (n > len) {
    throw new RangeError("getrandom: more elements taken than available")
  }
  while (n--) {
    let x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

function getCode() {
  // 预设3个动作 (0和1必须，然后再从 [2,3,4,5] 中随机出来一个动作，并整体随机重新排序)
  let preCode = [0, 1, Math.floor(Math.random() * 4 + 2)]
  return getRandom(preCode, 3)
}

console.log('code', getCode());

export default {
  name: 'FaceVerify',
  props: {},
  components: {},
  data() {
    return {
      tip: '',
      currentColorIdx: -1,
      currentColorValue: "transparent",
      actionIndex: 0,
      bdFaceLiveDetection: null,
      image: "",
      isSupported: BDFaceLiveDetection.isSupport(),
      query: {
        actionNumber: 3,
        // 0-眨眼 1-张嘴 2-向右转头 3-向左转头 4-向上抬头 5-向下低头
        // code: "013",
        code: getCode().join(""),
        threshold: 0.8,
        isAction: true
      },
      timer: null,
      risk: null,
      action: "",
    }
  },
  computed: {
    colorRunning() {
      return this.currentColorIdx !== -1;
    }
  },
  watch: {},
  created() {
    this.$toast.clear()
  },
  mounted() {
    console.log("this.isSupported", this.isSupported);
    if (this.isSupported) {
      this.$nextTick(() => {
        this.init(this.query)
      })
    } else {
      this.tip = "该浏览器不支持"
      this.deviceTip()
    }
  },
  methods: {
    deviceTip() {
      this.$dialog.confirm({
        message: this.tip,
        showCancelButton: false,
      })
        .then(() => {
          console.log("关闭-不支持webrtc");
          // this.$emit('update:openFaceVerify', false)
        })
        .catch(() => {
          console.log("关闭-不支持webrtc-catch");
        })
    },

    async init(query) {
      // 区分是否使用安全

      this.bdFaceLiveDetection = new BDFaceLiveDetection({
        // 对应html中id为video的dom元素id
        video: 'face-live-detection-video',
        // 活体⽅案类型： 0-静默检测；1-动作检测；2-炫瞳检测
        solutionType: 2,
        // 如果是动作检测或炫瞳检测，⾃定义需要做的动作序列：
        // 0-眨眼；1-张嘴；2-向右转头；3-向左转头；4-向上抬头；5-向下低头
        code: query.code,
        // 是否随机动作，开启后会随机指定⼀个动作，如果不是随机的可以通过code属性进⾏灵活配置
        randomMotionDetection: false,
        // 是否开启录制功能
        needToRecord: false,
        // 检测超时时间， 默认 150000 毫秒
        timeout: 15000,
        // 是否启用安全，用于图片加密
        useSecure: true,
        // 权限约束
        constraints: {
          video: {
            width: {
              min: 320,
              ideal: 320,
              max: 320
            },
            height: {
              min: 240,
              ideal: 240,
              max: 240
            }
          },
          // 权限约束，如果需要同时开启相机和音频权限，请设置 video: true, audio: true
          audio: false
        },
        isOriginImage: false,
        // 模型⽂件url前缀, 默认是当前⻚⾯根路径,可不传
        modelPath: IS_PROD ? process.env.VUE_APP_RUNPATH : '.',
        autoloadModels: false,
        // 与摄像头视口高度一致
        vbox: [216, 216],
        // 左转头阈值
        leftYaw: 15,
        // 右转头阈值
        rightYaw: 15,
        // 可通过调节遮挡部位阈值，来调整遮挡判断。
        occlusion: {
          eye: 0.8,
          mouse: 0.8,
          nose: 0.8,
          leftFace: 0.8,
          rightFace: 0.8,
          chin: 0.8
        }
      });
      console.log('this.bdFaceLiveDetection', this.bdFaceLiveDetection);
      this.bindEvents();
      await this.bdFaceLiveDetection.start();
      this.bdFaceLiveDetection.loadModels()
    },
    bindEvents() {
      this.bdFaceLiveDetection.on('camera_open', () => {
        console.log("camera_open");
        this.tip = "摄像头即将开启，请平视并正对屏幕"
      })

      this.bdFaceLiveDetection.on('status', status => {
        // 根据status做⼀些处理
        console.log('status', status);
      });

      this.bdFaceLiveDetection.on('detection:colorfinished', () => {
        console.log("炫瞳活体检测完成1");
      })

      this.bdFaceLiveDetection.on('detection:silencefinished', () => {
        console.log("静默活体检测完成1");
      })

      this.bdFaceLiveDetection.on('detection:actionfinished', () => {
        console.log("活体动作完成");
      })

      this.bdFaceLiveDetection.on('action', index => {
        // 返回已经完成的动作数量，⽤户每次做完⼀个动作，index就会+1
        // index范围 [1, code.length]
        console.log('action', index);
        this.actionIndex = index
      });

      this.bdFaceLiveDetection.on('tip', ({ code, text }) => {
        // 根据code或者text在⻚⾯中给出提示⽂案
        console.log('code', code, 'text', text);
        if (code === "action_over") {
          return
        }
        if (["blink", "lookup", "lookdown", "mouthopen", "headleft", "headright"].includes(code)) {
          this.action = code + '2'
        }
        this.tip = typeof text === "undefined" ? "请平视并正对屏幕" : text;
      });

      this.bdFaceLiveDetection.on('color', (currentColorIdx, currentColorValue) => {
        // 返回当前正在打光的颜⾊索引和颜⾊值
        // currentColorIdx范围 [0, 2]
        // currentColorValue范围 ['#db357f', '#1eb848', '#371dc0']
        // ⽤户可以根据currentColorIdx和currentColorValue⾃⾏打光，具体实现可参考示例demo
        console.log('color', currentColorIdx, currentColorValue);
        this.currentColorIdx = currentColorIdx;
        this.currentColorValue = currentColorValue
      });

      this.bdFaceLiveDetection.on('success', (result) => {
        console.log('success', result);
        // images：静默活体、动作活体、炫瞳活体的四张质量检测最优图⽚
        // video：录制视频blob⽂件
        this.tip = "检测完成，正在进行系统验证";
        this.$toast.loading({
          message: "系统验证中",
          forbidClick: false,
          loadingType: "spinner",
          duration: 0
        })
        // 区分是否接入安全sdk
        if (result.face) {
          const params = {
            face: result.face,
            jr: result.jr
          }
          this.fetchFaceSec(params)
        } else {
          console.log("fetchFaceLiveness - gg");
          /**
           * 暂不使用
           * 图片活体检测
          */
        }
      });

      this.bdFaceLiveDetection.on('fail', params => {
        // params: [type, images]
        // params[0]：失败类型
        // params[1]: 质量检测图⽚
        const type = params[0];
        console.log('fail', params, type);
        switch (type) {
          case "timeout":
            if (this.timer) {
              clearTimeout(this.timer)
            }
            this.timer = setTimeout(() => {
              this.tip = "检测超时"
              this.$dialog.confirm({
                message: "人脸采集超时，请重新采集"
              })
                .then(() => {
                  console.log("采集超时");
                  this.reStart()
                })
                .catch(() => {
                  console.log("采集超时-catch");
                  this.$emit('update:openFaceVerify', false)
                })
            }, 500)
            break;
          case "unsupported":
            this.tip = "该浏览器不支持"
            break;
          case "notallowed":
            this.tip = "相机权限被拒绝"
            break;
          case "notfound":
            this.tip = "未找到相机"
            break;
          case "notreadable":
            this.tip = "无法读取相机"
            break;
          case "overconstrained":
            this.tip = "相机分辨率过低"
            break;
          case "abort":
            this.tip = "相机无法使用"
            break;
          case "reject":
            this.tip = "获取相机权限失败"
            break;
          case "auth":
            this.tip = "认证不通过"
            break;
          case "pdFail":
            this.tip = "炫瞳检测失败"
            break;
          default:
            break;
        }
        // 统一弹窗提示　tip 信息
        if (this.tip !== "timeout") {
          this.deviceTip()
        }
      });
    },

    async reStart() {
      this.currentColorIdx = -1;
      this.actionIndex = 0;
      this.bdFaceLiveDetection.setOptions({
        code: getCode().join("")
      })
      await this.bdFaceLiveDetection.restart()
    },

    /**
     * 人脸图片解密与分线分析接口
    */
    async fetchFaceSec(params) {
      console.log('******************', params);
    },
  },
  updated() { },
  beforeDestroy() {
    if (this.bdFaceLiveDetection) {
      this.bdFaceLiveDetection.destroy()
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
