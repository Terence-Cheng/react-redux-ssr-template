import React from 'react'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import configureStore from './store/store'
import App from './views/App'

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
