const axios = require('axios')
const NativeModule = require('module')
const vm = require('vm')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const path = require('path')
const proxy = require('http-proxy-middleware')
const globalConfig = require('../../config')
const serverConfig = require('../../build/webpack.dev.server')
const serverRender = require('./server-render')

const { port: clientDevPort } = globalConfig.dev

const getTemplate = () => new Promise((resolve, reject) => {
  axios.get(`http://localhost:${clientDevPort}/public/server.ejs`)
    .then(res => {
      resolve(res.data)
    })
    .catch(reject)
})

/* const getServerEntry = new Promise((resolve, reject) => {
  axios.get(`http://localhost:${serverPort}/server-public/server-entry.js`, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
    .then(res => {
      console.log('server-entry.js')
      resolve(res.data)
    })
    .catch(reject)
}) */
/**
 * js字符串转换成js
 * @param bundle
 * @param filename
 * @returns {{exports: {}}}
 */
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const mfs = new MemoryFs
const serverCompiler = webpack(serverConfig)

serverCompiler.outputFileSystem = mfs

let serverBundle

/**
 * 监听输出文件的变化 实现热更新
 */
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  serverBundle = m.exports
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:' + clientDevPort
  }))

  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      return res.send('waiting for compile, refresh later')
    }
    getTemplate().then(template => {
      return serverRender(serverBundle, template, req, res)
    }).catch(next)
  })
}
