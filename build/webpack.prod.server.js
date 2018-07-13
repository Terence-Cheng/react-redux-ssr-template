const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.server')

module.exports = webpackMerge(baseConfig, {
  mode: 'production'
})
