<template>
  <div class="facePhoto" id="videoWrapper">
    <video id="face-live-detection-video"></video>
    <!-- <div class="facePhoto__see"> -->
    <!-- <video id="myVideo" class="facePhoto__video" @loadedmetadata="fnRun"></video> -->
    <!-- 视频流+算法检测的画布 -->
    <!-- <canvas id="myCanvas" class="facePhoto__canvas" style='margin: 0;padding: 0;'></canvas> -->
    <!-- </div> -->
    <!-- 用于截图留存的画布 -->
    <!-- <canvas id="myCanvasImg" class="facePhoto__canvasImg" style='margin: 0;padding: 0;'></canvas>
    <div class="take-photo">
      <div @click='captureAvg'>拍照</div>
      <div @click='stopStream'>关闭摄像设备</div>
    </div>
    <img v-if="catchFace!==''" :src="catchFace" /> -->
  </div>
</template>

<script>
import * as faceapi from 'face-api.js';
import { isArray } from '@utils'
import BDFaceSdk from '@/libs/sdk/BDFaceSdk.esm.min.js';
export default {
  name: 'TestFace',
  props: {},
  components: {},
  data() {
    return {
      demo: null,
      nets: "tinyFaceDetector", //
      options: null, // 模型参数
      withBoxes: true, // true-框, false-轮廓
      detectFace: "detectAllFaces", // detectSingleFace-单 detectAllFaces-多人脸
      detection: "landmark", // landmark-轮廓检测, expression-表情检测, age_gender-年龄性别检测
      videoEl: null,
      canvasEl: null,
      canvasElImg: null,
      timeout: 0,
      catchFace: '',
      localMediaStream: '',
      isVerifying: false,
      callback: null,
      errorMap: {
        'NotAllowedError': '摄像头已被禁用，请在系统设置或者浏览器设置中开启后重试',
        'AbortError': '硬件问题，导致无法访问摄像头',
        'NotFoundError': '未检测到可用摄像头',
        'NotReadableError': '操作系统上某个硬件、浏览器或者网页层面发生错误，导致无法访问摄像头',
        'OverConstrainedError': '未检测到可用摄像头',
        'SecurityError': '摄像头已被禁用，请在系统设置或者浏览器设置中开启后重试',
        'TypeError': '类型错误，未检测到可用摄像头'
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    // this.initFaceApiModel()
    this.$toast.clear()
  },
  mounted() {
  },
  methods: {
    async initFaceApiModel(callback = null) {

      console.log('BDFaceSdk', BDFaceSdk);

      this.demo = new BDFaceSdk({
        // 对应html中id为video的dom元素id
        video: 'face-live-detection-video',
        // 活体⽅案类型： 0-静默检测；1-动作检测；2-炫瞳检测
        solutionType: 1,
        // 如果是动作检测或炫瞳检测，⾃定义需要做的动作序列：
        // 0-眨眼；1-张嘴；2-向右转头；3-向左转头；4-向上抬头；5-向下低头
        code: '135',
        // 是否随机动作，开启后会随机指定⼀个动作，如果不是随机的可以通过code属性进⾏灵活配置
        randomMotionDetection: false,
        // 是否开启录制功能
        needToRecord: true,
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
          audio: false
        },
        // 模型⽂件url前缀, 默认是当前⻚⾯根路径,可不传
        modelPath: '.', // '/models',
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
      console.log('this.demo', this.demo);
      this.demo.start();
      this.demo.on('status', status => {
        // 根据status做⼀些处理
        console.log('status', status);
      });

      this.demo.on('action', index => {
        // 返回已经完成的动作数量，⽤户每次做完⼀个动作，index就会+1
        // index范围 [1, code.length]
        console.log('action', index);
      });

      this.demo.on('tip', ({ code, text }) => {
        // 根据code或者text在⻚⾯中给出提示⽂案
        console.log('code', code, 'text', text);
      });

      this.demo.on('color', (currentColorIdx, currentColorValue) => {
        // 返回当前正在打光的颜⾊索引和颜⾊值
        // currentColorIdx范围 [0, 2]
        // currentColorValue范围 ['#db357f', '#1eb848', '#371dc0']
        // ⽤户可以根据currentColorIdx和currentColorValue⾃⾏打光，具体实现可参考示例demo
        console.log('color', currentColorIdx, currentColorValue);
      });

      this.demo.on('success', ({ images, video }) => {
        // images：静默活体、动作活体、炫瞳活体的四张质量检测最优图⽚
        // video：录制视频blob⽂件
        console.log('success', images, video);
      });

      this.demo.on('fail', params => {
        // params: [type, images]
        // params[0]：失败类型
        // params[1]: 质量检测图⽚
        const type = params[0];
        console.log('fail', params, type);
      });
      /*try {
        this.callback = callback
        // 加载所有模型数据，models 是存放模型数据文件的目录

        // 1. 加载本地模型文件
        await faceapi.nets[this.nets].loadFromUri("/models"); // 算法模型
        await faceapi.loadFaceLandmarkModel("/models"); // 轮廓模型
        // await faceapi.loadFaceExpressionModel("./models"); // 表情模型
        // await faceapi.loadAgeGenderModel("./models"); // 年龄模型

        // 2. nginx托管静态资源， 配置反向代理 path: model-face
        // await faceapi.nets[this.nets].loadFromUri("https://www.i-xiao.space/model-face/"); // 算法模型
        // await faceapi.loadFaceLandmarkModel("https://www.i-xiao.space/model-face/"); // 轮廓模型

        // 根据算法模型参数识别调整结果
        switch (this.nets) {
          case "ssdMobilenetv1":
            this.options = new faceapi.SsdMobilenetv1Options({
              // 最小置信值，大于等于这个值才被认为检测到了人脸，然后返回一个detection对象
              minConfidence: 0.5, // 0.1 ~ 0.9
              // 最多返回人脸的个数
              maxResults: 100  // default: 100
            });
            break;
          case "tinyFaceDetector":
            // 模型的配置参数
            // 实测下来，Tiny Face Detector 模型的性能非常好，检测的准确度也不错，只有人脸很小的时候，会有较大偏差，scoreThreshold 阈值为 0.6 时最佳
            this.options = new faceapi.TinyFaceDetectorOptions({
              // 输入的数据源大小，这个值越小，处理速度越快。常用值：128, 160, 224, 320, 416, 512, 608
              inputSize: 512, // default: 416
              // // 用于过滤边界的分数阈值，大于等于这个值才被认为检测到了人脸，然后返回一个detection对象, 0.1 ~ 0.9
              scoreThreshold: 0.6, // default: 0.5
            });
            break;
          case "mtcnn":
            // 多任务级联卷积神经网络
            this.options = new faceapi.MtcnnOptions({
              // 人脸尺寸的最小值，小于这个尺寸的人脸不会被检测到
              minFaceSize: 20, // default: 20
              // 比例因子用于计算图像的比例步长
              scaleFactor: 0.709, // 0.1 ~ 0.9 default: 0.709
            });
            break;
        }
        // 节点属性化
        this.videoEl = document.getElementById("myVideo");
        this.canvasEl = document.getElementById("myCanvas");
        this.canvasElImg = document.getElementById("myCanvasImg");
        this.moveToCameraAVG()
      } catch (err) {
        console.log("initFaceApiModel=", err)
      }*/
    },
    // 头像相机
    moveToCameraAVG() {
      let self = this;
      let carema = [] // 摄像设备数量
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (!navigator.mediaDevices.enumerateDevices) {
        console.log("不支持 enumerateDevices() .");
      } else {
        navigator.mediaDevices.enumerateDevices()
          .then((devices) => {
            devices.forEach((device) => {
              if (device.kind === 'videoinput') {
                carema.push({
                  kind: device.kind,
                  label: device.label,
                  deviceId: device.deviceId
                })
              }
            });
            // console.log('carema', carema)
            if (carema.length === 0) {
              this.$toast.fail('没有可用摄像设备');
            }
          })
          .catch(function (err) {
            console.log(err.name + ": " + err.message);
          });
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {
          var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
          if (!getUserMedia) {
            return Promise.reject(new Error('此浏览器中未实现getUserMedia，请换个浏览器试试'));
          }
          return new Promise(function (resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        }
      }
      this.stopStream();
      // video: { facingMode: { exact: "environment" } } // 强制使用后置摄像头
      var constraints = window.constraints = {
        audio: false,
        video: {
          sourceId: 'default',
          facingMode: { exact: "user" } // 前置摄像头
        }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
          try {
            window.stream = stream;
            self.videoEl.srcObject = stream;
          } catch (error) {
            console.log("srcObject-err", error);
            self.videoEl.src = window.URL.createObjectURL(stream);
          }
          self.localMediaStream = stream;
          self.videoEl.play();
        })
        .catch((error) => {
          if (this.errorMap[error.name]) {
            this.$toast.fail(this.errorMap[error.name]);
          } else {
            // 此浏览器中未实现getUserMedia
            this.$toast.fail(`${error.name}: ${error.message}`);
          }
          this.stopStream()
          setTimeout(() => {
            this.$emit('update:openFaceVerify', false)
          }, 2000)
        });
    },
    // 头像照片
    captureAvg() {
      var ctx = this.canvasElImg.getContext('2d'),
        CHeight = this.videoEl.clientHeight, //获取屏幕大小让canvas自适应
        CWidth = this.videoEl.clientWidth;
      this.canvasElImg.width = CWidth;
      this.canvasElImg.height = CHeight;
      if (this.localMediaStream) {
        ctx.drawImage(this.videoEl, 0, 0, CWidth, CHeight); // 向画布上绘制图片
        // HTMLCanvasElement.toDataURL() 返回一个包含图片展示的data url (base64)
        var dataURL = this.canvasElImg.toDataURL('image/jpeg'); //dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA'
        this.catchFace = dataURL;
        // this.doVerify()
        // 停止摄像机
        // this.stopStream();
      }
    },
    // 调用后端接口进行人脸比对
    async doVerify() {
      try {
        // base64 catchFace
        // let res = await
        this.isVerifying = true
        // let res = await this.Global.api.getListAPI()
        // console.log(res)
        this.$toast('识别中...')
        setTimeout(() => {
          // 识别成功
          this.stopStream()
          this.callback && this.callback(true)
        }, 2000)
      } catch (err) {
        this.stopStream()
        console.log(err)
      }
    },
    // 关闭摄像头
    stopStream() {
      console.log('stopStream=========')
      clearTimeout(this.timeout);
      if (!this.videoEl.srcObject) return
      this.canvasEl
        .getContext("2d")
        .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      this.videoEl.pause();
      if (window.stream) {
        window.stream.getTracks().forEach(track => { track.stop(); });
        window.stream = "";
        this.videoEl.srcObject = null;
      }
    },
    // 人脸面部勘探轮廓识别绘制
    async fnRunFaceLandmark() {
      // console.log("RunFaceLandmark");
      if (this.videoEl.paused) return clearTimeout(this.timeout);
      // 识别绘制人脸信息
      const result = await faceapi[this.detectFace](
        this.videoEl,
        this.options
      ).withFaceLandmarks();
      // console.log('result===', result)
      if (isArray(result) && result.length > 1) {
        this.$toast({
          message: '检测出多张人脸',
          duration: 800
        })
      } else if (isArray(result) && result.length === 1 && !this.videoEl.paused) {
        const dims = faceapi.matchDimensions(this.canvasEl, this.videoEl, true);
        const resizeResult = faceapi.resizeResults(result, dims);
        this.withBoxes
          ? faceapi.draw.drawDetections(this.canvasEl, resizeResult)
          : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeResult);
        // 检测到人脸之后 保留图像进行验证
        // !this.isVerifying && this.captureAvg()
      } else {
        this.canvasEl
          .getContext("2d")
          .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
      }
      this.timeout = setTimeout(() => this.fnRunFaceLandmark(), 0); // 递归调用，实时检测
    },
    // 执行检测识别类型
    fnRun() {
      // 轮廓检测
      if (this.detection === "landmark") {
        this.fnRunFaceLandmark();
        return;
      }
    },
  },
  updated() { },
  beforeDestroy() {
    this.stopStream()
    // 销毁验证流程，建议在组件卸载时调⽤
    this.demo.destroy();
  },
  beforeRouteLeave(to, from, next) {
    this.stopStream()
    next()
  }
}
</script>

<style lang='less' rel='stylesheet/less' scoped>
@import "./index.less";
</style>
