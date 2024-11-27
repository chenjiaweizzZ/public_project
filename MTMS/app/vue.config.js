const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "/escortapp",
  transpileDependencies: true,
  lintOnSave: false,
  runtimeCompiler: true,
  outputDir: "escortapp",
  assetsDir: "static",
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    webSocketServer: false,
    proxy: {
      '/': {
        target: 'http://192.168.3.71',
        changOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          "Need-xyj": true,
        },
      },
      // '/service-pub': {
      //   target: 'http://192.168.3.191:18080',
      //   changOrigin: true,
      //   headers: {
      //     'Access-Control-Allow-Origin': '*'
      //   },
      // },

    }
  }
})

