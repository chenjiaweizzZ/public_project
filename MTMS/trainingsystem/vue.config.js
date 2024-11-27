const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "/escort",
  transpileDependencies: true,
  lintOnSave: false,
  runtimeCompiler: true,
  outputDir: "escort",
  assetsDir: "static",
  css: {
    loaderOptions: {
      scss: {
        // 注意配置的键名
        data: `@import "./src/assets/scss/mixin.scss";`,
      },
    }

  },
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    webSocketServer: false,
    proxy: {
      '/': {
        target: 'http://192.168.3.191',
        changOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Need-xyj": true,
        },
      }
    }
  }
})
