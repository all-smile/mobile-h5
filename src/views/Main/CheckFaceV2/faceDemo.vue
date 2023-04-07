<template>
  <div class="container">
    <div v-if="isSupported" class="Demo">
      <div class="center">
        <div>
          <div :class="['tip', {running: colorRunning}]">
            {{ tip }}
            <div v-if="tip && !colorRunning && query.isAction">
              {{actionIndex + '/' + query.actionNumber}}
            </div>
          </div>
        </div>
        <div class="ui-camera">
          <div id="videoParent" class="ui-camera-inner">
            <video id="face-live-detection-video" :muted="true" :playsinline="true" :autoplay="true">
              Please update your browser.
            </video>
          </div>
        </div>
      </div>
      <div v-if="currentColorIdx === 0" :class="['circle', 'circle1']" :style="{backgroundColor: currentColorValue}" />
      <div v-if="currentColorIdx === 1" :class="['circle', 'circle2']" :style="{backgroundColor: currentColorValue}" />
      <div v-if="currentColorIdx === 2" :class="['circle', 'circle3']" :style="{backgroundColor: currentColorValue}" />
      <div class="ui-layout-bg-bottom" />
    </div>
    <el-dialog :visible.sync="detectionVisible" width="300px" :modal-append-to-body="false" :append-to-body="false" class="timeout-dialog">
      <div class="timeout-modal-inner">
        <div>当前浏览器不支持webrtc的API，已转为降级方案</div>
        <div>请依次执行动作：眨眨眼、张张嘴、向左转头，每个动作缓慢执行3～5s</div>
        <button type="button" @click="startRecord">开始录制</button>
        <input ref="recordingVideoInput" type="file" name="video" accept="video/*" capture="user" style="display: none;" @change="changeVideo" />
      </div>
    </el-dialog>
    <el-dialog :visible.sync="timeoutVisible" width="300px" :modal-append-to-body="false" :append-to-body="false" class="timeout-dialog" :show-close="false">
      <div class="timeout-modal-inner">
        <div class="timeout-modal-title">人脸采集超时</div>
        <div class="timeout-modal-footer">
          <el-button class="timeout-modal-button" @click='reStart'>
            重新采集
          </el-button>
          <!-- <el-button class="timeout-modal-home-button" @click='goHome'>
            回到首页
          </el-button> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import eruda from 'eruda';
import BdFaceLiveDetection from '@/libs/sdk/BDFaceSdk.esm.min.js';
import { Dialog, Button } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// eruda.init();

const Bdface = require('@/libs/sdk/BDFaceSdk.esm.min.js')
console.log('Bdface', Bdface);

