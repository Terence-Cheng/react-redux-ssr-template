const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')
const baseConfig = require('./webpack.base')
const config = require('../config')

const devConfig = webpackMerge(baseConfig, {
  mode: 'development',
  entry: {
    app: [
      'react-hot-loader/patch',
      path.join(__dirname, '../client/app.js')
    ]
  },
  output: {
    filename: '[name].[hash].js'
  },
  devServer: {
    host: '0.0.0.0',
    compress: true,
    port: process.env.PORT || config.dev.port,
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public/',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/data': 'http://localhost:' + config.server.port
    },
    disableHostCheck: true
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = devConfig
