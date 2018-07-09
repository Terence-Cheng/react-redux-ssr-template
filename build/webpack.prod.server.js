const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.dev.server')

module.exports = webpackMerge(baseConfig, {
  mode: 'production'
})
