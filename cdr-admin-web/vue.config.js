let path = require('path')

const webpack = require('webpack')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const gitRevision = new GitRevisionPlugin()

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: './dockerfiles/dist',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    },
    biDisplay: {
      entry: 'src/biDisplay/main.js',
      template: 'public/bi_display.html',
      filename: 'bi_display.html'
    }
  },
  devServer: {
    // disableHostCheck: true,
    port: 8080,
    proxy: {
      '^/api': {
        target: 'https://cdrapi.zwjk.com',
        // target: "http://192.168.3.174:30107",
        // target: "http://192.168.20.51:8080",
        // target: 'http://192.168.22.220:8080',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  configureWebpack: config => {
    config.module.rules
      .filter(rule => {
        return rule.test.toString().indexOf('scss') !== -1
      })
      .forEach(rule => {
        rule.oneOf.forEach(oneOfRule => {
          oneOfRule.use.splice(oneOfRule.use.indexOf(require.resolve('sass-loader')), 0, {
            loader: require.resolve('css-unicode-loader')
          })
        })
      })
    Object.assign(config.resolve.alias, {
      '@svg': resolve('src/assets/svg')
    })
    const plugins = [
      gitRevision,
      new webpack.DefinePlugin({
        'process.env.VERSION': JSON.stringify(gitRevision.version()),
        'process.env.COMMITHASH': JSON.stringify(gitRevision.commithash()),
        'process.env.BRANCH': JSON.stringify(gitRevision.branch())
      })
    ]
    return { plugins }
  }
}
