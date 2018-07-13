const express = require('express')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const globalConfig = require('../config')
const serverRender = require('./util/server-render')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

if (!isDev) {
  const serverEntry = require('../dist/server-entry')
  const template = fs.readFileSync(path.join(__dirname, '../dist/server.ejs'), 'utf8')
  app.use('/public', express.static(path.join(__dirname, '../dist'), {
    maxAge: '30 days' // 设置缓存
  }))
  app.get('*', function (req, res, next) {
    serverRender(serverEntry, template, req, res).catch(next)
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.use(function (error, req, res) {
  console.error('页面发生了500', error)
  res.status(500).send('页面发生错误，正在修复')
})

// 攻击者可能会使用该头（缺省情况下已启用）来检测运行 Express 的应用程序，然后发动针对特定目标的攻击。
app.disable('x-powered-by')

const host = process.env.HOST || '0.0.0.0'
const port = globalConfig.server.port

app.listen(port, host, function () {
  console.log('server is listening on ' + port, process.env.NODE_ENV)
})
