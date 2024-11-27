// 多进程打包
const TerserPlugin = require("terser-webpack-plugin");
// css代码压缩
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// css代码抽离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 分体包体积大小
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const { merge } = require("webpack-merge");
// nodejs核心模块，直接使用
const os = require("os");
// cpu核数
const threads = os.cpus().length;
process.env.MODE_ENV = "production";
const baseWebpackConfig = require("./webpack.base.conf");
module.exports = merge(baseWebpackConfig, {
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/[name].[contenthash:10].js",
    chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
    clean: true, // 自动清空上一次的打包文件
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: path.resolve(__dirname, "../src"),
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: threads,
            },
          },
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new TerserPlugin({
      parallel: threads, // 开启多进程
    }),
    new CssMinimizerPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
    }),
    // new BundleAnalyzerPlugin(),
  ],
  externals: {
    vue: "Vue",
    axios: "axios",
    "vue-router": "VueRouter",
    echarts: "echarts",
  },
  // devtool: isProduction ? "source-map" : "cheap-module-source-map",
  devtool: "cheap-module-source-map",
});
