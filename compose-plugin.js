const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin"); // gzip压缩，配合nginx
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 代码压缩
// const JavaScriptObfuscator = require("webpack-obfuscator");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");

const { chalk } = require("@vue/cli-shared-utils");
const runTime = process.env.VUE_APP_RUNTIME;

let _plugins = [
  new ProgressBarPlugin({
    format:
      " build [:bar] " + chalk.green.bold(":percent") + " (:elapsed seconds)",
    clear: false,
  }),
  // JavaScriptObfuscator 插件影响百度人脸活体检测sdk的使用，打包部署后会出现页面崩溃的现象
  // new JavaScriptObfuscator(
  //   {
  //     // 压缩 无换行
  //     compact: true,
  //     // 启用干扰调试， 会导致浏览器假死
  //     debugProtection: runTime === "prod",
  //     // 启用干扰调试， 会导致浏览器加斯
  //     debugProtectionInterval: runTime === "prod",
  //     // 禁用console,通过用空函数替换他们来实现
  //     disableConsoleOutput: runTime === "prod",
  //     // 匹配不加固的代码绝对路径， 示例： 不加固依赖包： ['**/node_modules/**']
  //     exclude: ["**/node_modules/**", "**/src/libs/sdk/**"],
  //     // 允许在特定域，子域上运行混淆后的代码(白名单)
  //     domainLock: [],
  //   },
  //   ["**/node_modules/**"],
  //   ["**/src/libs/sdk/**"]
  // ),
  // 代码压缩
  new UglifyJsPlugin({
    // 压缩配置 uglifyOptions
    uglifyOptions: {
      compress: {
        drop_debugger: true,
        drop_console: true, //生产环境自动删除console
      },
      warnings: false,
    },
    cache: true, //是否启用文件缓存，默认缓存在node_modules/.cache/uglifyjs-webpack-plugin.目录
    sourceMap: false,
    parallel: true, // 使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
  }),
  // gzip 压缩
  new CompressionPlugin({
    test: /\.(js|css|html|svg)?$/i, // 压缩文件格式
    filename: "[path].gz[query]", // 压缩后的文件名
    algorithm: "gzip", // 使用gzip压缩
    threshold: 10240, //对10K以上的数据进行压缩
    deleteOriginalAssets: false, //是否删除原文件
    minRatio: 0.8, // 压缩率小于1才会压缩
  }),
  new HardSourceWebpackPlugin(),
];

if (runTime === "prod-analyze") {
  _plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: "static", // server
      analyzerPort: "7000",
      openAnalyzer: false,
    })
  );
}

module.exports = {
  Plugins: _plugins,
};
