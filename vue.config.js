const path = require("path");
// const plugins = require("./compose-plugin").Plugins;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const resolve = (dir) => path.join(__dirname, dir);
// const smp = new SpeedMeasurePlugin();

console.log("VUE_APP_PATH===", process.env.VUE_APP_PATH);
console.log("NODE_ENV===", process.env.NODE_ENV);
console.log("IS_PROD===", IS_PROD);

module.exports = {
  publicPath: IS_PROD ? process.env.VUE_APP_PATH : "/", // 公共路径
  indexPath: "index.html", // 相对于打包路径index.html的路径
  outputDir: process.env.outputDir || "dist", // 'dist', 生产环境构建文件的目录
  assetsDir: "static", // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: true, // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  // runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  pwa: {}, // 向 PWA 插件传递选项。
  chainWebpack: (config) => {
    config.devtool = () => {
      return "source-map";
    };
    config.plugin("html").tap((args) => {
      args[0].title = "H5前端框架";
      return args;
    });
    // 拆分 chunk ，抽离公共代码
    // config.optimization.runtimeChunk(true)
    config.optimization.splitChunks({
      chunks: "all",
      cacheGroups: {
        vue: {
          name: "chunk-vuejs",
          priority: 20,
          test: /[\\/]node_modules[\\/]_?vue(.*)/,
        },
        elementUI: {
          name: "chunk-elementUI",
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
        },
        vendors: {
          name: "chunk-vendors",
          priority: 20,
          test: /[\\/]node_modules[\\/]/,
          minChunks: 4,
          chunks: "initial",
        },
        common: {
          name: "chunk-commons",
          priority: 5,
          test: resolve("src/components"),
          minChunks: 3,
          reuseExistingChunk: true,
        },
      },
    });
    // 引入less全局变量
    const oneOfsMap = config.module.rule("less").oneOfs.store;
    oneOfsMap.forEach((item) => {
      item
        .use("sass-resources-loader")
        .loader("sass-resources-loader")
        .options({
          resources: [
            // path.resolve(__dirname, "./src/assets/less/base.less"), // 不采用此移动端适配方案
            path.resolve(__dirname, "./src/assets/less/public.less"),
          ],
        })
        .end();
    });
    config.resolve.symlinks(true); // 修复热更新失效
    // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
    config.plugin("html").tap((args) => {
      // 修复 Lazy loading routes Error
      args[0].chunksSortMode = "none";
      return args;
    });
    config.resolve.alias // 添加别名
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@components", resolve("src/components"))
      .set("@baseComponents", resolve("src/base-components"))
      .set("@utils", resolve("src/libs/utils"))
      .set("@views", resolve("src/views"))
      .set("@store", resolve("src/store"));

    // set svg loader
    config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();
    config.module
      .rule("icons")
      // .use('cache-loader')
      // .loader('cache-loader')
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  css: {
    extract: IS_PROD,
    requireModuleExtension: true, // 去掉文件名中的 .module
    loaderOptions: {
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // `globalVars` 定义全局对象，可加入全局变量 eg: color: @primary;
        globalVars: {
          // primary: 'red'
        },
      },
    },
  },
  devServer: {
    overlay: {
      // 让浏览器 overlay 同时显示警告和错误
      warnings: true,
      errors: true,
    },
    host: "0.0.0.0",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
    hotOnly: true, // 热更新
    // proxy: 'http://localhost:8080'   // 配置跨域处理,只有一个代理
    proxy: {
      //配置多个跨域
      "/api": {
        target: "http://172.11.11.11:7071",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api": "",
        },
        logLevel: "debug",
      },
      "/h5api": {
        target: "http://172.11.11.11:7071",
        changeOrigin: true,
        // ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/h5api": "",
        },
        logLevel: "debug",
      },
      "/api2": {
        target: "http://172.12.12.12:2018",
        changeOrigin: true,
        //ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/api2": "/",
        },
        logLevel: "debug",
      },
      // 模型文件
      "/model-face": {
        target: "https://www.i-xiao.space/",
        changeOrigin: true,
        //ws: true,//websocket支持
        secure: false,
        pathRewrite: {
          "^/model-face": "/",
        },
        logLevel: "debug",
      },
    },
  },
  /* configureWebpack: smp.wrap(
    IS_PROD
      ? {
          plugins,
        }
      : {}
  ), */
  // IE, SCRIPT1006: 缺少 ')'
  transpileDependencies: ["crypto-js"],
};
