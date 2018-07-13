const ejs = require('ejs')
const bootstrapper = require('react-async-bootstrapper')
const ReactDomServer = require('react-dom/server')

module.exports = (bundle, template, req, res) => {
  return new Promise((resolve, reject) => {
    const store = bundle.store
    const createApp = bundle.default

    const routerContext = {}
    const helmetContext = {}

    const app = createApp(store, routerContext, req.url, helmetContext)

    bootstrapper(app, {}, {
      reqHeaders: req.headers
    }).then(() => {
      if (routerContext.url) {
        res.redirect(routerContext.url)
        res.end()
        return
      }
      const content = ReactDomServer.renderToString(app)
      const { helmet } = helmetContext // 一定要写在renderToString后面，否则取不到改变的值

      const html = ejs.render(template, {
        appString: content,
        initialState: JSON.stringify(store.getState()),
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        globalInfo: JSON.stringify({
          path: req.path // 添加path属性，判断客户端是否二次渲染时使用
        })
      })
      res.send(html)
      resolve()
    }).catch(reject)
  })
}