function getRandom(arr, n) {
  const result = new Array(n);
  let len = arr.length;
  const taken = new Array(len);
  if (n > len) {
    throw new RangeError('getRandom: more elements taken than available');
  }
  while (n--) {
    let x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export default {
  name: 'Demo',
  components: {
    elDialog: Dialog,
    elButton: Button
  },
  data() {
    return {
      tip: '',
      currentColorIdx: -1,
      currentColorValue: 'transparent',
      actionIndex: 0,
      bdFaceLiveDetection: null,
      image: '',
      detectionVisible: false,
      timeoutVisible: false,
      isSupported: BdFaceLiveDetection.isSupport(),
      query: {
        actionNumber: 4,
        code: '0145',
        threshold: 0.8,
        isAction: true
      },
      timer: null,
      risk: null,
      action: ''
    };
  },
  computed: {
    colorRunning() {
      return this.currentColorIdx !== -1;
    }
  },
  mounted() {
this.$toast.loading({
  message: '系统验证中',
  loadingType: 'spinner',
  duration: 0
});
    document.title = '人脸认证';
    // ua信息
    console.log('ua信息', BdFaceLiveDetection.UA().getResult());

    if (this.isSupported) {
      console.log('this.isSupported', this.isSupported);
      this.$nextTick(() => {
        this.init(this.query);
      });
    }
    else {
      this.detectionVisible = true;
    }
  },
  beforeDestroy() {
    if (this.bdFaceLiveDetection) {
      this.bdFaceLiveDetection.destroy();
    }
  },
  methods: {
    async init(query) {
      // 区分是否使用安全
      this.bdFaceLiveDetection = new BdFaceLiveDetection({
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
        timeout: 15000, // 检测超时事件，默认是15000毫秒
        // 是否启用安全
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
          // 权限约束，如果需要同时开启相机和⾳频权限，请设置成{video:true, audio: true}
          audio: false
        },
        isOriginImage: false,
        // 模型⽂件url前缀, 默认是当前⻚⾯根路径,可不传
        modelPath: '.',
        autoloadModels: false,
        // 可通过调节遮挡部位阈值，来调整遮挡判断。
        // occlusion: {
        //   eye: 0.8,
        //   mouse: 0.8,
        //   nose: 0.8,
        //   leftFace: 0.8,
        //   rightFace: 0.8,
        //   chin: 0.8
        // }
        vbox: [216, 216], // 与摄像头视口宽高一致
        leftYaw: 15, // 左转头阈值
        rightYaw: 15 // 右转头阈值
      });
      console.log('init bdFaceLiveDetection', this.bdFaceLiveDetection);
      this.bindEvents();
      await this.bdFaceLiveDetection.start();
      this.bdFaceLiveDetection.loadModels();
    },
    bindEvents() {
      this.bdFaceLiveDetection.on('status', status => {
        // 根据status做⼀些处理
        console.log('status', status);
        // if (status === 'loading_over') {
        //     this.loading = false;
        // }
      });
      this.bdFaceLiveDetection.on('detection:colorfinished', () => {
        console.log('炫瞳活体检测完成1');
      });
      this.bdFaceLiveDetection.on('detection:silencefinished', () => {
        console.log('静默活体检测完成1');
      });
      this.bdFaceLiveDetection.on('tip', ({ text, code }) => {
        console.log('tip', text, code);
        if (code === 'action_over') {
          return;
        }
        if (['blink', 'lookup', 'lookdown', 'mouthopen', 'headleft', 'headright'].includes(code)) {
          this.action = code + '2';
        }
        this.tip = typeof text === 'undefined' ? '请平视并正对屏幕' : text;
      });
      this.bdFaceLiveDetection.on('color', (currentColorIdx, currentColorValue) => {
        console.log('color', currentColorIdx, currentColorValue);
        this.currentColorIdx = currentColorIdx;
        this.currentColorValue = currentColorValue;
      });
      this.bdFaceLiveDetection.on('action', (val) => {
        this.actionIndex = val;
      });
      this.bdFaceLiveDetection.on('success', result => {
        console.log(result.jr);
        console.log(JSON.stringify(result));
        this.tip = '检测完成';
        // 区分是否接入安全sdk
        if (result.face) {
          const params = {
            face: result.face,
            jr: result.jr
          };
          this.fetchFaceSec(params);
        }
        else {
          this.image = result.images[0];
          this.fetchFaceLiveness([this.image]);
        }
      });
      this.bdFaceLiveDetection.on('detection:actionfinished', () => {
        console.log('动作活体完成');
      });
      this.bdFaceLiveDetection.on('fail', params => {
        console.log('fail', params);
        const type = params[0];
        if (type === 'timeout') {
          this.timer = window.setTimeout(() => {
            this.tip = '检测超时';
            this.timeoutVisible = true;
          }, 500);
        }
        else if (type === 'unsupported') {
          this.tip = '该浏览器不支持';
          this.detectionVisible = true;
        }
        else if (type === 'notallowed') {
          this.tip = '相机权限被拒绝';
          this.detectionVisible = true;
        }
        else if (type === 'notfound') {
          this.tip = '未找到相机';
          this.detectionVisible = true;
        }
        else if (type === 'notreadable') {
          this.tip = '无法读取相机';
          this.detectionVisible = true;
        }
        else if (type === 'overconstrained') {
          this.tip = '相机分辨率过低';
          this.detectionVisible = true;
        }
        else if (type === 'abort') {
          this.tip = '相机无法使用';
          this.detectionVisible = true;
        }
        else if (type === 'reject') {
          this.tip = '获取相机权限失败';
          this.detectionVisible = true;
        }
        else if (type === 'auth') {
          this.tip = '认证不通过';
        }
        else if (type === 'pdFail') {
          this.tip = '炫瞳检测失败';
        }
      });
      // 2022.07.01 改动点，新增摄像头开启事件
      this.bdFaceLiveDetection.on('camera_open', () => {
        this.tip = '请平视并正对屏幕';
      });
    },
    destroy() {
      this.actionIndex = 0;
      this.bdFaceLiveDetection.destroy();
      this.init(this.query);
    },
    // 降级方案视频录制后拿到文件处理操作
    changeVideo(e) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      e.target.value = null;
      // TODO 拿到文件后的处理逻辑
    },
    startRecord() {
      this.$refs.recordingVideoInput.click();
    },
    async reStart() {
      this.timeoutVisible = false;
      this.currentColorIdx = -1;
      this.actionIndex = 0;
      this.bdFaceLiveDetection.setOptions({
        code: getRandom(this.query.code.split(''), this.query.actionNumber).join('')
      });
      await this.bdFaceLiveDetection.restart();
    },
    goHome() {
      this.timeoutVisible = false;
      this.$router.push({ path: '/demo/home', query: this.query });
    },

    /**
     * ⼈脸图⽚解密与⻛险分析接⼝
     * 注意：由于ak sk 较敏感，客户⽅调⽤该解密需要在服务端进⾏，当前使⽤的是默认的ak，sk，
     * 实际调⽤时使⽤客户⾃⼰的ak，sk
     */
    fetchFaceSec(params) {
      const timestamp = Date.now();
      const appkey = 'xxx';
      const sign = md5(appkey + timestamp + 'xxx');
      fetch(`/face-sec/v3/decode?sign=${sign}&timestamp=${timestamp}&appkey=${appkey}`, {
        method: 'POST',
        body: JSON.stringify({
          encryType: '0',
          app: 'universe',
          data: JSON.stringify(params)
        }),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .then(response => response.json())
        .then(res => {
          // ...
          this.fetchFaceLiveness([res.result.face.images[0]]);
        });
    },
    /**
    * 图片活体检测结果接口
    * ==在线图⽚活体检测==多图活体检测接⼝，⽀持送⼊1/3/8张图⽚进⾏活体检测(如果传⼊⼀个⼈的多张图⽚，活体判断会更准确)
    */
    fetchFaceLiveness(images) {
      const data = images.map(item => {
        return {
          image: item.substring(item.indexOf(',') + 1),
          image_type: 'BASE64',
          face_field: 'spoofing'
        };
      });
      console.log('图片活体检测结果接口 data', data);
      return
      fetch('/face-api/v3/face/liveness?appid=1', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
        .then(response => response.json())
        .then(res => {
          console.log('face-api', res);
          this.bdFaceLiveDetection.destroy();
          if (res.error_code === 0) {
            const result = {
              isSuccess: res.result.face_liveness >= +this.query.threshold,
              faceLiveness: res.result.face_liveness,
              image: this.image
            }
            // 区分是否接入安全sdk
            if (this.risk) {
              result.risk = this.risk;
            }
            console.log(result);
            sessionStorage.setItem('demoResult', JSON.stringify(result))
          }
          else {
            const result = {
              isSuccess: false,
              faceLiveness: 0,
              image: this.image
            }
            // 区分是否接入安全sdk
            if (this.risk) {
              result.risk = this.risk;
            }
            sessionStorage.setItem('demoResult', JSON.stringify(result))
          }
          this.$router.push({ path: '/demo/result', query: this.query });
        });
    },
  }
};
</script>
<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
