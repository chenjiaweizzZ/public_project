'use strict'
const config = require('../config')
const webpack = require('webpack')
const path = require('path')
const { assetsPath } = require('./utils')
module.exports = {
  entry: {
    vue: ['vue','vue-router','vuex','axios'],
    element: ['element-ui', 'tesla-ui'],
    echarts: ['echarts', 'v-charts'],
    tinymce: ['tinymce', '@tinymce/tinymce-vue']
  },
  output:{
    filename: assetsPath('dll/[name].dll.js'),
    library: '[name]_library',
    path: config.build.assetsRoot
  },
  plugins:[
    new webpack.DllPlugin({
      path: path.join(config.build.assetsRoot, assetsPath('dll/[name]-manifest.json')),
      name: '[name]_library'
    })
  ]
}