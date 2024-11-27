const path = require("path");
const { merge } = require("webpack-merge");
process.env.MODE_ENV = "development";
const baseWebpackConfig = require("./webpack.base.conf");
module.exports = merge(baseWebpackConfig, {
  output: {
    path: undefined,
    filename: "static/js/[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    assetModuleFilename: "static/js/[hash:10][ext][query]",
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        include: path.resolve(__dirname, "../src"),
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          cacheCompression: false,
        },
      },
    ],
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 3030,
    hot: true,
    compress: true,
    historyApiFallback: true, // 解决vue-router刷新404问题
    proxy: {
      "/api": {
        target: "https://premisd.zwjk.com/ucd/api",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
  devtool: "cheap-module-source-map",
});
