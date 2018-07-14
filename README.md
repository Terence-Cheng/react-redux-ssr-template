# react redux 服务端渲染（同构）实战总结

react redux 服务端渲染 同构

---


## 有关服务端渲染

关于什么是服务端渲染，为什么用服务端渲染及什么是同构这里就不多做介绍，关于它们的介绍很多，可参考[链接][1]
## [项目demo链接][2]


## 渲染流程 
```flow
st=>start: 在浏览器中输入url
op=>operation: 步骤一：node中接受到此请求
op2=>operation: 步骤二：执行server-entry.js输出的函数createApp，得到react组件
op3=>operation: 步骤三：执行bootstrap函数，一般是异步请求，用来获取页面的数据，返回一个Promise对象
op4=>operation: 步骤四：执行renderToString方法拿到页面html的字符串
op5=>operation: 步骤五：执行store.getState()获取页面的初始化store，页面的title meta等标签
op6=>operation: 步骤六：将上面两个步骤获得的数据，传入到到ejs模板中，并res.send来返回给浏览器
op7=>operation: 步骤七：执行客户端入口app.js，获取上述步骤设置的初始化store数据并挂载react组件
e=>end

st->op->op2->op3->op4->op5->op6->op7->e
```
![渲染流程][3]
## 关键点
* 客户端与服务端用到的组件是一样的，但是两者的入口不一样。
服务端组件的入口server-entry.js代码 
```javascript
import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async' // 设置页面的tdk等seo信息
import { Provider } from 'react-redux'
import configureStore from './store/store'
import App from './views/App' // 与客户端公用的react组件入口

const store = configureStore()

// 导出store对象，目的是在服务端请求完数据后通过store.getState()获取store的初始值，以便供客户端使用
export { store }

/**
 * 服务端组件渲染的入口——在服务端执行
 * @param routerContext，传入一个空对象，可在node中判断是否有重定向
 * @param url 当前页面请求的url
 * @param helmetContext 传入一个空对象，可在node中获取title description 等信息
 * @returns {*}
 */
export default (routerContext, url, helmetContext) => (
  <Provider store={store}>
    <StaticRouter context={routerContext} location={url}>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </StaticRouter>
  </Provider>
)

```

* react-async-bootstrapper 具体介绍可看[链接][4]
可在react组件上执行方法，可用于数据的获取。
可在服务端执行bootstrap方法用来获取页面的数据，注意返回一个promise
```javascript
import Helmet from 'react-helmet-async'
export default class Index extends React.Component {
  bootstrap() { // react组件定义boostrap方法，在服务端执行
    const { getTopicList } = this.props
    return getTopicList()
  }
  render() {
    const { topicList } = this.props
    return (
      <div>
        <Helmet> {/* 可添加页面的title meta link 等标签*/}
          <title>cnode社区标题</title>
        </Helmet>
        <div>{JSON.stringify(topicList)}</div>
      </div>
    )
  }
}
```
* react-helmet-async 具体介绍可见[链接][5]
 可在react组件中设置title meta等标签

* 在浏览器中输入url，页面的请求被node接受到后。
获取react 组件
执行bootstrap方法，加载页面初始数据
通过renderToString方法拿到react组件的html字符串
拿到初始store 页面title meat等标签
res.send()返回给浏览器页面
```javascript
    const bootstrapper = require('react-async-bootstrapper')
    const store = bundle.store // 获取server-entry导出的store
    const createApp = bundle.default // 获取server-entry导出的函数

    const routerContext = {} // 传给createApp方法，用来获取页面的url等信息，判断是否有重定向
    const helmetContext = {} // 传给createApp方法，用来获取title meta等信息

    const app = createApp(routerContext, req.url, helmetContext) /* 步骤二 */

    bootstrapper(app, {}, { /******步骤三：重点 用来执行react组件中设置的bootstrap方法，来获取页面数据******/
      reqHeaders: req.headers // 设置react context的内容，后面会介绍这么设置的目的
    }).then(() => {
      if (routerContext.url) {
        res.redirect(routerContext.url)
        res.end()
        return
      }
      const content = ReactDomServer.renderToString(app) /* 步骤四 */
      const { helmet } = helmetContext // 一定要写在renderToString后面，否则取不到改变的值

      const html = ejs.render(template, {
        appString: content,
        initialState: JSON.stringify(store.getState()), // 步骤五：把页面的store数据传入到html模板中，在html中通过设置一个window的全局变量来获取此值
        meta: helmet.meta.toString(), // 步骤五：获取react组件中设置的meta标签
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        globalInfo: JSON.stringify({
          path: req.path // 添加path属性，判断客户端是否二次渲染时使用，后面会具体介绍
        })
      })
      res.send(html) // 步骤六 返回给浏览器页面
      resolve()
    }).catch(reject)
```
* html模板设置
```ejs
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  
  <%%- meta %>

  <%%- title %>

  <%%- link %>

  <%%- style %>

</head>
<body>
<div id="root"><%%- appString %></div>

<script>
  window.__INITIAL__STATE__ = <%%- initialState%>; /* 步骤六  设置页面的初始state */
  window.__GLOBAL__INFO__ = <%%- globalInfo%>;
</script>
</body>
</html>

```
* 页面呈现，加载js后就会执行客户端的入口，关键点就是获取服务端传入的初始化store数据
```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader' 
import { HelmetProvider } from 'react-helmet-async'

import App from './views/App'
import configureStore from './store/store'

const initialState = window.__INITIAL__STATE__ || {} // 步骤七：获取页面的初始store，达到服务端与客户端数据的统一

const store = configureStore(initialState)

const root = document.getElementById('root')
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Component />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
  root,
)
}
```

