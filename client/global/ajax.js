import axios from 'axios'

const baseUrl = process.env.API_BASE || '' // 服务端渲染请求的url必须是绝对路径

function getAxiosConfig() {
  const options = {}

  if (this && this.context && this.context.reqHeaders) {
    // 服务端发起数据请求时设置请求头等信息
    const { reqHeaders } = this.context
    options.headers = reqHeaders
  }
  return options
}

const parseUrl = (url, params) => {
  const str = Object.keys(params).reduce((result, key) => {
    const queryStr = `${result}${key}=${params[key]}&`
    return queryStr
  }, '')
  return `${baseUrl}/data/${url}?${str.substr(0, str.length - 1)}`
}

export const get = function (url, params) {
  return new Promise((resolve, reject) => {
    const config = getAxiosConfig.call(this)
    axios.get(parseUrl(url, params), config)
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(reject)
  })
}

export const post = function (url, params, reqData) {
  return new Promise((resolve, reject) => {
    const config = getAxiosConfig.call(this)
    axios.post(parseUrl(url, params), reqData, config)
      .then((resp) => {
        const { data } = resp
        if (data && data.success === true) {
          resolve(data)
        } else {
          reject(data)
        }
      }).catch(reject)
  })
}
