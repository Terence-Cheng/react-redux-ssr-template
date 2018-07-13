import React from 'react'
import Routes from '../config/router'
import { get, post } from '../global/ajax'
import loadInitData from '../global/load-init-data'

export default class App extends React.Component {
  render() {
    return [
      <Routes key="routes" />,
    ]
  }
}

// 请求数据的方法添加到原型上，以便于在服务端渲染的请求方法中获取context，从而设置请求头等信息
React.Component.prototype.$axiosGet = get
React.Component.prototype.$axiosPost = post
React.Component.prototype.$loadInitData = loadInitData
