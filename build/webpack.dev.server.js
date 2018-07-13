const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.server')
const config = require('../config')

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    compress: true,
    port: process.env.PORT || config.dev.serverPort,
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/server-public/',
    disableHostCheck: true
  }
})