## 遇到的其他问题
* 服务端执行bootstrap发起请求获取数据时，请求头等信息会丢失，比如req.headers,ip等信息。
解决方案：bootstrap方法的第三个参数中的数据会设置到react context里。具体说明见[文档][6]
```javascript
// \server\util\server-render.js
 bootstrapper(app, {}, {
  reqHeaders: req.headers // 设置react context的内容，把请求头传入
})
//把获取数据的方法添加到react组件原型中，React.Component.prototype.$axiosGet = get，这样调用方法时可判断context中是否有此信息，进而设置请求头
```
* 服务端渲染已经请求过页面的初始数据，客户端加载页面后无需再次发起相同的请求。
 但此页面如果没有进行服务端渲染，而是直接客户端渲染，这时需要在客户端加载数据。因此需要封装一个方法，获取页面的初始数据在服务端或者客户端执行仅且执行一次。
```javascript
// \server\util\server-render.js
const html = ejs.render(template, {
        appString: content,
        initialState: JSON.stringify(store.getState()), 
        meta: helmet.meta.toString(),
        title: helmet.title.toString(),
        style: helmet.style.toString(),
        link: helmet.link.toString(),
        globalInfo: JSON.stringify({
          path: req.path // 添加path属性，判断客户端是否二次渲染时使用，在客户端发起请求时判断pathname是否与此path相等，如果相等则不请求
        })
      })
      res.send(html)
```

```javascript
// \client\global\load-init-data.js
export default function loadInitData(pathname, callback) {
  const globalInfo = window.__GLOBAL__INFO__ 

  if (globalInfo.path === pathname) {
    // 服务端渲染的页面，无需再次请求相同的数据
    globalInfo.path = false
  } else if (typeof callback === 'function') {
    // 客户端渲染执行回调并返回
    return callback()
  }
  return new Promise(resolve => resolve(true))
}
```
客户端渲染页面出现的情景：浏览器中显示服务端渲染的页面后，点击链接后尽管url改变，但是本质上是调用的history api，即无刷新更改页面地址栏，这时不会进行上述的服务端渲染。

* 客户端发起异步请求时直接写相对url即可，但是服务端发起请求必须是绝对url，因此定义一个node环境变量即可。
```javascript
// \build\webpack.base.server.js webpack 配置
plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': JSON.stringify('http://127.0.0.1:' + serverPort)
    })
]

```

```javascript
const baseUrl = process.env.API_BASE || '' // 服务端渲染请求的url必须是绝对路径
```

* import css 使用style-loader失效，因为服务端没有document对象，因此使用提取css文件的形式
 后面在总结项目时，发现[webpack-isomorphic][7]可以设置style里面的样式


  [1]: https://juejin.im/entry/58f484fd44d904006c034079
  [2]: https://github.com/buyixiaojiang/react-redux-ssr-template
  [3]: https://wscdn.ql1d.com/74305478773127965032.png
  [4]: https://www.npmjs.com/package/react-async-bootstrapper
  [5]: https://www.npmjs.com/package/react-helmet-async
  [6]: https://www.npmjs.com/package/react-async-bootstrapper
  [7]: https://www.npmjs.com/package/webpack-isomorphic
